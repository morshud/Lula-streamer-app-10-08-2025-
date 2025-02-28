import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable } from 'react-native'
import avatar from '../assets/images/men.png'
import { Entypo, FontAwesome5, MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons';

const Profile = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = useState(false)

    const options = [
        {
            name: 'Edit Profile',
            icon: <FontAwesome5 name="edit" size={20} color="#000" />,
            onPress: () => navigation.navigate('EditProfile'),
        },
        {
            name: 'Get Coin',
            icon: <FontAwesome5 name="coins" size={20} color="#000" />,
            onPress: () => navigation.navigate('GetCoin'),
        },
        {
            name: 'Notifications',
            icon: <Ionicons name="notifications" size={22} color="black" />,
            onPress: () => navigation.navigate('Notification'),
        },
        {
            name: 'Language Preference',
            icon: <MaterialIcons name="language" size={21} color="#000" />,
            onPress: () => navigation.navigate('LanguagePreference'),
        },
        {
            name: 'Share',
            icon: <Entypo name="share" size={22} color="#000" />,
            onPress: () => navigation.navigate('Share'),
        },
        {
            name: 'Setting',
            icon: <FontAwesome name="gear" size={20} color="#000" />,
            onPress: () => navigation.navigate('Setting'),
        },
        {
            name: 'Become A Host',
            icon: <FontAwesome name="user" size={20} color="#000" />,
            onPress: () => navigation.navigate('StreamerProfile'),
        }
    ];
    

    const handleLogout = () => {
        setModalVisible(true)
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <LinearGradient
                colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)' ]}
                style={styles.overlay}
            >
            </LinearGradient>   

            <View style={styles.boxes}>
                <View style={styles.profileContent}>
                    <View style={styles.avatarParent}>
                        <Image source={avatar} style={styles.avatar} />
                    </View>
                    <Text style={styles.headerText}>Yazdan</Text>
                    <Text style={styles.descriptionText}>yazdan11@gmail.com</Text>
                </View>
                
                <TouchableOpacity onPress={() => navigation.navigate('Plans')}>
                    <LinearGradient
                        colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)' ]}
                        style={styles.button}
                    >
                        <View style={styles.buttonInner}>
                            <Entypo name="price-tag" size={24} color="white" />
                            <Text style={styles.buttonText} className={'text-white rounded-full'}>Recharge Plans</Text>
                        </View>
                        <Entypo name="chevron-small-right" size={24} color="white" />
                    </LinearGradient>
                </TouchableOpacity>
                {options.map((option, index) => (
                    <TouchableOpacity key={index} onPress={option.onPress} style={styles.button2}>
                        <View style={styles.buttonInner}>
                            {option.icon}
                            <Text style={styles.buttonText}>{option.name}</Text>
                        </View>
                        <Entypo name="chevron-small-right" size={24} color="black" />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'rgba(97, 86, 226, 0.9)',
    },
    boxes: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 60,
    },
    overlay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
    },
    profileContent: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        textAlign: 'center',
        marginTop: -100,
    },
    avatarParent: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    avatar: {
        width: 110,
        height: 110,
        objectFit: 'cover',
        borderRadius: 500,
        marginBottom: 10,
    },
    headerText: {
        fontSize: 25,
        fontWeight: 600,
        textAlign: 'center',
        marginBottom: 4,
    },
    descriptionText: {
        fontSize: 14,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 40,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: 'grey',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    button2: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    buttonInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        marginLeft: 10,
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: 320,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#0356d0',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    confirmButton: {
        backgroundColor: '#FF3B30', // Red color for confirm button
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
})

export default Profile