import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Feather from '@expo/vector-icons/Feather'
import UserService from '../services/UserService'

const Users = () => {
    const navigation = useNavigation()
    const [users, setUsers] = useState([])
    const [lastVisible, setLastVisible] = useState(null)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    const fetchUsers = async (reset = false) => {
        if (loading) return
        setLoading(true)
        try {
            const result = await UserService.getUsers(10, reset? null:lastVisible)
            setUsers((prevUsers) => (reset ? result.users : [...prevUsers, ...result.users]))
            setLastVisible(result.lastVisible)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        setUsers([])
        setLastVisible(null) 
        await fetchUsers(true) 
        setRefreshing(false)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    

    return (
        <LinearGradient colors={['rgba(171, 73, 161, 0.9)', 'rgba(97, 86, 226, 0.9)']} style={styles.gradient}>
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
                    data={users}
                    keyExtractor={(item) => item.id}
                    onEndReached={fetchUsers}
                    onEndReachedThreshold={0.5}
                    renderItem={({ item }) => (
                        <View style={styles.likeItem}>
                            <Image source={item.profileUri? {uri:item.profileUri} : require("../assets/images/avatar.png")} style={styles.imageLike} />
                            <View style={styles.textContainer}>
                                <LinearGradient colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)']} style={styles.statusContainer}>
                                    <Text style={styles.status}>{item.status ? "Active" : ""}</Text>
                                </LinearGradient>
                                <Text style={styles.nameLike}>{item.name || "Anonymous User"}</Text>
                                {/* <Text style={styles.location}>{item.location}</Text> */}
                            </View>

                            <TouchableOpacity onPress={() => navigation.navigate('StartCalling')}>
                                <LinearGradient colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)']} style={styles.videoIcon}>
                                    <Feather name="phone-call" size={15} color="white" />
                                    <Text style={styles.videoText}>Call Now</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            </View>
        </LinearGradient>
    )
}

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
})

export default Users
