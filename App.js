import './global.css'
import 'react-native-gesture-handler'
import 'react-native-reanimated'

import AppNavigation from './navigations/AppNavigation'
import { LogBox, StatusBar, AppState } from 'react-native'
import { ThemeProvider } from './theme/ThemeProvider'
import { PaperProvider } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { Provider } from 'react-redux'
import store from './store/store'
import auth from '@react-native-firebase/auth';
import AuthService from './services/AuthService';
import { useEffect } from 'react';

LogBox.ignoreAllLogs()

export default function App() {

    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            const user = auth().currentUser;
            if (!user) return;

            const userId = user.uid;
            try {
                if (nextAppState === 'active') {
                    // App is open, set status to online
                    if (typeof AuthService.updateStatusShow === 'function') {
                        await AuthService.updateStatusShow(userId, true);
                    } else {
                        console.error('updateStatusShow is not a function');
                    }
                } else if (nextAppState === 'background' || nextAppState === 'inactive') {
                    // App is in background or closed, set status to offline
                    if (typeof AuthService.updateStatusShow === 'function') {
                        await AuthService.updateStatusShow(userId, false);
                    } else {
                        console.error('updateStatusShow is not a function');
                    }
                }
            } catch (error) {
                console.error('Error updating status in app state change:', error);
            }
        };

        // Add event listener for app state changes
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Cleanup listener on app unmount
        return () => {
            subscription.remove();
        };
    }, []);


    return (
        <ThemeProvider>
            <Provider store={store}>
                <PaperProvider>
                    <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} />
                    <AppNavigation />
                </PaperProvider>
                <Toast />
            </Provider>
        </ThemeProvider>
    )
}
