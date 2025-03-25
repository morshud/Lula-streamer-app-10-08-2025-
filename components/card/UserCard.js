import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import ChatService from '../../services/ChatService'
import showToast from '../../utils/toast'
import { handleError } from '../../utils/function'
import { Fontisto } from '@expo/vector-icons'
import FollowService from '../../services/FollowService'

const UserCard = ({ item }) => {
    const { user } = useSelector((state) => state.auth)
    const [follow, setFollow] = useState(item?.followers && item.followers?.includes(user.id) ? true : false)

    const navigation = useNavigation()
    const handleChat = async () => {
        try {
            const res = await ChatService.createChat(item.id, user.id)
            console.log(res)

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

    return (
        <View style={styles.likeItem}>
            <Image source={item.profileUri ? { uri: item.profileUri } : require('../../assets/images/avatar.png')} style={styles.imageLike} />
            <View style={styles.textContainer}>
                <LinearGradient colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)']} style={styles.statusContainer}>
                    <Text style={styles.status}>{item.status ? 'Active' : ''}</Text>
                </LinearGradient>
                <Text style={styles.nameLike}>{item.name || 'Anonymous User'}</Text>
                {/* <Text style={styles.location}>{item.location}</Text> */}
            </View>

            {/* <TouchableOpacity onPress={() => handleFollow()}>
                <LinearGradient colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)']} style={[styles.videoIcon, { top: -40 }]}>
                    <Text style={styles.videoText}>{follow ? 'Unfollow' : 'Follow'}</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleChat()}>
                <LinearGradient colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)']} style={styles.videoIcon}>
                    <Fontisto name="hipchat" size={15} color="white" />
                    <Text style={styles.videoText}>Chat Now</Text>
                </LinearGradient>
            </TouchableOpacity> */}
            <TouchableOpacity
                onPress={() => {
                    console.error('call pressed');
                    navigation.navigate('Call', { userId:item.id })
                }}
                style={{zIndex:100}}
            >
                <LinearGradient colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)']} >
                    <Fontisto name="hipchat" size={15} color="white" />
                    <Text style={styles.videoText}>Call Now</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )
}

export default UserCard

const styles = StyleSheet.create({
    likeItem: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#EEE',
        padding: 8,
        alignItems: 'center',
        position: 'relative',
    },
    imageLike: {
        width: 80,
        height: 80,
        borderRadius: 5,
    },
    textContainer: {
        marginLeft: 10,
        flex: 1,
    },
    nameLike: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    location: {
        color: 'gray',
        fontSize: 11,
    },
    statusContainer: {
        borderRadius: 2,
        width: 45,
        height: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    status: {
        color: 'white',
        fontSize: 9,
    },
    videoText: {
        color: 'white',
        fontSize: 12,
        marginLeft: 3,
    },
    videoIcon: {
        marginLeft: 10,
        paddingHorizontal: 8,
        paddingVertical: 5,
        backgroundColor: '#6200EE',
        borderRadius: 4,
        position: 'absolute',
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
})
