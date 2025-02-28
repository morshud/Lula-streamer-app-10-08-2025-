import { Alert } from 'react-native'
import moment from 'moment'
import showToast from './toast'
import * as FileSystem from 'expo-file-system'
import { FileSystemDownloadResult } from 'expo-file-system'

export function handleError(error) {
    console.log(error)
    showToast(error.message)
}

export function stringFormater(value = '', count = 40) {
    if (typeof value !== 'string') {
        return ''
    }

    if (value.length <= count) {
        return value
    }
    return `${value.slice(0, count)}...`
}

export const displayConfirmation = (callback) => {
    Alert.alert(
        'Warning',
        'Are you sure ?',
        [
            {
                text: 'Cancel',
                onPress: () => console.log('cancelled'),
                style: 'cancel',
            },
            {
                text: 'Confirm',
                onPress: () => callback(),
            },
        ],
        { cancelable: true }
    )
}

export const checkExpiry = (date) => {
    if (!date) {
        return false
    }

    const expiryDate = new Date(date)
    const today = new Date()

    expiryDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    console.log(moment(expiryDate).isAfter(today))

    return moment(expiryDate).isAfter(today)
}

export function showHiddenEmail(email) {
    if (!email) {
        return undefined
    }
    // Split the email into username and domain parts
    const parts = email.split('@')
    const username = parts[0]
    const domain = parts[1]

    // Determine the length of the username
    const usernameLength = username.length

    // Display the first two characters of the username followed by asterisks
    const displayedUsername = username.substring(0, 4) + '*'.repeat(usernameLength - 4)

    // Reveal the full domain
    const displayedDomain = domain

    // Return the displayed email
    return `${displayedUsername}@${displayedDomain}`
}

export function formatPrice(price, currency = 'USD') {
    return parseFloat(price).toLocaleString('en-US', { style: 'currency', currency: currency })
}

export const downloadPDF = async (url, fileName) => {
    try {
        // Getting the file path for saving
        const fileUri = FileSystem.documentDirectory + fileName

        // Downloading the file from the URL
        const downloadResumable = FileSystem.createDownloadResumable(url, fileUri)

        const { uri } = await downloadResumable.downloadAsync()

        // If download is successful, show a success message
        Alert.alert("Success",'Download Successful')
    } catch (error) {
        // Handle errors (e.g. network issues)
        console.error('Error downloading PDF: ', error)
        Alert.alert('Download Failed', 'There was an error downloading the PDF.')
    }
}
