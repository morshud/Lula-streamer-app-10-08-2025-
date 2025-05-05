import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import ChatService from '../../services/ChatService'
import showToast from '../../utils/toast'
import { handleError } from '../../utils/function'
import Ionicons from '@expo/vector-icons/Ionicons';
import FollowService from '../../services/FollowService'
import AuthService from '../../services/AuthService'

const UserCard = ({ item }) => {
    const { user } = useSelector((state) => state.auth)
    const [follow, setFollow] = useState(item?.followers && item.followers?.includes(user.id) ? true : false)

    const navigation = useNavigation()

    const handleChat = async () => {
        try {
            const res = await ChatService.createChat(item.id, user.id)
            if (!res.error) {
                navigation.navigate('Chat', { chatId: res.data })
            } else {
                showToast(res.message)
            }
        } catch (error) {
            handleError(error)
        }
    }

    const handleFollow = async () => {
        try {
            if (follow) {
                setFollow(false)
                await FollowService.unfollowUser(user.id, item.id)
            } else {
                setFollow(true)
                await FollowService.followUser(user.id, item.id)
            }
        } catch (error) {
            handleError(error)
        }
    }

    const handleCall = async (userId) => {
        try {
            const res = await AuthService.getUser(item.id);
            if (res.error) {
                throw new Error(res.message)
            }
            navigation.navigate('Call', { userId })
        } catch (error) {
            handleError(error)
        }
    }

    return (
        <View style={styles.cardContainer}>
            <Image 
                source={item.profileUri ? { uri: item.profileUri } : require('../../assets/images/avatar.png')} 
                style={styles.profileImage} 
            />
            <View style={styles.textContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.userName}>{item.name || 'Anonymous User'}</Text>
                    <View style={[styles.statusIndicator, { backgroundColor: item.status ? '#4CAF50' : '#B0BEC5' }]} />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleFollow} style={styles.button}>
                        <LinearGradient 
                            colors={follow ? ['#757575', '#616161'] : ['#57A10D', '#4B8E0B']} 
                            style={styles.gradientButton}
                        >
                            <Text style={styles.buttonText}>{follow ? 'Unfollow' : 'Follow'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleChat} style={styles.button}>
                        <LinearGradient 
                            colors={['#CE54C1', '#6156E2']} 
                            style={styles.gradientButton}
                        >
                            <Text style={styles.buttonText}>Chat Now</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleCall(item?.id)} style={styles.callButtonContainer}>
                <LinearGradient colors={['#CE54C1', '#6156E2']} style={styles.callButton}>
                    <Ionicons name="call-sharp" size={20} color="white" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )
}

export default UserCard

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        marginHorizontal: 12,
        marginVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#EEE',
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginLeft: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    gradientButton: {
        width: 100,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    callButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    callButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
})