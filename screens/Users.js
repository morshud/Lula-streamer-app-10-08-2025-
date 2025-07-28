import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import UserService from '../services/UserService'
import AuthService from '../services/AuthService'
import UserCard from '../components/card/UserCard'
import { useSelector } from 'react-redux'

// Shuffle function to randomize array
const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

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
            const result = await UserService.getUsers(10, reset ? null : lastVisible)
            const newUsers = result.users
            const shuffledUsers = shuffleArray(newUsers)
            setUsers((prevUsers) => (reset ? shuffledUsers : [...prevUsers, ...shuffledUsers]))
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

    const { user } = useSelector((state) => state.auth)
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getData = async () => {
            try {
                setIsLoading(true)
                const res = await AuthService.getUser(user.id)
                if (!res.error) {
                    setData(res.user)
                }
            } catch (error) {
                handleError(error)
            } finally {
                setIsLoading(false)
            }
        }
        getData()
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
                        <Image source={data?.profileUri ? { uri: data?.profileUri } : require('../assets/images/avatar.png')} style={styles.headerIconsImage} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.content}>
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    onEndReached={fetchUsers}
                    onEndReachedThreshold={0.5}
                    renderItem={({ item }) => <UserCard item={item} />}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    contentContainerStyle={{ paddingBottom: 80 }}
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
})

export default Users