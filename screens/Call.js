import { ActivityIndicator, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StreamVideo, useStreamVideoClient, CallingState, CallContent, StreamCall, useCallStateHooks } from '@stream-io/video-react-native-sdk'
import { useNavigation, useRoute } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import CallManager from '../utils/CallManager'
import AuthService from '../services/AuthService'
import { handleError } from '../utils/function'
import uuid from 'react-native-uuid'
import { useSelector } from 'react-redux'

const CallRoom = ({ call, endCall }) => {
    const navigation = useNavigation()
    const { useCallCallingState } = useCallStateHooks()
    const callState = useCallCallingState()

    useEffect(() => {
        if (callState === CallingState.LEFT) {
            console.log('Call ended from other side')
            endCall()
            navigation.goBack()
        }
    }, [callState])

    return (
        <View style={{ flex: 1 }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
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
        params: { userId, id },
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
            await Promise.all([AuthService.update(userId, { currentCall: callId }), AuthService.update(user?.id, { currentCall: callId })])
            return { error: false, message: 'Call Created!' }
        } catch (error) {
            handleError(error)
        }
    }

    const endCall = async () => {
        await Promise.all([AuthService.update(userId, { currentCall: '' }), AuthService.update(user.id, { currentCall: '' })])
    }

    useEffect(() => {
        const joinOrCreateCall = async () => {
            let slug
            if (id) {
                slug = id.toString()
                const _call = client.call('default', slug)
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
                call?.endCall()
                endCall()
            }
        }
    }, [client, id])

    if (!call || !slug) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
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
