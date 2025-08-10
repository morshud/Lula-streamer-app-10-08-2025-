import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StreamVideo, useStreamVideoClient, CallingState, CallContent, StreamCall, useCallStateHooks } from '@stream-io/video-react-native-sdk'
import { useNavigation, useRoute } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import CallManager from '../utils/CallManager'
import AuthService from '../services/AuthService'
import { handleError } from '../utils/function'
import uuid from 'react-native-uuid'
import { useSelector } from 'react-redux'
import { callType } from '../constants/data'
import { LinearGradient } from 'expo-linear-gradient'

const sendFCMNotificationViaBackend = async (token, callId, callerName, callerId) => {
  try {
    const response = await fetch('https://lula-fcm-notification.vercel.app/api/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        data: { callId, callerName, callerId },
      }),
    })
    const result = await response.text()
  } catch (error) {
    console.error('Error sending FCM notification:', error)
  }
}

const CallRoom = ({ call, endCall }) => {
    const navigation = useNavigation()
    const [isWaiting, setIsWaiting] = useState(true)
    const { useCallCallingState, useParticipantCount } = useCallStateHooks()
    const callState = useCallCallingState()
    const count = useParticipantCount()

    useEffect(() => {
        if (callState === CallingState.LEFT) {
            endCall()
            navigation.goBack()
        }
    }, [callState])

    useEffect(() => {
        if (count >= 2) {
            setIsWaiting(false)
        } else {
            setIsWaiting(true)
        }
    }, [count])

    return (
        <View style={{ flex: 1 }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                {isWaiting && (
                    <Modal transparent visible animationType="fade">
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                                <ActivityIndicator size="large" />
                                <Text style={{ marginTop: 10, textAlign: 'center' }}>Waiting for other participant to join...</Text>
                                <TouchableOpacity onPress={() => endCall()}>
                                    <LinearGradient colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)']} style={styles.sendButton}>
                                        <Text className="text-white">Close</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )}
                <CallContent
                    onHangupCallHandler={() => {
                        navigation.goBack()
                        call?.endCall()
                        endCall()
                    }}
                />
            </GestureHandlerRootView>
        </View>
    )
}

const CallComponent = () => {
    const { user } = useSelector((state) => state.auth)
    const navigation = useNavigation()
    const {
        params: { userId, id, end },
    } = useRoute()
    const client = useStreamVideoClient()
    const [call, setCall] = useState(null)
    const [slug, setSlug] = useState(null)

    const handleCall = async (callId) => {
        try {
            const res = await AuthService.getUser(userId)

            if (res?.user?.currentCall) {
                return { error: true, message: 'User Already on another Call!' }
            }

            await Promise.all([
                AuthService.update(userId, { currentCall: { callId, type: callType.INCOMING }, inCall: true }),
                AuthService.update(user?.id, { currentCall: { callId, type: callType.OUTGOING }, inCall: true }),
            ])

            // Fetch caller name once
            const callerRes = await AuthService.getUser(user.id)
            const recipientFCMToken = res.user.fcmTokens || null
            const callerName = callerRes?.user?.name || 'Unknown'

            if (recipientFCMToken) {
                await sendFCMNotificationViaBackend(recipientFCMToken, callId, callerName, user.id)
            } else {
                console.warn('Missing recipient FCM token, cannot send notification')
            }

            return { error: false, message: 'Call Created!' }
        } catch (error) {
            handleError(error)
        }
    }

    const endCall = async () => {

        await Promise.all([AuthService.update(userId, { currentCall: '', inCall: false }), AuthService.update(user.id, { currentCall: '', inCall: false })])
        call?.endCall()
        if (navigation.canGoBack()) {
            navigation.goBack()
        }
    }

    useEffect(() => {
        const joinOrCreateCall = async () => {
            let slug
            if (id) {
                slug = id.callId.toString()
                const _call = client.call('default', slug)
                if (end) {
                    await Promise.all([_call.endCall(), endCall()])
                }
                _call.join({ create: false }).then(() => {
                    setCall(_call)
                })
            } else {
                slug = uuid.v4()
                const res = await handleCall(slug)
                if (res.error) {
                    showToast(res.message, 'info')
                    navigation.goBack()
                    return
                }
                const _call = client.call('default', slug)
                _call.join({ create: true }).then(() => {
                    setCall(_call)
                })
            }

            setSlug(slug)
        }
        joinOrCreateCall()

        return () => {
            if (call?.state.callState !== CallingState.LEFT) {

                call?.endCall()
                endCall()
            }
        }
    }, [client, id])

    if (end) {
        return null
    }

    if (!call || !slug) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
                <Text style={{ marginTop: 10, textAlign: 'center' }}>Waiting for call getting connected...</Text>
                <TouchableOpacity onPress={() => endCall()}>
                    <LinearGradient colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)']} style={styles.sendButton2}>
                        <Text className="text-white">Close</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <StreamCall call={call}>
            <CallRoom call={call} endCall={endCall} />
        </StreamCall>
    )
}

const CallScreen = () => {
    const client = CallManager.instance?.getClient()

    if (!client) {
        return null
    }

    return (
        <StreamVideo client={client}>
            <CallComponent />
        </StreamVideo>
    )
}

export default CallScreen

const styles = StyleSheet.create({
    sendButton: {
        padding: 10,
        marginTop: 10,
        width: '100%',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButton2: {
        padding: 10,
        marginTop: 10,
        width: 200,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
})