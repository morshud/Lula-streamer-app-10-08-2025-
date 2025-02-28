import './global.css'
import 'react-native-gesture-handler'
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { useCallback } from 'react'
import { FONTS } from './constants/fonts'
import AppNavigation from './navigations/AppNavigation'
import { LogBox, StatusBar } from 'react-native'
import { ThemeProvider } from './theme/ThemeProvider'
import { PaperProvider } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { Provider } from 'react-redux'
import store from './store/store'
LogBox.ignoreAllLogs()

SplashScreen.preventAutoHideAsync()

export default function App() {
    const [fontsLoaded] = useFonts(FONTS)

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded])

    if (!fontsLoaded) {
        return null
    }

    return (
        <ThemeProvider>
            <Provider store={store}>
                <PaperProvider>
                    <SafeAreaProvider onLayout={onLayoutRootView}>
                        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} />
                        <AppNavigation />
                    </SafeAreaProvider>
                </PaperProvider>
                <Toast />
            </Provider>
        </ThemeProvider>
    )
}
