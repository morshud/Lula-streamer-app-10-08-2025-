import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StreamVideoClient, StreamVideo, useStreamVideoClient, CallingState, CallContent, StreamCall } from '@stream-io/video-react-native-sdk'
import { useSelector } from 'react-redux'
import functions from '@react-native-firebase/functions'
import { useNavigation, useRoute } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import CallManager from '../utils/CallManager'

const CallRoom = ({ call }) => {
    const navigation = useNavigation()

    return (
        <View style={{ flex: 1 }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <CallContent
                    onHangupCallHandler={() => {
                        navigation.goBack()
                        call?.endCall()
                    }}
                />
            </GestureHandlerRootView>
        </View>
    )
}

const CallComponent = () => {
    const {
        params: { item, id },
    } = useRoute()
    const client = useStreamVideoClient()
    const [call, setCall] = useState(null)
    const [slug, setSlug] = useState(null)

    useEffect(() => {
        let slug
        if (id) {
            slug = id.toString()
            const _call = client.call('default', slug)
            _call.join({ create: false }).then(() => {
                setCall(_call)
            })
        } else {
            slug = item?.id
            const _call = client.call('default', slug)
            _call.join({ create: true }).then(() => {
                setCall(_call)
            })
        }
        setSlug(slug)

        return () => {
            if (call?.state.callState !== CallingState.LEFT) {
                call?.leave()

            }
        }
    }, [client, id, item?.id])

    if (!call || !slug) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }

    return (
        <StreamCall call={call}>
            <CallRoom call={call} />
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

const styles = StyleSheet.create({})
