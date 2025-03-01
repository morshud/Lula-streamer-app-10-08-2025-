import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import React, { useState, useEffect, useCallback } from 'react'
import NetInfo from '@react-native-community/netinfo'
import BottomTabNavigation from './BottomTabNavigation'
import { useDispatch } from 'react-redux'
import Users from "../screens/Users"
import Location from "../screens/Location"
import ChatList from "../screens/ChatList"
import Profile from "../screens/Profile"
import Analytics from "../screens/Analytics"

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


const Stack = createNativeStackNavigator()

const AppNavigation = () => {
    const [isConnected, setIsConnected] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(!!state.isConnected)
        })
        return () => { 
            unsubscribe()
        }
    }, [])

    const getinitialScreen = useCallback(() => {
        let initial = 'OnBoarding1'
        return initial
    }, [isConnected])

    return (
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
    )
}

export default AppNavigation
