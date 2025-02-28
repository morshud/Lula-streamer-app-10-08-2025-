import React, { useState } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { launchImageLibrary } from 'react-native-image-picker'
import Entypo from '@expo/vector-icons/Entypo';
import { LinearGradient } from 'expo-linear-gradient';

const EditProfile = () => {
    const navigation = useNavigation()

    // State for storing profile details
    const [name, setName] = useState('John Doe')
    const [email, setEmail] = useState('johndoe@gmail.com')
    const [phone, setPhone] = useState('123-456-7890')
    const [address, setAddress] = useState('123 Main St, City, Country')
    const [profileImage, setProfileImage] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPTf60mv3VeYXJg37aEFDqWIzA8DNhRnU02w&s') // Default image

    // Image picker handler
    const handleImagePicker = () => {
        launchImageLibrary(
            { 
                mediaType: 'photo',
                quality: 0.8,
                includeBase64: false,
            },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker')
                } else if (response.errorCode) {
                    console.error('Image picker error: ', response.errorCode)
                } else if (response.assets && response.assets[0]) {
                    setProfileImage(response.assets[0].uri)
                }
            }
        )
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header} className={'mb-5'}>
                <Text style={styles.mediumText} className={'text-center'}>Edit Profile</Text>
            </View>
            <View style={styles.profileImageContainer}>
                <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                />
                <TouchableOpacity onPress={handleImagePicker}>
                    <LinearGradient
                        colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)' ]}
                        style={styles.changeImageButton}
                    >
                        <Entypo name="camera" size={20} color="white" />
                    </LinearGradient>   
                </TouchableOpacity>
            </View>
            
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
            />
            
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
            />

            <TextInput
                style={[styles.input, { backgroundColor: '#f0f0f0' }]}
                value={phone}
                placeholder="Phone Number"
                editable={false}
            />

            <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your address"
            />

            <TouchableOpacity style={styles.saveButton} onPress={() => navigation.goBack()}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 200,
        marginBottom: 10,
    },
    changeImageButton: {
        borderRadius: 200,
        width: 40,
        height: 40,
        marginTop: -33,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    changeImageButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 12,
        paddingLeft: 10,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: 'rgba(97, 86, 226, 0.9)',
        paddingVertical: 12,
        marginTop: 30,
        alignItems: 'center',
        borderRadius: 40,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    mediumText: {
        fontSize: 18,
        fontWeight: 600,
    },
})

export default EditProfile
