import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';
import UserCard from '../components/card/UserCard';
import { useSelector } from 'react-redux';

// Shuffle function to randomize array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Users = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch paginated users
  const fetchUsers = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    try {
      const result = await UserService.getUsers(20, reset ? null : lastVisible);

      const newUsers = shuffleArray(result.users || []);

      if (reset) {
        setUsers(newUsers);
      } else {
        setUsers((prev) => [
          ...prev,
          ...newUsers.filter((u) => !prev.some((p) => p.id === u.id)),
        ]);
      }

      if (result.lastVisible) {
        setLastVisible(result.lastVisible);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    setLastVisible(null);
    await fetchUsers(true);
    setRefreshing(false);
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers(true);
  }, []);

  // Fetch logged-in user's profile
  useEffect(() => {
    const getData = async () => {
      try {
        setProfileLoading(true);
        const res = await AuthService.getUser(user.id);
        if (!res.error) {
          setProfileData(res.user);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setProfileLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <LinearGradient
      colors={['rgba(171, 73, 161, 0.9)', 'rgba(97, 86, 226, 0.9)']}
      style={styles.gradient}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Users</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.headerIconsTab}
            onPress={() => navigation.navigate('Analytics')}
          >
            <MaterialIcons name="analytics" size={29} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('StreamerProfile')}>
            <Image
              source={
                profileData?.profileUri
                  ? { uri: profileData.profileUri }
                  : require('../assets/images/avatar.png')
              }
              style={styles.headerIconsImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {loading && users.length === 0 ? (
          <View style={styles.fullScreenLoader}>
            <ActivityIndicator size="large" color="#9747FF" />
            <Text style={{ marginTop: 10, color: '#666' }}>Loading users...</Text>
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            onEndReached={() => fetchUsers(false)}
            onEndReachedThreshold={0.2}
            renderItem={({ item }) => <UserCard item={item} />}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListFooterComponent={
              loading && hasMore && users.length > 0 ? (
                <ActivityIndicator size="small" color="#000" style={{ margin: 16 }} />
              ) : null
            }
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
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
  fullScreenLoader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
});

export default Users;
