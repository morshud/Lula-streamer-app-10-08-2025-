import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, useWindowDimensions, TouchableOpacity } from 'react-native';
import avatar from '../assets/images/men.png';
import { TabView } from 'react-native-tab-view';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';


const Users = () => {
    const navigation = useNavigation();
    const likesData = [
        { id: '1', name: 'Beyoncé', location: 'Los Angeles, USA', image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs_NdtJ9PQ8hHBuy_YY40RR2S2AVn3LmaGLA&s' }, status: 'Active' },
        { id: '2', name: 'Johnny Depp', location: 'Antigua and Barbuda', image: { uri: 'https://plus.unsplash.com/premium_photo-1664351560745-a14ed7bfee3d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2lybHMlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D' }, status: 'Active' },
        { id: '3', name: 'Scarlett Johansson', location: 'Houston, USA', image: { uri: 'https://i.pinimg.com/736x/7c/d5/10/7cd5108bb2793931a1aa60e658bdd0a4.jpg' }, status: 'Active' },
        { id: '4', name: 'Soni', location: 'Antigua and Barbuda', image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiQjwcR2Pw9t_GJJplEmVddCm3gVVibq6IeA&s' }, status: 'Active' },
        { id: '5', name: 'Tom Hanks', location: 'Los Angeles, USA', image: { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Tom_Hanks_2019.jpg/800px-Tom_Hanks_2019.jpg' }, status: 'Active' },
        { id: '6', name: 'Emma Watson', location: 'London, UK', image: { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Emma_Watson_2015.jpg/800px-Emma_Watson_2015.jpg' }, status: 'Active' },
        { id: '7', name: 'Will Smith', location: 'Los Angeles, USA', image: { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Will_Smith_2019_by_Glenn_Francis.jpg/800px-Will_Smith_2019_by_Glenn_Francis.jpg' }, status: 'Active' },
        { id: '8', name: 'Zendaya', location: 'Los Angeles, USA', image: { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Zendaya_2019_%28cropped%29.jpg/800px-Zendaya_2019_%28cropped%29.jpg' }, status: 'Active' },
        { id: '9', name: 'Chris Hemsworth', location: 'Byron Bay, Australia', image: { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Chris_Hemsworth_2019.jpg/800px-Chris_Hemsworth_2019.jpg' }, status: 'Active' },
        { id: '10', name: 'Scarlett Johansson', location: 'New York, USA', image: { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Scarlett_Johansson_2019.jpg/800px-Scarlett_Johansson_2019.jpg' }, status: 'Active' },
        { id: '11', name: 'Johnny Depp', location: 'Los Angeles, USA', image: { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Johnny_Depp_2018.jpg/800px-Johnny_Depp_2018.jpg' }, status: 'Active' },
        { id: '12', name: 'Beyoncé', location: 'Houston, USA', image: { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Beyoncé_2018.jpg/800px-Beyoncé_2018.jpg' }, status: 'Active' },
    ];
    
    return (
        <LinearGradient
            colors={['rgba(171, 73, 161, 0.9)', 'rgba(97, 86, 226, 0.9)', ]}
            style={styles.gradient}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Users</Text>
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
                    data={likesData}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.likeItem}>
                            <Image source={item.image} style={styles.imageLike} />
                            <View style={styles.textContainer}>
                                <LinearGradient
                                    colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)' ]}
                                    style={styles.statusContainer}
                                >
                                    <Text style={styles.status}>{item.status}</Text>
                                </LinearGradient>  
                                <Text style={styles.nameLike}>{item.name}</Text>
                                <Text style={styles.location}>{item.location}</Text>
                            </View>
                            
                            <TouchableOpacity onPress={() => navigation.navigate('StartCalling')}>
                                <LinearGradient
                                    colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)' ]}
                                    style={styles.videoIcon}
                                >
                                    <Feather name="phone-call" size={15} color="white" /> 
                                    <Text style={styles.videoText}>Call Now</Text>
                                </LinearGradient>  
                            </TouchableOpacity>
                        </View>
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
        paddingVertical: 2,
        backgroundColor: '#6200EE',
        borderRadius: 4,
        position: 'absolute',
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },

});

export default Users;