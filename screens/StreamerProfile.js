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
import { useNavigation } from '@react-navigation/native';
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

// Memoized Posts Component
const Posts = React.memo(() => {
    const { user } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [tab, setTab] = useState('All'); // All, Images, Videos
    const theme = Appearance.getColorScheme();

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
    }, [user.id]);

    const filteredPosts = posts.filter((post) => {
        if (tab === 'All') return true;
        if (tab === 'Images') return post.type === 'FEED';
        return post.type === 'VIDEO';
    });

    return (
        <View style={[styles.postsContainer, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}>
            <Text
                style={[styles.sectionTitle, { color: theme === 'dark' ? '#fff' : '#333' }]}
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
                            style={[styles.tabLabel, tab === t && styles.activeTabLabel, { color: theme === 'dark' ? '#fff' : '#555' }]}
                            allowFontScaling={true}
                        >
                            {t}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {isLoading ? (
                <ActivityIndicator size="large" color="#6200EE" />
            ) : (
                <FlatList
                    data={filteredPosts}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 24 }}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text
                                style={[styles.emptyText, { color: theme === 'dark' ? '#ccc' : '#666' }]}
                                allowFontScaling={true}
                            >
                                No posts found.
                            </Text>
                        </View>
                    )}
                    renderItem={({ item }) => (
                        <View style={[styles.postCard, { backgroundColor: theme === 'dark' ? '#1F1F1F' : '#6200EE' }]}>
                            <View style={styles.postHeader}>
                                <View style={styles.postUser}>
                                    <Image
                                        source={{ uri: user.profileUri }}
                                        style={styles.postUserImage}
                                        accessibilityLabel="User profile picture"
                                    />
                                    <View style={styles.postUserInfo}>
                                        <Text
                                            style={[styles.postUserName, { color: theme === 'dark' ? '#fff' : '#fff' }]}
                                            allowFontScaling={true}
                                        >
                                            {user.name}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={[styles.postCaption, { color: theme === 'dark' ? '#fff' : '#fff' }]} allowFontScaling={true}>
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
                                    <Ionicons name="heart-outline" size={20} color={theme === 'dark' ? '#fff' : '#fff'} />
                                    <Text
                                        style={[styles.postActionText, { color: theme === 'dark' ? '#fff' : '#fff' }]}
                                        allowFontScaling={true}
                                    >
                                        {item.likes.length} Likes
                                    </Text>
                                </View>
                                <View style={styles.postAction}>
                                    <Ionicons name="chatbubble-outline" size={20} color={theme === 'dark' ? '#fff' : '#fff'} />
                                    <Text
                                        style={[styles.postActionText, { color: theme === 'dark' ? '#fff' : '#fff' }]}
                                        allowFontScaling={true}
                                    >
                                        {item.comments.length} Comments
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                />
            )}
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
            <LinearGradient colors={['#CE54C1', '#6156E2']} style={styles.statCardMain}>
                <Animated.View
                    style={[
                        styles.statCard,
                        animatedStyle,
                    ]}
                >
                    {icon}
                    <Text
                        style={[styles.statValue, { color: theme === 'dark' ? '#fff' : '#fff' }]}
                        allowFontScaling={true}
                    >
                        {value}
                    </Text>
                    <Text
                        style={[styles.statLabel, { color: theme === 'dark' ? '#fff' : '#fff' }]}
                        allowFontScaling={true}
                    >
                        {label}
                    </Text>
                </Animated.View>
            </LinearGradient>
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
                        style={[styles.buttonText, { color: theme === 'dark' ? '#fff' : '#fff' }]}
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
    const [isLoading, setIsLoading] = useState(true);
    const [theme, setTheme] = useState(Appearance.getColorScheme());

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setTheme(colorScheme);
        });
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        const getData = async () => {
            try {
                setIsLoading(true);
                const res = await AuthService.getUser(user.id);
                if (!res.error) {
                    setData(res.user);
                }
            } catch (error) {
                handleError(error);
            } finally {
                setIsLoading(false);
            }
        };
        getData();
    }, [user.id]);

    const handleEditProfile = useCallback(() => {
        navigation.navigate('EditProfile');
    }, [navigation]);

    return (
        <>
            {isLoading ? (
                <Loading isVisible={true} />
            ) : (
                <ScrollView
                    style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <View style={styles.header}>
                        <View />
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Menu')}
                            accessibilityLabel="Open menu"
                            accessibilityRole="button"
                        >
                            <Entypo name="dots-three-vertical" size={20} color={theme === 'dark' ? '#fff' : '#000'} />
                        </TouchableOpacity>
                    </View>

                    <LinearGradient
                        colors={theme === 'dark' ? ['#2A2A2A', '#1F1F1F'] : ['#F3E8FF', '#E9D5FF']}
                        style={styles.profileHeader}
                    >
                        <View style={styles.profileImageContainer}>
                            <Image
                                source={
                                    data?.profileUri ? { uri: data?.profileUri } : require('../assets/images/avatar.png')
                                }
                                style={styles.profileImage}
                                accessibilityLabel="Profile picture"
                            />
                            <TouchableOpacity style={styles.profileRing} onPress={handleEditProfile}
                                accessibilityLabel="Edit profile"
                                accessibilityRole="button">
                                <FontAwesome name="edit" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textContainer}>
                            <Text
                                style={[styles.username, { color: theme === 'dark' ? '#fff' : '#333' }]}
                                allowFontScaling={true}
                            >
                                {data?.name}
                            </Text>
                            <View style={styles.profileDetails}>
                                <Text
                                    style={[styles.location, { color: theme === 'dark' ? '#ccc' : 'green' }]}
                                    allowFontScaling={true}
                                >
                                    Gender: {data?.gender}
                                </Text>
                                <Text
                                    style={[styles.location, { color: theme === 'dark' ? '#ccc' : 'green' }]}
                                    allowFontScaling={true}
                                >
                                    Phone: {data?.phoneNumber}
                                </Text>
                            </View>
                            <Text
                                style={[styles.location, { color: theme === 'dark' ? '#ccc' : 'green' }]}
                                allowFontScaling={true}
                            >
                                Languages: {data?.selectedLanguages}
                            </Text>
                            <Text
                                style={[styles.location, { color: theme === 'dark' ? '#ccc' : 'green' }]}
                                allowFontScaling={true}
                            >
                                Date Of Birth: {data?.birthDay}-{data?.birthMonth}-{data?.birthYear}
                            </Text>
                        </View>
                    </LinearGradient>

                    <View style={styles.statsContainer}>
                        <StatItem
                            icon={<MaterialCommunityIcons name="post-outline" size={22} color={theme === 'dark' ? '#fff' : '#fff'} />}
                            value={data?.post || 0}
                            label="Posts"
                        />
                        <StatItem
                            icon={<Feather name="users" size={22} color={theme === 'dark' ? '#fff' : '#fff'} />}
                            value={data?.followers?.length || 0}
                            label="Followers"
                            onPress={() => navigation.navigate('Follower')}
                        />
                        <StatItem
                            icon={<SimpleLineIcons name="user-following" size={22} color={theme === 'dark' ? '#fff' : '#fff'} />}
                            value={data?.following?.length || 0}
                            label="Followings"
                            onPress={() => navigation.navigate('Following')}
                        />
                    </View>

                    <View style={styles.buttonDiv}>
                        <ActionButton
                            title="Create Post"
                            onPress={() => navigation.navigate('CreatePost')}
                        />
                        <ActionButton
                            title="Upload Video"
                            onPress={() => navigation.navigate('CreateVideo')}
                        />
                    </View>

                    <Posts />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 15,
        borderRadius: 10,
        elevation: 3,
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
        // marginHorizontal: 10,
        marginBottom: 20,
    },
    statCardMain: {
        alignItems: 'center',
        borderRadius: 6,
        width: '95%',
    },
    statCard: {
        alignItems: 'center',
        paddingVertical: 15,
        width: 110,
    },
    statValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
        marginTop: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#fff',
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