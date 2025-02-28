import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, TextInput} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

const Login = () => {

    const navigation = useNavigation();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountryCode, setSelectedCountryCode] = useState('+91');

    const countryOptions = [
        { label: '+92', value: '+92' },
        { label: '+1', value: '+1' },
        { label: '+44', value: '+44' },
        { label: '+91', value: '+91' },
    ];

    return (
            <LinearGradient
                colors={['rgba(97, 86, 226, 0.9)', 'rgba(171, 73, 161, 0.9)', 'rgba(171, 73, 161, 0.9)', 'rgba(171, 73, 161, 0.9)']}
                style={styles.gradient}
            >
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="keyboard-backspace" size={25} color="white" />
                </TouchableOpacity>
                <View style={styles.content}>
                    <Text style={styles.heading}>Continue with Phone Number </Text>
                    <Text style={styles.smallText}>A verification code will be sent to this number</Text>
                    <View style={styles.inputContainer}>
                        <RNPickerSelect
                            onValueChange={(value) => setSelectedCountryCode(value)}
                            items={countryOptions}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    top: 12,
                                    right: 22,
                                },
                            }}
                            value={selectedCountryCode}
                            useNativeAndroidPickerStyle={false}
                            placeholder={{}}
                            Icon={() => {
                                return <Text style={{color: '#000', fontSize: 12}}>▼</Text>;
                            }}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Mobile number"
                            placeholderTextColor="#C1C1C1"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Otp')}>
                            <LinearGradient
                                colors={['rgba(97, 86, 226, 0.9)', 'rgba(171, 73, 161, 0.9)']}
                                style={styles.button2}
                            >
                                <Text style={styles.button2Text} >Continue </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        padding: 0,
    },
    back: {
        position: 'absolute',
        left: 15,
        top: 15,
    },
    content: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 40,
        width: '100%',
        paddingHorizontal: 20,
        height: '80%',
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 19,
    },
    smallText: {
        fontSize: 11,
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20,
        paddingVertical: 3,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: 'gray',
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    button2: {
        backgroundColor: 'white',
        width: '100%',
        paddingVertical: 13,
        paddingHorizontal: 15,
        borderRadius: 45,
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },
    button2Text: {
        fontSize: 16,
        color: '#fff',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: '#000',
        width: 80,
        borderRadius: 8,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: '#000',
        width: 80,
        borderRadius: 8,
    },
});
  

export default Login;