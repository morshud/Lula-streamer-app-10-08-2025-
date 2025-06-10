import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Appearance,
    FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Entypo, Ionicons, FontAwesome } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Video } from 'expo-av';
import AuthService from '../services/AuthService';
import PostService from '../services/PostService';
import { handleError } from '../utils/function';
import Loading from '../components/shared/Loading';
import coinImage from '../assets/images/coin.png'

// Memoized Posts Component
const Posts = React.memo(({ posts, setPosts }) => {
    const { user } = useSelector((state) => state.auth);
    const [tab, setTab] = useState('All');
    const theme = Appearance.getColorScheme();

    const filteredPosts = posts.filter((post) => {
        if (tab === 'All') return true;
        if (tab === 'Images') return post.type === 'FEED';
        return post.type === 'VIDEO';
    });

    return (
        <View style={[styles.postsContainer, { backgroundColor: '#fff' }]}>
            <Text
                style={[styles.sectionTitle, { color: '#333' }]}
                allowFontScaling={true}
            >
                My Posts
            </Text>
            <View style={styles.tabBar}>
                {['All', 'Images', 'Videos'].map((t) => (
                    <TouchableOpacity
                        key={t}
                        style={[styles.tabItem, tab === t && styles.activeTabItem]}
                        onPress={() => setTab(t)}
                        accessibilityLabel={`View ${t} posts`}
                        accessibilityRole="button"
                    >
                        <Text
                            style={[styles.tabLabel, tab === t && styles.activeTabLabel, { color: '#555' }]}
                            allowFontScaling={true}
                        >
                            {t}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <FlatList
                data={filteredPosts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 24 }}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text
                            style={[styles.emptyText, { color: '#666' }]}
                            allowFontScaling={true}
                        >
                            No posts found.
                        </Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <View style={[styles.postCard, { backgroundColor: '#6200EE' }]}>
                        <View style={styles.postHeader}>
                            <View style={styles.postUser}>
                                <Image
                                    source={{ uri: user.profileUri }}
                                    style={styles.postUserImage}
                                    accessibilityLabel="User profile picture"
                                />
                                <View style={styles.postUserInfo}>
                                    <Text
                                        style={[styles.postUserName, { color: '#fff' }]}
                                        allowFontScaling={true}
                                    >
                                        {user.name}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <Text style={[styles.postCaption, { color: '#fff' }]} allowFontScaling={true}>
                            {item.caption}
                        </Text>
                        {item.type === 'FEED' ? (
                            <Image
                                source={{ uri: item.mediaUrl }}
                                style={styles.postMedia}
                                accessibilityLabel="Post image"
                            />
                        ) : (
                            <Video
                                source={{ uri: item.mediaUrl }}
                                style={styles.videoPlayer}
                                useNativeControls
                                resizeMode="cover"
                                isLooping
                                accessibilityLabel="Post video"
                            />
                        )}
                        <View style={styles.postFooter}>
                            <View style={styles.postAction}>
                                <Ionicons name="heart-outline" size={20} color={'#fff'} />
                                <Text
                                    style={[styles.postActionText, { color: '#fff' }]}
                                    allowFontScaling={true}
                                >
                                    {item.likes.length} Likes
                                </Text>
                            </View>
                            <View style={styles.postAction}>
                                <Ionicons name="chatbubble-outline" size={20} color={'#fff'} />
                                <Text
                                    style={[styles.postActionText, { color: '#fff' }]}
                                    allowFontScaling={true}
                                >
                                    {item.comments.length} Comments
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
});

// Animated Stat Item Component
const StatItem = ({ icon, value, label, onPress }) => {
    const scale = useSharedValue(1);
    const theme = Appearance.getColorScheme();

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <TouchableOpacity
            onPressIn={() => (scale.value = withSpring(0.95))}
            onPressOut={() => (scale.value = withSpring(1))}
            onPress={onPress}
            accessibilityLabel={`${label}: ${value}`}
            accessibilityRole="button"
        >
            <View style={styles.statCardMain} >
                <Animated.View style={[styles.statCard, animatedStyle]}>
                    {icon}
                    <Text
                        style={[styles.statValue, { color: '#000' }]}
                        allowFontScaling={true}
                    >
                        {value}
                    </Text>
                    <Text
                        style={[styles.statLabel, { color: '#000' }]}
                        allowFontScaling={true}
                    >
                        {label}
                    </Text>
                </Animated.View>
            </View>
        </TouchableOpacity>
    );
};

// Animated Action Button Component
const ActionButton = ({ title, onPress }) => {
    const scale = useSharedValue(1);
    const theme = Appearance.getColorScheme();

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <TouchableOpacity
            onPressIn={() => (scale.value = withSpring(0.9))}
            onPressOut={() => (scale.value = withSpring(1))}
            onPress={onPress}
            style={styles.buttonContainer}
            accessibilityLabel={title}
            accessibilityRole="button"
        >
            <Animated.View style={[animatedStyle]}>
                <LinearGradient colors={['#CE54C1', '#6156E2']} style={styles.button}>
                    <Text
                        style={[styles.buttonText, { color: theme === ' DARK' ? '#fff' : '#fff' }]}
                        allowFontScaling={true}
                    >
                        {title}
                    </Text>
                </LinearGradient>
            </Animated.View>
        </TouchableOpacity>
    );
};

// Main StreamerProfile Component
const StreamerProfile = () => {
    const { user } = useSelector((state) => state.auth);
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [theme, setTheme] = useState(Appearance.getColorScheme());

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setTheme(colorScheme);
        });
        return () => subscription.remove();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const getData = async () => {
                try {
                    setIsLoading(true);
                    const [userRes, postsRes] = await Promise.all([
                        AuthService.getUser(user.id),
                        PostService.getPosts(user.id),
                    ]);
                    if (!userRes.error) {
                        setData(userRes.user);
                    }
                    if (!postsRes.error) {
                        setPosts(postsRes.data);
                    }
                } catch (error) {
                    handleError(error);
                } finally {
                    setIsLoading(false);
                }
            };
            getData();
        }, [user.id])
    );

    const handleEditProfile = useCallback(() => {
        navigation.navigate('EditProfile');
    }, [navigation]);

    return (
        <>
            {isLoading ? (
                <Loading isVisible={true} />
            ) : (
                <ScrollView
                    style={[styles.container, { backgroundColor: '#fff' }]}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <LinearGradient
                        colors={['#fff', '#fff']}
                        style={styles.profileHeader}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Menu')}
                            accessibilityLabel="Open menu"
                            accessibilityRole="button"
                            style={styles.header}
                        >
                            <Entypo name="dots-three-vertical" size={20} color={'#000'} />
                        </TouchableOpacity>
                        <View style={styles.profileImageContainer}>
                            <Image
                                source={
                                    data?.profileUri ? { uri: data?.profileUri } : require('../assets/images/avatar.png')
                                }
                                style={styles.profileImage}
                                accessibilityLabel="Profile picture"
                            />
                            <TouchableOpacity
                                style={styles.profileRing}
                                onPress={handleEditProfile}
                                accessibilityLabel="Edit profile"
                                accessibilityRole="button"
                            >
                                <FontAwesome name="edit" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textContainer}>
                            <Text
                                style={[styles.username, { color: '#333' }]}
                                allowFontScaling={true}
                            >
                                {data?.name}
                            </Text>
                            <View style={styles.profileDetails}>
                                <Text
                                    style={[styles.location, { color: 'gray' }]}
                                    allowFontScaling={true}
                                >
                                    Gender: {data?.gender}
                                </Text>
                                {/* <Text
                                    style={[styles.location, { color: 'gray' }]}
                                    allowFontScaling={true}
                                >
                                    Phone: {data?.phoneNumber}
                                </Text> */}
                            </View>
                            <Text
                                style={[styles.location, { color: 'gray' }]}
                                allowFontScaling={true}
                            >
                                Languages: {data?.selectedLanguages}
                            </Text>
                            {/* <Text
                                style={[styles.location, { color: theme === 'dark' ? '#ccc' : 'gray' }]}
                                allowFontScaling={true}
                            >
                                Date Of Birth: {data?.birthDay}-{data?.birthMonth}-{data?.birthYear}
                            </Text> */}
                        </View>
                    </LinearGradient>

                    <View style={styles.statsContainer}>
                        <StatItem
                            icon={<MaterialCommunityIcons name="post-outline" size={22} color={'#000'} />}
                            value={posts.length || 0}
                            label="Posts"
                        />
                        <StatItem
                            icon={<Feather name="users" size={22} color={'#000'} />}
                            value={data?.followers?.length || 0}
                            label="Followers"
                            onPress={() => navigation.navigate('Follower')}
                        />
                        <StatItem
                            icon={<SimpleLineIcons name="user-following" size={22} color={'#000'} />}
                            value={data?.following?.length || 0}
                            label="Followings"
                            onPress={() => navigation.navigate('Following')}
                        />
                        <TouchableOpacity
                            onPressIn={() => (scale.value = withSpring(0.95))}
                            onPressOut={() => (scale.value = withSpring(1))}
                            accessibilityRole="button"
                        >
                            <View style={styles.statCardMain} >
                                <Animated.View style={[styles.statCard]}>
                                    <Image source={coinImage} style={[{width: 33, height: 25, objectFit: 'contain'}]} />
                                    <Text
                                        style={[styles.statValue, { color: '#000' }]}
                                        allowFontScaling={true}
                                    >
                                        {(user?.coins || 0).toFixed(2)}
                                    </Text>
                                    <Text
                                        style={[styles.statLabel, { color: '#000' }]}
                                        allowFontScaling={true}
                                    >
                                        Coins
                                    </Text>
                                </Animated.View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonDiv}>
                        <ActionButton title="Create Post" onPress={() => navigation.navigate('CreatePost')} />
                        <ActionButton title="Upload Video" onPress={() => navigation.navigate('CreateVideo')} />
                    </View>

                    <Posts posts={posts} setPosts={setPosts} />
                </ScrollView>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        position: 'absolute',
        top: 0,
        right: 10,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    profileImageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    profileRing: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#6200EE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileRingText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    textContainer: {
        flex: 1,
    },
    username: {
        fontSize: 20,
        fontWeight: '700',
    },
    profileDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
        gap: 10,
    },
    location: {
        fontSize: 13,
        textTransform: 'capitalize',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6200EE',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginTop: 10,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 5,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    statCardMain: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statCard: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginTop: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#000',
        marginTop: 2,
    },
    buttonDiv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    buttonContainer: {
        width: '48%',
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: 'grey',
    },
    buttonText: {
        fontSize: 16,
    },
    postsContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    tabItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    activeTabItem: {
        borderBottomWidth: 2,
        borderBottomColor: '#6200EE',
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    activeTabLabel: {
        color: '#6200EE',
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
    },
    postCard: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    postUser: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postUserImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    postUserInfo: {
        marginLeft: 10,
    },
    postUserName: {
        fontSize: 16,
        fontWeight: '600',
    },
    postCaption: {
        fontSize: 14,
        marginBottom: 10,
    },
    postMedia: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    videoPlayer: {
        width: '100%',
        height: 300,
        borderRadius: 10,
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    postAction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postActionText: {
        fontSize: 12,
        marginLeft: 5,
    },
});

export default StreamerProfile;