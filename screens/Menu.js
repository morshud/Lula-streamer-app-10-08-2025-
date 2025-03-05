import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import {  useDispatch } from 'react-redux'
import RBSheet from 'react-native-raw-bottom-sheet'
import { clearAuth } from '../store/slices/auth'
import { handleError } from '../utils/function'
import auth from "@react-native-firebase/auth"
const MenuScreen = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const bottomSheetRef = useRef(null)

    const handleLogout = async () => {
        try {
            auth().signOut()
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
            dispatch(clearAuth())
        } catch (error) {
            handleError(error)
        }
    }

    

    return (
        <View className="flex-1 bg-white px-4 pt-10">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-200">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-outline" size={24} color="gray" />
                </TouchableOpacity>
                <Text className="text-lg font-medium">Menu</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Menu Items */}
            <View className="flex-1 px-4 mt-4">
                {[
                    { label: 'Update Profile', withArrow: true, link: '', },
                ].map((item, index) => {

                    return (
                        <TouchableOpacity
                            key={index}
                            className="flex-row justify-between items-center py-4 border-b border-gray-100"
                            onPress={() => navigation.navigate(item.link)}
                        >
                            <Text className="text-base text-gray-800">{item.label}</Text>
                            {item.withArrow && <Ionicons name="chevron-forward" size={20} color="#6C63FF" />}
                        </TouchableOpacity>
                    )
                })}
            </View>

            {/* Bottom Buttons */}
            <View className="px-4 mb-6">
                <TouchableOpacity onPress={() => bottomSheetRef.current.open()} className="bg-red-600 py-3 rounded-full">
                    <Text className="text-white text-center font-medium">Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Sheet */}
            <RBSheet
                ref={bottomSheetRef}
                height={180}
                openDuration={250}
                customStyles={{
                    container: { padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
                }}
            >
                <Text className="text-lg font-medium mb-4">Confirm Logout</Text>
                <Text className="text-gray-600 mb-6">Are you sure you want to log out?</Text>
                <View className="flex-row justify-between">
                    <TouchableOpacity onPress={() => bottomSheetRef.current.close()} className="flex-1 bg-gray-200 py-3 rounded-full mr-2">
                        <Text className="text-center text-gray-800 font-medium">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            bottomSheetRef.current.close()
                            handleLogout()
                        }}
                        className="flex-1 bg-red-600 py-3 rounded-full"
                    >
                        <Text className="text-center text-white font-medium">Logout</Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        </View>
    )
}

export default MenuScreen
