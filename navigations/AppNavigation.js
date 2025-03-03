import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import React, { useState, useEffect, useCallback } from 'react'
import NetInfo from '@react-native-community/netinfo'
import BottomTabNavigation from './BottomTabNavigation'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SplashScreen from 'expo-splash-screen'
import { useFonts } from 'expo-font'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { FONTS } from '../constants/fonts'

import {
    NoInternet,
    Select,
    Login,
    Otp,
    Main,
    Matching,
    SelectPartner,
    StartCalling,
    LiveStreaming,
    ExploreMatch,
    Notification,
    Chat,
    Setting,
    About,
    PrivacyPolicy,
    TransactionHistory,
    Plans,
    Explore,
    EditProfile,
    StreamerProfile,
    OnBoarding1,
    CreateProfile,
} from '../screens'

SplashScreen.preventAutoHideAsync()
const Stack = createNativeStackNavigator()

const AppNavigation = () => {
    const [isConnected, setIsConnected] = useState(true)
    const [isFirstLaunch, setIsFirstLaunch] = useState(null)
    const [fontsLoaded] = useFonts(FONTS)

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded])

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(!!state.isConnected)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    // Check if it's the first launch
    useEffect(() => {
        const checkFirstLaunch = async () => {
            try {
                const firstLaunch = await AsyncStorage.getItem('isFirstLaunch')
                if (firstLaunch === null) {
                    // First time launch
                    setIsFirstLaunch(true)
                    await AsyncStorage.setItem('isFirstLaunch', 'false') // Set it to false after the first launch
                } else {
                    // Not the first time
                    setIsFirstLaunch(false)
                }
            } catch (error) {
                console.error("Error checking first launch: ", error)
            }
        }

        checkFirstLaunch()
    }, [])

    const getinitialScreen = useCallback(() => {
        let initial = isFirstLaunch ? 'OnBoarding1' : 'Login'
        return initial
    }, [isFirstLaunch])

    if (isFirstLaunch === null || !fontsLoaded) {
        return null // Wait until the first launch status is determined and fonts are loaded
    }

    return (
        <SafeAreaProvider onLayout={onLayoutRootView}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={getinitialScreen()}>
                    <Stack.Screen name="NoInternet" component={NoInternet} />
                    <Stack.Screen name="OnBoarding1" component={OnBoarding1} />
                    <Stack.Screen name="Select" component={Select} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Otp" component={Otp} />
                    <Stack.Screen name="CreateProfile" component={CreateProfile} />
                    <Stack.Screen name="Main" component={Main} />
                    <Stack.Screen name="Users" component={BottomTabNavigation} />
                    <Stack.Screen name="Analytics" component={BottomTabNavigation} />
                    <Stack.Screen name="Matching" component={Matching} />
                    <Stack.Screen name="SelectPartner" component={SelectPartner} />
                    <Stack.Screen name="StartCalling" component={StartCalling} />
                    <Stack.Screen name="LiveStreaming" component={LiveStreaming} />
                    <Stack.Screen name="Feeds" component={BottomTabNavigation} />
                    <Stack.Screen name="Explore" component={Explore} />
                    <Stack.Screen name="Location" component={BottomTabNavigation} />
                    <Stack.Screen name="ExploreMatch" component={ExploreMatch} />
                    <Stack.Screen name="EditProfile" component={EditProfile} />
                    <Stack.Screen name="Notification" component={Notification} />
                    <Stack.Screen name="Profile" component={BottomTabNavigation} />
                    <Stack.Screen name="ChatList" component={BottomTabNavigation} />
                    <Stack.Screen name="Chat" component={Chat} />
                    <Stack.Screen name="Setting" component={Setting} />
                    <Stack.Screen name="About" component={About} />
                    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
                    <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
                    <Stack.Screen name="Plans" component={Plans} />
                    <Stack.Screen name="StreamerProfile" component={StreamerProfile} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}

export default AppNavigation
