// import { Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

export const launchImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    })

    if (!result.canceled) {
        return result.assets[0]
    }
}

export const checkMediaPermissions = async () => {
    if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        return status
    }

    return 'granted'
}
