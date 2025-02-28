import { View, Text, Platform, StyleSheet } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Main from '../screens/Main';
import Users from '../screens/Users';
import LiveStreaming from '../screens/LiveStreaming';
import ChatList from '../screens/ChatList';
import Analytics from '../screens/Analytics';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();

const TabBarIconWithReanimated = ({ focused, iconName, label }) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingVertical: 8,
      }}
    >
      <Ionicons
        name={iconName}
        size={22}
        color={focused ? '#fff' : '#E5E5E5'}
      />
      {label && (
        <Text
          style={{
            fontSize: 12,
            fontWeight: '500',
            color: focused ? '#fff' : '#E5E5E5',
          }}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

const BottomTabNavigation = () => {
  const { dark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName={null}
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 5,
          height: Platform.OS === 'ios' ? 65 : 55,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['rgba(171, 73, 161, 1)', 'rgba(97, 86, 226, 1)']}
            style={styles.gradientStyle}
          />
        ),
      }}
    >
      <Tab.Screen
        name="Main"
        component={Main}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIconWithReanimated
              focused={focused}
              iconName={focused ? 'play' : 'play-outline'}
              label="Welcome"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Users"
        component={Users}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIconWithReanimated
              focused={focused}
              iconName={focused ? 'people' : 'people-outline'}
              label="Users"
            />
          ),
        }}
      />
      <Tab.Screen
        name="LiveStreaming"
        component={LiveStreaming}
        options={{
          tabBarIcon: ({ focused }) => (
            <LinearGradient
              colors={['#fff', '#fff']}
              style={styles.locationButton}
            >
              <Ionicons
                name="add"
                size={28}
                color="rgba(171, 73, 161, 1)"
              />
            </LinearGradient>
          ),
          tabBarStyle:{
            display:"none"
          }
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatList}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIconWithReanimated
              focused={focused}
              iconName={focused ? 'chatbubble' : 'chatbubble-outline'}
              label="Chats"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={Analytics}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIconWithReanimated
              focused={focused}
              iconName={focused ? 'analytics' : 'analytics-outline'}
              label="Analytics"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  locationButton: {
    width: 45,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
  },
  gradientStyle: {
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});

export default BottomTabNavigation;