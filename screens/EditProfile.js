import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import Entypo from '@expo/vector-icons/Entypo';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux'; // Import useSelector
import AuthService from '../services/AuthService'; // Import AuthService
import showToast from '../utils/toast'; // Assuming you have a toast utility

const EditProfile = () => {
    const navigation = useNavigation();
    const { user } = useSelector((state) => state.auth); // Get user from Redux state

    // State for storing profile details
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [profileImage, setProfileImage] = useState(''); // Initialize with empty string
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        // Fetch user data and initialize state
        const fetchUserData = async () => {
            if (user && user.id) {
                try {
                    // You might already have the full user object in Redux,
                    // but fetching it again here ensures you have the latest data.
                    const res = await AuthService.getUser(user.id);
                    if (!res.error) {
                        const userData = res.user;
                        setName(userData.name || ''); // Use empty string if data is null/undefined
                        setEmail(userData.email || '');
                        setPhone(userData.phoneNumber || ''); // Assuming phone is stored as phoneNumber
                        setAddress(userData.address || '');
                        setProfileImage(userData.profileUri || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPTf60mv3VeYXJg37aEFDqWIzA8DNhRnU02w&s'); // Default image if none
                    } else {
                        showToast(res.message || 'Failed to fetch user data');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    showToast('An error occurred while fetching user data');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                // Handle case where user is not available (e.g., not logged in)
                showToast('User not found. Please log in again.');
                // Optionally navigate back to login
                // navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }
        };

        fetchUserData();
    }, [user]); // Refetch if user object in Redux changes

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
                    console.log('User cancelled image picker');
                } else if (response.errorCode) {
                    console.error('Image picker error: ', response.errorCode);
                } else if (response.assets && response.assets[0]) {
                    setProfileImage(response.assets[0].uri);
                    // You might want to upload the image here and get a secure URL
                }
            }
        );
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            if (user && user.id) {
                const updatedUserData = {
                    name: name,
                    email: email,
                    address: address,
                    // phone is not included as it's not editable
                    profileImage: profileImage, // You'll need to handle image upload and get a secure URL
                };
                // Assuming you have an update user profile method in your AuthService
                const res = await AuthService.updateUserProfile(user.id, updatedUserData);

                if (!res.error) {
                    showToast('Profile updated successfully!', 'success');
                    // Optionally update the user object in Redux state as well
                     // dispatch(setUser(res.user)); // Assuming the update method returns the updated user object
                    navigation.goBack(); // Navigate back after saving
                } else {
                    showToast(res.message || 'Failed to update profile');
                }
            }
        } catch (error) {
            console.error('Error saving profile changes:', error);
            showToast('An error occurred while saving profile changes');
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading profile data...</Text>
            </View>
        );
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
                editable={false} // Phone number is likely not editable
            />

            <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your address"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    loadingContainer: { // Style for loading indicator
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
});

export default EditProfile;
