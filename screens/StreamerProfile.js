import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Feather from '@expo/vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { handleError } from '../utils/function'
import AuthService from '../services/AuthService'
import { useSelector } from 'react-redux'
import Loading from '../components/shared/Loading'
import PostService from '../services/PostService'
import { FlatList } from 'react-native'
import { Video } from 'expo-av'

function Posts() {
    const { user } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const getPosts = async () => {
            try {
                setIsLoading(true);
                const res = await PostService.getPosts(user.id);
                if (!res.error) {
                    setPosts(res.data);
                }
            } catch (error) {
                handleError(error);
            } finally {
                setIsLoading(false);
            }
        };
        getPosts();
    }, []);

    return (
        <View className="flex-1 bg-white ">
            <Text className="text-xl font-bold mb-4">My Posts</Text>

            {isLoading ? (
                <ActivityIndicator size="large" color="#6200EE" />
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{paddingBottom:24}}
                    ListEmptyComponent={() => (
                        <View className="items-center justify-center mt-20">
                            <Text className="text-gray-500 text-lg">No posts found.</Text>
                        </View>
                    )}
                    renderItem={({ item }) => (
                        <View className="bg-purple-500 rounded-lg p-4 mb-4">
                            {/* Header */}
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Image
                                        source={{ uri: user.profileUri }}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <View className="ml-3">
                                        <Text className="text-white text-lg font-semibold">{user.name}</Text>
                                        {/* <Text className="text-white text-sm">📍 Bangalore</Text> */}
                                    </View>
                                </View>
                               
                            </View>

                            {/* Caption */}
                            <Text className="text-white mt-2">{item.caption}</Text>

                            {/* Media */}
                            {item.type === 'FEED' ? (
                                <Image
                                    source={{ uri: item.mediaUrl }}
                                    className="w-full h-60 rounded-lg mt-2"
                                />
                            ) : (
                                <Video source={{ uri: item.mediaUrl }} style={styles.videoPlayer} useNativeControls resizeMode="cover" isLooping />
                            )}

                            {/* Footer */}
                            <View className="flex-row justify-between items-center mt-2">
                                <View className="flex-row items-center">
                                    <Ionicons name="heart-outline" size={20} color="white" />
                                    <Text className="text-white ml-1">{item.likes.length} Likes</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Ionicons name="chatbubble-outline" size={20} color="white" />
                                    <Text className="text-white ml-1">{item.comments.length} Comments</Text>
                                </View>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

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
                <View style={styles.container}>
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
                            <TouchableOpacity style={[styles.tabItem]} onPress={() => navigation.navigate('Follower')}>
                                <Feather name="users" size={22} color="#555" />
                                <Text style={[styles.coinValue]}>{data?.followers?.length || 0}</Text>
                                <Text style={[styles.tabLabel]}>Followers</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tabItem]} onPress={() => navigation.navigate('Following')}>
                                <SimpleLineIcons name="user-following" size={22} color="#555" />
                                <Text style={[styles.coinValue]}>{data?.following?.length || 0}</Text>
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
                    <Posts />
                </View>
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
    videoPlayer: {
        width: '100%',
        height: 300,
        borderRadius: 5,
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
