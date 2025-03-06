import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Feather from '@expo/vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import { Entypo } from '@expo/vector-icons'
import { handleError } from '../utils/function'
import AuthService from '../services/AuthService'
import { useSelector } from 'react-redux'
import Loading from '../components/shared/Loading'

const StreamerProfile = () => {
    const { user } = useSelector((state) => state.auth)
    const navigation = useNavigation()
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
        <>
            {isLoading ? (
                <Loading isVisible={true} />
            ) : (
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.header} className={'mb-5'}>
                        <View />
                        <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
                            <Entypo name="dots-three-vertical" size={20} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileHeader}>
                        <Image source={data?.profileUri ? { uri: data?.profileUri } : require('../assets/images/avatar.png')} style={styles.profileImage} />
                        <View style={styles.textContainer}>
                            <Text style={styles.username}>{data?.name}</Text>
                            {/* <Text style={styles.location}>Pakistan</Text> */}
                            {/* <Text style={styles.bio}>My name is mick & I have been using this application for 2 years. It's a nice application.</Text> */}
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <View className="flex-row justify-between">
                            <TouchableOpacity style={[styles.tabItem]}>
                                <MaterialCommunityIcons name="post-outline" size={22} color="#555" />
                                <Text style={[styles.coinValue]}>{data?.post || 0}</Text>
                                <Text style={[styles.tabLabel]}>Posts</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tabItem]}>
                                <Feather name="users" size={22} color="#555" />
                                <Text style={[styles.coinValue]}>0</Text>
                                <Text style={[styles.tabLabel]}>Followers</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tabItem]}>
                                <SimpleLineIcons name="user-following" size={22} color="#555" />
                                <Text style={[styles.coinValue]}>0</Text>
                                <Text style={[styles.tabLabel]}>Followings</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.buttonDiv}>
                        <TouchableOpacity className="" style={styles.buttonContainer} onPress={() => navigation.navigate('CreatePost')}>
                            <LinearGradient colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)']} style={styles.button}>
                                <Text style={styles.buttonText} className={'text-white text-center'}>
                                    Create Post
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('CreatePost')}>
                            <LinearGradient colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)']} style={styles.button}>
                                <Text style={styles.buttonText} className={'text-white text-center'}>
                                    Upload Video
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mediumText: {
        fontSize: 18,
        fontWeight: '600',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 200,
    },
    textContainer: {
        flex: 1,
    },
    username: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
    },
    bio: {
        fontSize: 11,
        color: '#666',
        marginTop: 3,
    },
    location: {
        fontSize: 13,
        color: 'green',
    },
    statsContainer: {
        marginTop: 10,
        marginHorizontal: 10,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tabItem: {
        alignItems: 'center',
        padding: 10,
    },
    activeTabItem: {
        borderBottomWidth: 2,
        borderBottomColor: '#CE54C1',
    },
    tabLabel: {
        fontSize: 12,
        color: '#555',
        marginTop: -5,
    },
    activeTabLabel: {
        color: '#CE54C1',
    },
    tabContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    coinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
    },
    coinImage: {
        width: 33,
        height: 23,
        marginRight: 10,
    },
    coinValue: {
        fontSize: 15,
        color: '#555',
    },
    coinLabel: {
        marginTop: -5,
        fontSize: 12,
        color: '#555',
    },

    buttonDiv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        width: '48%',
    },
    button: {
        paddingHorizontal: 10,
        width: '100%',
        paddingVertical: 15,
        borderRadius: 40,
        marginTop: 20,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: 'grey',
        justifyContent: 'center',
        marginBottom: 15,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },
})

export default StreamerProfile
