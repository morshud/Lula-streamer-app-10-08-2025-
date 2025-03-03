import './global.css'
import 'react-native-gesture-handler'
import 'react-native-reanimated'

import AppNavigation from './navigations/AppNavigation'
import { LogBox, StatusBar } from 'react-native'
import { ThemeProvider } from './theme/ThemeProvider'
import { PaperProvider } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { Provider } from 'react-redux'
import store from './store/store'

LogBox.ignoreAllLogs()

export default function App() {
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
