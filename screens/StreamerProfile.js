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
        <View style={[styles.postsContainer]}>
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
                        <Text style={[styles.tabLabel, tab === t && styles.activeTabLabel]}>
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
                        <Text style={styles.emptyText}>No posts found</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <View style={[styles.postCard]}>
                        <View style={styles.postHeader}>
                            <View style={styles.postUser}>
                                <Image
                                    source={{ uri: user.profileUri }}
                                    style={styles.postUserImage}
                                    accessibilityLabel="User profile picture"
                                />
                                <View style={styles.postUserInfo}>
                                    <Text
                                        style={[styles.postUserName]}
                                        allowFontScaling={true}
                                    >
                                        {user.name}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <Text style={[styles.postCaption]} allowFontScaling={true}>
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
                                <Ionicons name="heart-outline" size={20} />
                                <Text
                                    style={[styles.postActionText]}
                                    allowFontScaling={true}
                                >
                                    {item.likes.length} Likes
                                </Text>
                            </View>
                            <View style={styles.postAction}>
                                <Ionicons name="chatbubble-outline" size={20} />
                                <Text
                                    style={[styles.postActionText]}
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
                    style={[styles.container]}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <LinearGradient
                        colors={['#F1F1FE', '#F8F8FF']}
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
                            
                            <View style={styles.detailsRow}>
                                <View style={styles.detailItem}>
                                    <Feather name="user" size={14} color="#888" />
                                    <Text style={styles.detailText}>
                                        {data?.gender}
                                    </Text>
                                </View>

                                {/* <Text
                                    style={[styles.location, { color: 'gray' }]}
                                    allowFontScaling={true}
                                >
                                    Phone: {data?.phoneNumber}
                                </Text> */}
                                
                                <View style={styles.detailItem}>
                                    <Ionicons name="language-outline" size={14} color="#888" />
                                    <Text style={styles.detailText}>
                                        {data?.selectedLanguages?.join(', ')}
                                    </Text>
                                </View>
                            </View>
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
                        {/* <TouchableOpacity
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
                        </TouchableOpacity> */}
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

// const styles = StyleSheet.create({
//     container: {
//         flexGrow: 1,
//         padding: 20,
//     },
//     header: {
//         position: 'absolute',
//         top: 0,
//         right: 10,
//     },
//     profileHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 12,
//         marginBottom: 20,
//     },
//     profileImageContainer: {
//         position: 'relative',
//     },
//     profileImage: {
//         width: 100,
//         height: 100,
//         borderRadius: 50,
//     },
//     profileRing: {
//         position: 'absolute',
//         bottom: 0,
//         right: 0,
//         width: 30,
//         height: 30,
//         borderRadius: 15,
//         backgroundColor: '#6200EE',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     profileRingText: {
//         color: '#fff',
//         fontSize: 10,
//         fontWeight: 'bold',
//     },
//     textContainer: {
//         flex: 1,
//     },
//     username: {
//         fontSize: 20,
//         fontWeight: '700',
//     },
//     profileDetails: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         marginTop: 5,
//         gap: 10,
//     },
//     location: {
//         fontSize: 13,
//         textTransform: 'capitalize',
//     },
//     editButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#6200EE',
//         paddingVertical: 8,
//         paddingHorizontal: 12,
//         borderRadius: 20,
//         marginTop: 10,
//     },
//     editButtonText: {
//         color: '#fff',
//         fontSize: 14,
//         marginLeft: 5,
//     },
//     statsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         width: '100%',
//         marginBottom: 20,
//     },
//     statCardMain: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     statCard: {
//         alignItems: 'center',
//         paddingVertical: 10,
//         paddingHorizontal: 10,
//     },
//     statValue: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#000',
//         marginTop: 5,
//     },
//     statLabel: {
//         fontSize: 14,
//         color: '#000',
//         marginTop: 2,
//     },
//     buttonDiv: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 20,
//     },
//     buttonContainer: {
//         width: '48%',
//     },
//     button: {
//         paddingHorizontal: 10,
//         paddingVertical: 15,
//         borderRadius: 40,
//         flexDirection: 'row',
//         justifyContent: 'center',
//         borderWidth: 0.5,
//         borderColor: 'grey',
//     },
//     buttonText: {
//         fontSize: 16,
//     },
//     postsContainer: {
//         flex: 1,
//     },
//     sectionTitle: {
//         fontSize: 20,
//         fontWeight: '700',
//         marginBottom: 10,
//     },
//     tabBar: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         marginBottom: 15,
//     },
//     tabItem: {
//         paddingVertical: 8,
//         paddingHorizontal: 12,
//     },
//     activeTabItem: {
//         borderBottomWidth: 2,
//         borderBottomColor: '#6200EE',
//     },
//     tabLabel: {
//         fontSize: 14,
//         fontWeight: '500',
//     },
//     activeTabLabel: {
//         color: '#6200EE',
//         fontWeight: '600',
//     },
//     emptyContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: 50,
//     },
//     emptyText: {
//         fontSize: 16,
//     },
//     postCard: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 16,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 6,
//         elevation: 2,
//     },
//     postHeader: {
//         marginBottom: 12,
//     },
//     postUser: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     postUserImage: {
//         width: 36,
//         height: 36,
//         borderRadius: 18,
//     },
//     postUserInfo: {
//         marginLeft: 12,
//     },
//     postUserName: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#333',
//     },
//     postCaption: {
//         fontSize: 14,
//         color: '#555',
//         marginBottom: 12,
//         lineHeight: 20,
//     },
//     postMedia: {
//         width: '100%',
//         height: 240,
//         borderRadius: 12,
//         marginBottom: 12,
//     },
//     videoPlayer: {
//         width: '100%',
//         height: 240,
//         borderRadius: 12,
//         marginBottom: 12,
//     },
//     postFooter: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//     },
//     postAction: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     postActionText: {
//         fontSize: 14,
//         color: '#888',
//         marginLeft: 6,
//     },
// });
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        position: 'absolute',
        top: 45,
        right: 15,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        paddingBottom: 32,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    profileImageContainer: {
        position: 'relative',
    },
    profileImageRing: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6156E2',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
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
        marginLeft: 16,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    username: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(97, 86, 226, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6156E2',
    },
    detailsRow: {
        marginTop: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        textTransform: 'capitalize'
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginTop: -16,
        marginBottom: 24,
    },
    statCard: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        width: 100,
        shadowColor: '#6156E2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
    buttonDiv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '48%',
        shadowColor: '#6156E2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: '#6156E2',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    secondaryButtonText: {
        color: '#6156E2',
    },
    sectionHeader: {
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    divider: {
        height: 3,
        width: 40,
        backgroundColor: '#6156E2',
        borderRadius: 2,
        marginTop: 8,
    },
    postsContainer: {
        paddingHorizontal: 24,
        marginTop: 8,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#F5F5FF',
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 10,
    },
    activeTabItem: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#6156E2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#888',
    },
    activeTabLabel: {
        color: '#6156E2',
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
    postCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    postHeader: {
        marginBottom: 12,
    },
    postUser: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postUserImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    postUserInfo: {
        marginLeft: 12,
    },
    postUserName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    postCaption: {
        fontSize: 14,
        color: '#555',
        marginBottom: 12,
        lineHeight: 20,
    },
    postMedia: {
        width: '100%',
        height: 240,
        borderRadius: 12,
        marginBottom: 12,
    },
    videoPlayer: {
        width: '100%',
        height: 240,
        borderRadius: 12,
        marginBottom: 12,
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    postAction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postActionText: {
        fontSize: 14,
        color: '#888',
        marginLeft: 6,
    },
});

export default StreamerProfile;