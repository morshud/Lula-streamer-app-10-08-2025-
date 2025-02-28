import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, useWindowDimensions, TouchableOpacity } from 'react-native';
import avatar from '../assets/images/men.png';
import { TabView } from 'react-native-tab-view';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const ChatList = () => {
    const navigation = useNavigation();
    const messages = [
        { id: '1', name: 'Official', message: 'kriti husain likes you!', time: '12:10', image: avatar },
        { id: '2', name: 'Official', message: 'kriti husain likes you!', time: '12:10', image: avatar },
        { id: '3', name: 'Official', message: 'kriti husain likes you!', time: '12:10', image: avatar },
        { id: '4', name: 'Official', message: 'kriti husain likes you!', time: '12:10', image: avatar },
    ];

    return (
        <LinearGradient
            colors={['rgba(171, 73, 161, 0.9)', 'rgba(97, 86, 226, 0.9)', ]}
            style={styles.gradient}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chats</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.headerIconsTab} onPress={() => navigation.navigate('Analytics')}>
                        <MaterialIcons name="analytics" size={29} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('StreamerProfile')}>
                        <Image source={require('../assets/images/men.png')} style={styles.headerIconsImage} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.content}>
                <FlatList
                    data={messages}
                    keyExtractor={item => item.id}
                    style={styles.messagesContent}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate('Chat')}>
                            <Image source={item.image} style={styles.image} />
                            <View style={styles.textContainer}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.message}>{item.message}</Text>
                            </View>
                            <Text style={styles.time}>{item.time}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
    },
    headerIcons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    headerIconsImage: {
        width: 32,
        height: 32,
        marginLeft: 10,
        borderRadius: 250,
        objectFit: 'cover',
    },
    content: {
        width: '100%',
        marginBottom: 30,
        backgroundColor: '#fff',
        borderTopLeftRadius: 15,
        height: '100%',
        borderTopRightRadius: 15,
    },
    tabs: {
        backgroundColor: '#fff',
    },
    tabBar: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    activeTab: {
        borderBottomWidth: 1,
        borderBottomColor: '#6200ee',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#aaa',
    },
    activeTabText: {
        color: '#6200ee',
    },
    chatItem: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    textContainer: {
        marginLeft: 10,
        flex: 1,
    },
    name: {
        fontWeight: 500,
    },
    message: {
        color: 'gray',
        fontWeight: 300,
        fontSize: 12,
    },
    time: {
        color: 'gray',
        fontSize: 12,
    },
    centeredText: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },




    likeItem: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#EEE',
        padding: 8,
        alignItems: 'center',
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
    videoIcon: {
        marginLeft: 10,
        padding: 8,
        backgroundColor: '#6200EE',
        borderRadius: 20,
    },

});

export default ChatList;