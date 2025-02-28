import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, Modal } from 'react-native';
import avatar from '../assets/images/men.png';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';

const messages = [
    {
        id: '1',
        text: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing',
        sender: 'user1',
    },
    {
        id: '2',
        text: 'Sed Do eiusmod Tempor Incididunt Ut Labore Et',
        sender: 'user2',
    },
    {
        id: '3',
        text: 'Ok',
        sender: 'user1',
    },
    {
        id: '1',
        text: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing',
        sender: 'user1',
    },
    {
        id: '2',
        text: 'Sed Do eiusmod Tempor Incididunt Ut Labore Et',
        sender: 'user2',
    },
    {
        id: '3',
        text: 'Ok',
        sender: 'user1',
    },
    {
        id: '1',
        text: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing',
        sender: 'user1',
    },
    {
        id: '2',
        text: 'Sed Do eiusmod Tempor Incididunt Ut Labore Et',
        sender: 'user2',
    },
    {
        id: '3',
        text: 'Ok',
        sender: 'user1',
    },
    {
        id: '1',
        text: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing',
        sender: 'user1',
    },
    {
        id: '2',
        text: 'Sed Do eiusmod Tempor Incididunt Ut Labore Et',
        sender: 'user2',
    },
    {
        id: '3',
        text: 'Ok',
        sender: 'user1',
    },
    {
        id: '1',
        text: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing',
        sender: 'user1',
    },
    {
        id: '2',
        text: 'Sed Do eiusmod Tempor Incididunt Ut Labore Et',
        sender: 'user2',
    },
    {
        id: '3',
        text: 'Ok',
        sender: 'user1',
    },
];
const { width: screenWidth } = Dimensions.get('window');
const { height: screenHeight } = Dimensions.get('window');

const Chat = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        const model = setTimeout(() => {
            setModalVisible(true);
        }, 2000);

        return () => clearTimeout(model);
    }, []);

    const renderItem = ({ item }) => (
        <View style={[styles.messageContainer, item.sender === 'user1' ? styles.user1Message : styles.user2Message]}>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <LinearGradient
            colors={['rgba(171, 73, 161, 0.9)', 'rgba(97, 86, 226, 0.9)', ]}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.headerText}>Messages</Text>
                <Image source={avatar} style={styles.image} />
            </View>
            <View style={styles.content}>
                <FlatList
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    style={styles.messageList}
                />
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Type message here..." />
                    <TouchableOpacity >
                        <LinearGradient
                            colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)' ]}
                            style={styles.sendButton}
                        >
                            <FontAwesome name="send" size={20} color="white" />
                        </LinearGradient>  
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 600,
        color: '#fff',
    },
    image: {
        width: 35,
        height: 35,
        objectFit: 'cover',
        borderRadius: 100,
    },
    content: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 15,
        height: screenHeight * 0.9,
        borderTopRightRadius: 15,
    },
    messageList: {
        flex: 1,
        paddingBottom: 60,
    },
    messageContainer: {
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 12,
        borderRadius: 10,
    },
    user1Message: {
        backgroundColor: '#5734D3',
        alignSelf: 'flex-start',
        maxWidth: '70%',
        borderRadius: 30,
        borderBottomLeftRadius: 0,
    },
    user2Message: {
        backgroundColor: '#CE54C1',
        alignSelf: 'flex-end',
        maxWidth: '70%',
        borderRadius: 30,
        borderBottomRightRadius: 0,
    },
    messageText: {
        color: 'white',
        fontSize: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eaeaea',
        backgroundColor: 'white',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#eaeaea',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        fontSize: 16,
        width: screenWidth * 0.8,
    },
    sendButton: {
        padding: 10,
        width: screenWidth * 0.2,
        borderRadius: 25,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Chat;
