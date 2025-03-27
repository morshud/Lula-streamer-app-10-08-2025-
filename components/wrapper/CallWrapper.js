import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-native'
import AuthService from '../../services/AuthService'
import { navigate } from '../../navigations/RootNavigation'

const CallWrapper = ({ children }) => {
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        if (!user) {
            return
        }

        const unsubscribe = AuthService.listenUserId(user.id, (data) => {
            if (data?.currentCall) {
                Alert.alert(
                    "Incoming Call",
                    "You have an incoming call. Do you want to accept it?",
                    [
                        {
                            text: "Decline",
                            style: "cancel"
                        },
                        {
                            text: "Accept",
                            onPress: () => navigate('Call', { id: data.currentCall })
                        }
                    ]
                )
            }
        })

        return () => {
            unsubscribe()
        }
    }, [user])

    return children
}

export default CallWrapper

