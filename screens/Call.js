import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { StreamVideo, useStreamVideoClient, CallingState, CallContent, StreamCall, useCallStateHooks } from '@stream-io/video-react-native-sdk'
import { useNavigation, useRoute } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import CallManager from '../utils/CallManager'
import AuthService from '../services/AuthService'
import CallService from '../services/CallService'
import { handleError } from '../utils/function'
import uuid from 'react-native-uuid'
import { useSelector } from 'react-redux'
import { callType } from '../constants/data'
import { LinearGradient } from 'expo-linear-gradient'

const CallRoom = ({ call, endCall }) => {
    const navigation = useNavigation()
    const [isWaiting, setIsWaiting] = useState(true)
    const { useCallCallingState, useParticipantCount } = useCallStateHooks()
    const callState = useCallCallingState()
    const count = useParticipantCount()

    useEffect(() => {
        if (callState === CallingState.LEFT) {
            console.log('Call ended from other side')
            endCall(callState === CallingState.LEFT ? 'completed' : 'failed')
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
                                <TouchableOpacity onPress={() => endCall('cancelled')}> 
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
                        endCall('completed')
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
    const callLogIdRef = useRef(null) // Ref to store the call log ID
    const callStartTimeRef = useRef(null) // Ref to store the call start time

    const handleCall = async (callId) => {
        try {
            const res = await AuthService.getUser(userId)
            console.log(res)

            if (res?.user?.currentCall) {
                return { error: true, message: 'User Already on another Call!' }
            }

            await Promise.all([
                AuthService.update(userId, { currentCall: { callId, type: callType.INCOMING }, inCall: true }),
                AuthService.update(user?.id, { currentCall: { callId, type: callType.OUTGOING }, inCall: true }),
            ])

            console.log('Call Initiated')

            // Add call log entry when call is initiated
            const startTime = Date.now()
            callStartTimeRef.current = startTime // Store start time
            const logRes = await CallService.addCallLog({
                callerId: user.id,
                receiverId: userId,
                startTime: startTime,
                status: 'ongoing',
            })
            if (!logRes.error) {
                callLogIdRef.current = logRes.data // Store the call log ID
            } else {
                console.error('Failed to add initial call log:', logRes.message)
                // Optionally show a toast or handle this error appropriately
            }

            return { error: false, message: 'Call Created!' }
        } catch (error) {
            handleError(error)
        }
    }

    // const endCall = async () => {
    //     console.log('end call function')

    //     await Promise.all([AuthService.update(userId, { currentCall: '', inCall: false }), AuthService.update(user.id, { currentCall: '', inCall: false })])
    //     call?.endCall()
    //     if (navigation.canGoBack()) {
    //         navigation.goBack()
    //     }
    // }
    const endCall = async (status = 'completed') => { // Add status parameter
        console.log('end call function')

        // Update call log entry when call ends
        if (callLogIdRef.current) {
            const endTime = Date.now()
            const duration = callStartTimeRef.current ? Math.max(0, Math.floor((endTime - callStartTimeRef.current) / 1000)) : 0 // Calculate duration in seconds
            console.log(duration)
            await CallService.updateCallLog(callLogIdRef.current, {
                endTime: endTime,
                duration: duration,
                status: status,
            })
             callLogIdRef.current = null // Clear the stored ID
             callStartTimeRef.current = null // Clear the stored start time
        }

        // Reset user statuses
        await Promise.all([
            AuthService.update(userId, { currentCall: '', inCall: false }),
            AuthService.update(user.id, { currentCall: '', inCall: false }),
        ])

        // End Stream call
        try {
           await call?.endCall()
        } catch (error) {
            console.error('Error ending Stream call:', error)
        }
    }

    useEffect(() => {
        const joinOrCreateCall = async () => {
            let slug
            if (id) {
                slug = id.callId.toString()
                const _call = client.call('default', slug)
                if (end) {
                    // await Promise.all([_call.endCall(), endCall()])
                    await Promise.all([_call.endCall(), endCall('ended_by_receiver')])
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
            console.log(slug)

            setSlug(slug)
        }
        joinOrCreateCall()

        return () => {
            if (call?.state.callState !== CallingState.LEFT) {
                console.log('effect return')

                call?.endCall()
                endCall('completed')
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
