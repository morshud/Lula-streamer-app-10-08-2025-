import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import {  useDispatch } from 'react-redux'
import RBSheet from 'react-native-raw-bottom-sheet'
import { clearAuth } from '../store/slices/auth'
import { handleError } from '../utils/function'
import auth from "@react-native-firebase/auth"
import AuthService from '../services/AuthService'
const MenuScreen = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const refRBSheet = useRef(null)
    const bottomSheetRef = useRef(null)

    const handleLogout = async () => {
        try {
            const user = auth().currentUser;
            if (user) {
                const userId = user.uid;
                // Set statusShow to false before signing out
                if (typeof AuthService.updateStatusShow === 'function') {
                    await AuthService.updateStatusShow(userId, false);
                } else {
                    console.error('updateStatusShow is not a function');
                }
            }
            auth().signOut()
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
            dispatch(clearAuth())
        } catch (error) {
            handleError(error)
        }
    }

    const handleDeleteAccount = async () => {
        try {
            // Step 1: Sign out from Google if needed
            // const googleUser = await GoogleSignin.getCurrentUser();
            // if (googleUser) {
            // await GoogleSignin.signOut();
            // }

            // Step 2: Get current UID
            const currentUser = auth().currentUser;
            const uid = currentUser?.uid || user?.id;

            // Step 3: Delete user from Firestore
            const res = await AuthService.deleteAccount(uid);

            if (!res.error) {
            // Step 4: Sign out from Firebase Auth (if still logged in)
            if (auth().currentUser) {
                await auth().signOut();
            }

            // Step 5: Clear Redux
            dispatch(clearAuth());

            // Step 6: Show success message
            showToast('Your account has been deleted successfully.', 'success');

            // Step 7: Delay for smooth transition
            setTimeout(() => {
                navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
                });
            }, 100); // 100ms delay
            } else {
            showToast(res.message || 'Error deleting your account');
            }
        } catch (error) {
            handleError(error);
        }
    };

    

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
                    // { label: 'Call Log', withArrow: true, link: 'CallLogScreen' },
                    // { label: 'Transaction History', withArrow: true, link: 'TransactionHistory' },
                    // { label: 'Notification', withArrow: true, link: 'Notification' },
                    { label: 'Settings', withArrow: true, link: 'Setting' },
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
                <TouchableOpacity onPress={() => refRBSheet.current.open()} className="flex-row justify-between items-center py-4 border-b border-gray-100">
                    <Text className="text-base text-[#ff0000]">Delete Your Account</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ff0000" />
                </TouchableOpacity>
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
            {/* Delete Account */}
            <RBSheet
                ref={refRBSheet}
                height={180}
                openDuration={250}
                customStyles={{
                    container: { padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
                }}
            >
                <Text className="text-lg font-medium mb-4">Confirm Account Deletion</Text>
                <Text className="text-gray-600 mb-6">Are you sure you want to delete your account?</Text>
                <View className="flex-row justify-between">
                    <TouchableOpacity onPress={() => refRBSheet.current.close()} className="flex-1 bg-gray-200 py-3 rounded-full mr-2">
                        <Text className="text-center text-gray-800 font-medium">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            refRBSheet.current.close()
                            handleDeleteAccount()
                        }}
                        className="flex-1 bg-red-600 py-3 rounded-full"
                    >
                        <Text className="text-center text-white font-medium">Delete</Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        </View>
    )
}

export default MenuScreen
