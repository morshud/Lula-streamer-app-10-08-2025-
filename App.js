import './global.css';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useEffect, useCallback } from 'react';
import { LogBox, StatusBar, AppState } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider } from './theme/ThemeProvider';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {
  AndroidImportance,
  EventType,
  AndroidVisibility,
} from '@notifee/react-native';

import AppNavigation from './navigations/AppNavigation';
import store from './store/store';
import AuthService from './services/AuthService';
import { navigate } from './navigations/RootNavigation';

LogBox.ignoreAllLogs();

// ------------------------------
// Notification Channel Setup
// ------------------------------
async function setupNotificationChannels() {
  try {
    await notifee.createChannel({
      id: 'incoming_calls_v2',
      name: 'Incoming Calls',
      sound: 'my_awesome_ringtone',
      importance: AndroidImportance.HIGH,
      vibration: true,
      vibrationPattern: [300, 600],
      visibility: AndroidVisibility.PUBLIC,
      bypassDnd: true,
      lights: true,
      lightColor: '#FF0000',
    });
  } catch (error) {
    console.error('Failed to create notification channel', error);
  }
}

// ------------------------------
// Call Notification Display
// ------------------------------
async function displayCallNotification(remoteMessage) {
  const { callId, callerName } = remoteMessage.data || {};

  await notifee.displayNotification({
    id: `call_${callId}`,
    title: `Incoming Call: ${callerName}`,
    body: `${callerName} is calling...`,
    data: remoteMessage.data,
    android: {
      channelId: 'incoming_calls_v2',
      smallIcon: 'ic_launcher',
      largeIcon: 'ic_launcher',
      sound: 'my_awesome_ringtone',
      loopSound: true,
      importance: AndroidImportance.HIGH,
      showTimestamp: true,
      ongoing: true,
      autoCancel: false,
      vibrationPattern: [300, 600],
      fullScreenAction: { id: 'default' },
      actions: [
        {
          title: '✅ Accept',
          pressAction: { id: 'accept', launchActivity: 'default' },
          color: '#4CAF50',
        },
        {
          title: '❌ Decline',
          pressAction: { id: 'decline' },
          color: '#F44336',
        },
      ],
    },
  });
}

// ------------------------------
// Save Token in Firestore Array
// ------------------------------
async function saveTokenToFirestore(userId, token) {
  if (!userId || !token) return;

  try {
    const lastToken = await AsyncStorage.getItem('fcm_token');
    if (lastToken === token) {
      return;
    }

    await firestore()
      .collection('user')
      .doc(userId)
      .set(
        { fcmTokens: token },
        { merge: true }
      );

    await AsyncStorage.setItem('fcm_token', token);
  } catch (error) {
    console.error('Token save error:', error);
  }
}

// ------------------------------
// Remove Token on Logout
// ------------------------------
async function removeTokenFromFirestore(userId) {
  try {
    const token = await AsyncStorage.getItem('fcm_token');
    if (userId && token) {
      await firestore()
        .collection('user')
        .doc(userId)
        .update({
          fcmTokens: token,
        });
    }
    await AsyncStorage.removeItem('fcm_token');
  } catch (error) {
    console.error('Token removal error:', error);
  }
}

// ------------------------------
// Background Notification Handling
// ------------------------------
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.ACTION_PRESS) {
    const { notification, pressAction } = detail;
    const { callId, callerId } = notification.data || {};
    await notifee.cancelNotification(notification.id);
    if (pressAction.id === 'accept') {
      navigate('Call', { id: callId, userId: callerId  });
      
    } else if (pressAction.id === 'decline') {
      await notifee.cancelNotification(notification.id);
    }
  }
});
messaging().setBackgroundMessageHandler(displayCallNotification);

// ------------------------------
// Main App Content
// ------------------------------
function AppContent() {
  const { user } = useSelector((state) => state.auth);

  const handleNotificationEvent = useCallback(async ({ type, detail }) => {
    if (type === EventType.ACTION_PRESS) {
      const { notification, pressAction } = detail;
      const { callId } = notification.data || {};

      if (pressAction.id === 'accept') {
        navigate('CallComponent', { id: callId });
      } else if (pressAction.id === 'decline') {
        navigate('CallComponent', { id: callId, end: true });
      }
      await notifee.cancelNotification(notification.id);
    }
  }, []);

  useEffect(() => {
    // Permissions
    notifee.requestPermission().catch(() => console.log('Permission denied'));

    // Notification channel
    setupNotificationChannels();

    // Foreground listener
    const unsubscribeForeground = notifee.onForegroundEvent(handleNotificationEvent);

    // App state listener
    const subscription = AppState.addEventListener('change', async () => {
      if (user?.id && typeof AuthService.updateStatusShow === 'function') {
        await AuthService.updateStatusShow(user.id, true);
      }
    });

    // FCM setup & cleanup
    const setupFCM = async () => {
      try {
        const authStatus = await messaging().hasPermission();
        if (authStatus) {
          const token = await messaging().getToken();
          await saveTokenToFirestore(user?.id, token);
        }
      } catch (error) {
        console.error('FCM setup failed:', error);
      }
    };

    if (user?.id) {
      setupFCM();
    } else {
      removeTokenFromFirestore(user?.id);
    }

    return () => {
      unsubscribeForeground();
      subscription.remove();
    };
  }, [user, handleNotificationEvent]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <AppNavigation />
      <Toast />
    </>
  );
}

// ------------------------------
// Root App
// ------------------------------
export default function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <PaperProvider>
          <AppContent />
        </PaperProvider>
      </Provider>
    </ThemeProvider>
  );
}
