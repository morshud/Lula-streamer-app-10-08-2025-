import { useEffect, useState } from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import AuthService from '../../services/AuthService'
import { navigate } from '../../navigations/RootNavigation'

const CallWrapper = ({ children }) => {
    const { user } = useSelector((state) => state.auth)
    const [currentCall, setCurrentCall] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        if (!user) return

        const unsubscribe = AuthService.listenUserId(user.id, (data) => {
            if (!data?.currentCall) return

            setCurrentCall((prevCall) => {
                if (prevCall !== data.currentCall) {
                    setModalVisible(true)
                    return data.currentCall
                }
                return prevCall
            })
        })

        return () => unsubscribe()
    }, [user])

    const handleAccept = () => {
        setModalVisible(false)
        navigate('Call', { id: currentCall })
    }

    const handleDecline = () => {
        setModalVisible(false)
        setCurrentCall(null)
    }

    return (
        <>
            {children}

            <Modal transparent animationType="fade" visible={modalVisible}>
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white w-80 p-6 rounded-2xl items-center space-y-4 shadow-lg">
                        <Text className="text-lg font-bold">Incoming Call</Text>
                        <Text className="text-center text-gray-600">You have an incoming call. Do you want to accept it?</Text>

                        <View className="flex-row space-x-4">
                            <TouchableOpacity
                                className="bg-red-500 px-4 py-2 rounded-xl"
                                onPress={handleDecline}
                            >
                                <Text className="text-white font-semibold">Decline</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="bg-green-500 px-4 py-2 rounded-xl"
                                onPress={handleAccept}
                            >
                                <Text className="text-white font-semibold">Accept</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default CallWrapper
