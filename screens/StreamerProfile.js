import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { TabView } from 'react-native-tab-view';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

const Posts = () => {
    return (
        <View style={styles.tabContent}>
            <Text>Posts Section</Text>
            {/* Add your content for posts here */}
        </View>
    );
}

const Followers = () => {
    return (
        <View style={styles.tabContent}>
            <Text>Followers Section</Text>
            {/* Add your content for followers here */}
        </View>
    );
}

const Followings = () => {
    return (
        <View style={styles.tabContent}>
            <Text>Followings Section</Text>
            {/* Add your content for followings here */}
        </View>
    );
}

const StreamerProfile = () => {
    const navigation = useNavigation();
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'POST', title: 'Posts', value: '0', icon: <MaterialCommunityIcons name="post-outline" size={22} color="#555" /> },
        { key: 'FOLLOWER', title: 'Followers', value: '0', icon: <Feather name="users" size={22} color="#555" /> },
        { key: 'FOLLOWING', title: 'Followings', value: '0', icon: <SimpleLineIcons name="user-following" size={22} color="#555" /> },
    ]);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'POST':
                return <Posts />;
            case 'FOLLOWER':
                return <Followers />;
            case 'FOLLOWING':
                return <Followings />;
            default:
                return null;
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header} className={'mb-5'}>
                <Text style={styles.mediumText} className={'text-center'}>@Micale clarke</Text>
                <FontAwesome name="share" size={20} color="black" />
            </View>

            <View style={styles.profileHeader}>
                <Image 
                    source={require('../assets/images/men.png')}
                    style={styles.profileImage} 
                />
                <View style={styles.textContainer}>
                    <Text style={styles.username}>Mr. Perfect billa</Text>
                    <Text style={styles.location}>Pakistan</Text>
                    <Text style={styles.bio}>
                        My name is mick & I have been using this application for 2 years. It's a nice application.
                    </Text>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <TabView
                    style={styles.tabs}
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={(props) => {
                        return (
                            <View style={styles.tabBar}>
                                {props.navigationState.routes.map((route, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        style={[styles.tabItem, index === i && styles.activeTabItem]}
                                        onPress={() => setIndex(i)}
                                    >
                                        {route.icon}
                                        <Text style={[styles.coinValue, index === i && styles.activeCoinValue]}>
                                            {route.value}
                                        </Text>
                                        <Text style={[styles.tabLabel, index === i && styles.activeTabLabel]}>
                                            {route.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity
                                        style={styles.tabItem}
                                    >
                                    <Image 
                                        source={require('../assets/images/coin2.png')}
                                        style={styles.coinImage} 
                                    />
                                    <Text style={styles.coinValue}>0</Text>
                                    <Text style={styles.coinLabel}>Coins</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Main')}>
                <LinearGradient
                    colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)']}
                    style={styles.button}
                >
                    <Text style={styles.buttonText} className={'text-white text-center'}>Follow</Text>
                </LinearGradient>
            </TouchableOpacity>

        </ScrollView>
    );
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
    button: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
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
});

export default StreamerProfile;
