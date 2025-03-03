import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const { width } = Dimensions.get('window');

const genderOptions = [
    { id: 'male', label: 'Male', icon: '👨' },
    { id: 'female', label: 'Female', icon: '👩' },
    { id: 'other', label: 'Other', icon: '👤' },
];

const languages = [
    { id: 'english', name: 'English', native: 'English' },
    { id: 'spanish', name: 'Spanish', native: 'Español' },
    { id: 'hindi', name: 'Hindi', native: 'हिंदी' },
    { id: 'punjabi', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { id: 'odia', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { id: 'tamil', name: 'Tamil', native: 'தமிழ்' },
    { id: 'bengali', name: 'Bengali', native: 'বাংলা' },
    { id: 'gujarati', name: 'Gujarati', native: 'ગુજરાતી' },
    { id: 'malayalam', name: 'Malayalam', native: 'മലയാളം' },
];

const years = Array.from({ length: 10 }, (_, i) => 2015 - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

export default function CreateProfile() {
    const navigation = useNavigation()

    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [profileImage, setProfileImage] = useState('https://final-avrp.ellipticals.website/assets/images/logo/logo-white.png');

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        } else {
            navigation.navigate('Main');
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
    
        if (!result.canceled) {
            console.log('Selected image URI:', result.assets[0].uri);
            setProfileImage(result.assets[0].uri);
        } else {
            console.log('Image selection was canceled');
        }
    };

    const handleLanguageSelect = (languageId) => {
        setSelectedLanguages((prev) => {
            if (prev.includes(languageId)) {
                return prev.filter(id => id !== languageId);
            }
            return [...prev, languageId];
        });
    };

    const renderNameStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.waveEmoji}>👋</Text>
            <Text style={styles.title}>Hello!</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Your Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#666"
            />
        </View>
    );

    const renderGenderStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.title2}>What's Your Gender?</Text>
            <Text style={styles.subtitle}>Let us know which gender best describes you</Text>
            <View style={styles.genderContainer}>
                {genderOptions.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={[
                            styles.genderOption,
                            gender === option.id && styles.genderOptionSelected,
                        ]}
                        onPress={() => setGender(option.id)}
                    >
                        <Text style={styles.genderIcon}>{option.icon}</Text>
                        <Text style={[styles.genderLabel, gender === option.id && styles.genderLabelSelected]}>{option.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderAgeStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.title2}>How Old Are You?</Text>
            <Text style={styles.subtitle}>We will make sure you get better and personalized results</Text>
            <LinearGradient
                colors={['rgba(97, 86, 226, 0.9)', 'rgba(171, 73, 161, 0.9)']}
                style={styles.datePickerContainer}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.dateColumn}>
                        {days.map((day) => (
                            <TouchableOpacity
                                key={day}
                                style={[
                                    styles.dateOption,
                                    birthDay === day.toString() && styles.dateOptionSelected,
                                ]}
                                onPress={() => setBirthDay(day.toString())}
                            >
                                <Text style={[
                                    styles.dateText,
                                    birthDay === day.toString() && styles.dateTextSelected,
                                ]}>{day}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.dateColumn}>
                        {months.map((month) => (
                            <TouchableOpacity
                                key={month}
                                style={[
                                    styles.dateOption,
                                    birthMonth === month.toString() && styles.dateOptionSelected,
                                ]}
                                onPress={() => setBirthMonth(month.toString())}
                            >
                                <Text style={[
                                    styles.dateText,
                                    birthMonth === month.toString() && styles.dateTextSelected,
                                ]}>{month}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.dateColumn}>
                        {years.map((year) => (
                            <TouchableOpacity
                                key={year}
                                style={[
                                    styles.dateOption,
                                    birthYear === year.toString() && styles.dateOptionSelected,
                                ]}
                                onPress={() => setBirthYear(year.toString())}
                            >
                                <Text style={[
                                    styles.dateText,
                                    birthYear === year.toString() && styles.dateTextSelected,
                                ]}>{year}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.dateColumn}>
                        {months.map((month) => (
                            <TouchableOpacity
                                key={month}
                                style={[
                                    styles.dateOption,
                                    birthMonth === month.toString() && styles.dateOptionSelected,
                                ]}
                                onPress={() => setBirthMonth(month.toString())}
                            >
                                <Text style={[
                                    styles.dateText,
                                    birthMonth === month.toString() && styles.dateTextSelected,
                                ]}>{month}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.dateColumn}>
                        {years.map((year) => (
                            <TouchableOpacity
                                key={year}
                                style={[
                                    styles.dateOption,
                                    birthYear === year.toString() && styles.dateOptionSelected,
                                ]}
                                onPress={() => setBirthYear(year.toString())}
                            >
                                <Text style={[
                                    styles.dateText,
                                    birthYear === year.toString() && styles.dateTextSelected,
                                ]}>{year}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </LinearGradient>
            <Text style={styles.ageNote}>Not allowed to use under 18</Text>
        </View>
    );

    const renderLanguageStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.title2}>Select Languages</Text>
            <Text style={styles.subtitle}>Choose specific languages for communication, translation, localization, or learning purposes.</Text>
            <View style={styles.languageGrid}>
                {languages.map((language) => (
                    <TouchableOpacity
                        key={language.id}
                        style={[
                            styles.languageOption,
                            selectedLanguages.includes(language.id) && styles.languageOptionSelected,
                        ]}
                        onPress={() => handleLanguageSelect(language.id)}
                    >
                        <Text style={[styles.languageName, selectedLanguages.includes(language.id) && styles.languageNameSelected,]}>{language.name}</Text>
                        <Text style={[styles.languageNative, selectedLanguages.includes(language.id) && styles.languageNativeSelected,]}>{language.native}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderProfileStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.title2}>Profile</Text>
            <Text style={styles.subtitle}>Upload your profile picture</Text>
            <View style={styles.profileImageContainer}>
                <View style={styles.imageWrapper}>
                    <Image
                        source={require('../assets/images/women.png')}
                        style={styles.profileImage}
                    />
                    <TouchableOpacity onPress={pickImage}>
                        <LinearGradient
                            colors={['rgba(97, 86, 226, 0.9)', 'rgba(171, 73, 161, 0.9)']}
                            style={styles.editButton}
                        >
                            <FontAwesome5 name="pencil-alt" size={18} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
    
    // const renderFinalStep = () => (
    //     <View style={styles.stepContainer}>
    //         <Image
    //             source={require('../assets/images/welcome.png')}
    //             style={styles.welcomeImage}
    //         />
    //         <Text style={styles.title3}>Welcome</Text>
    //         <Text style={styles.subtitle}>Welcome! Your profile is complete. Enjoy a personalized experience ahead!</Text>
    //         <View style={styles.profileImageContainer}>
    //             <View style={styles.imageWrapper}>
    //                 <Image
    //                     source={require('../assets/images/women.png')}
    //                     style={styles.profileImage}
    //                 />
    //             </View>
    //         </View>
    //     </View>
    // );

    const renderStep = () => {
        switch (step) {
            case 0:
                return renderNameStep();
            case 1:
                return renderGenderStep();
            case 2:
                return renderAgeStep();
            case 3:
                return renderLanguageStep();
            case 4:
                return renderProfileStep();
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => setStep(Math.max(0, step - 1))}>
                <Text style={styles.backButtonText}><AntDesign name="arrowleft" size={20} color="black" /></Text>
            </TouchableOpacity>

            {renderStep()}

            <TouchableOpacity
                onPress={handleNext}
            >
                <LinearGradient
                    colors={['rgba(97, 86, 226, 0.9)', 'rgba(171, 73, 161, 0.9)']}
                    style={styles.nextButton}
                >
                    <Text style={styles.nextButtonText}>Next</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    profileImageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    imageWrapper: {
        width: 200,
        height: 200,
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 500,
    },
    editButton: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        backgroundColor: '#8A2BE2',
        width: 40,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 200,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    backButtonText: {
        fontSize: 24,
        color: '#000',
    },
    stepContainer: {
        flex: 1,
        paddingTop: 50,
        alignItems: 'center',
    },
    welcomeImage: {
        width: '80%',
        objectFit: 'contain',
        marginBottom: 30,
    },
    waveEmoji: {
        fontSize: 48,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 50,
        textAlign: 'center',
    },
    title2: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    title3: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        marginBottom: 20,
    },
    nextButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#8A2BE2',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    genderContainer: {
        width: '100%',
        gap: 10,
    },
    genderOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#F0E6FF',
        borderRadius: 15,
        marginBottom: 10,
    },
    genderOptionSelected: {
        backgroundColor: '#8A2BE2',
    },
    genderIcon: {
        fontSize: 24,
        marginRight: 10,
    },
    genderLabel: {
        fontSize: 16,
        color: '#000',
    },
    genderLabelSelected: {
        color: '#fff',
    },
    datePickerContainer: {
        flexDirection: 'row',
        height: 245,
        borderRadius: 10,
        marginBottom: 20,
    },
    dateColumn: {
        width: width / 3.3,
        paddingHorizontal: 10,
    },
    dateOption: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: 5,
        backgroundColor: 'rgba(225, 225, 225, 0.3)',
    },
    dateOptionSelected: {
        backgroundColor: '#fff',
    },
    dateText: {
        fontSize: 18,
        color: '#fff',
    },
    dateTextSelected: {
        color: '#000',
    },
    ageNote: {
        fontSize: 12,
        color: '#666',
        marginTop: 10,
    },
    languageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    languageOption: {
        width: '32%',
        paddingVertical: 8,
        backgroundColor: '#F0E6FF',
        borderRadius: 5,
        marginBottom: 15,
        alignItems: 'center',
    },
    languageOptionSelected: {
        backgroundColor: '#8A2BE2',
    },
    languageName: {
        fontSize: 13,
        color: '#000',
    },
    languageNameSelected: {
        color: '#fff',
    },
    languageNative: {
        fontSize: 11,
        color: '#666',
    },
    languageNativeSelected: {
        color: '#fff',
    },
});