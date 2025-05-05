import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AntDesign from '@expo/vector-icons/AntDesign'
import { LinearGradient } from 'expo-linear-gradient'
import * as ImagePicker from 'expo-image-picker'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import SubmitButton from '../components/ui/SubmitButton'
import { handleError } from '../utils/function'
import { useDispatch, useSelector } from 'react-redux'
import AuthService from '../services/AuthService'
import showToast from '../utils/toast'
import { setUser } from '../store/slices/auth'
import Loading from '../components/shared/Loading'
import { launchImagePicker } from '../utils/ImagePickerHelper'

const { width } = Dimensions.get('window')

const genderOptions = [
    { id: 'male', label: 'Male', icon: '👨' },
    { id: 'female', label: 'Female', icon: '👩' },
    { id: 'other', label: 'Other', icon: '👤' },
]

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
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 18 - 1950 + 1 }, (_, i) => 1950 + i).reverse()
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const days = Array.from({ length: 31 }, (_, i) => i + 1)

export default function CreateProfile() {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const navigation = useNavigation()

    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        birthYear: '',
        birthMonth: '',
        birthDay: '',
        selectedLanguages: [],
    })

    const [step, setStep] = useState(0)
    const [profileImage, setProfileImage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleNext = async () => {
        try {
            if (step < 4) {
                setStep(step + 1)
                return
            }
            setIsSubmitting(true)
            const profileUri = await AuthService.uploadFiles(profileImage, "lula/streamer/profile")

            const body = {
                ...formData,
                profileUri,
                profileCompleted: true,
            }

            const res = await AuthService.update(user.id, body)

            if (res.success) {
                const res = await AuthService.getUser(user.id)
                dispatch(setUser(res.user))
                showToast(res.message, "success")
                navigation.reset({ index: 0, routes: [{ name: "Main" }] })
            } else {
                showToast(res.message)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const pickImage = async () => {
        const result = await launchImagePicker()

        if (result.uri) {
            console.log('Selected image URI:', result.uri)
            setProfileImage(result.uri)
        }
    }

    const handleChange = (field, value) => {
        if (field === 'selectedLanguages') {
            setFormData((prevState) => {
                const updatedLanguages = prevState.selectedLanguages.includes(value)
                    ? prevState.selectedLanguages.filter((lang) => lang !== value)
                    : [...prevState.selectedLanguages, value]

                return { ...prevState, selectedLanguages: updatedLanguages }
            })
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [field]: value,
            }))
        }
    }

    const calculateAge = () => {
        if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) return null;

        const birthDate = new Date(
            parseInt(formData.birthYear),
            parseInt(formData.birthMonth) - 1,
            parseInt(formData.birthDay)
        );
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    const renderNameStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.waveEmoji}>👋</Text>
            <Text style={styles.title}>Hello!</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Your Name"
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholderTextColor="#666"
            />
        </View>
    )

    const renderGenderStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.title2}>What's Your Gender?</Text>
            <Text style={styles.subtitle}>Let us know which gender best describes you</Text>
            <View style={styles.genderContainer}>
                {genderOptions.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={[styles.genderOption, formData.gender === option.id && styles.genderOptionSelected]}
                        onPress={() => handleChange('gender', option.id)}
                    >
                        <Text style={styles.genderIcon}>{option.icon}</Text>
                        <Text style={[styles.genderLabel, formData.gender === option.id && styles.genderLabelSelected]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )

    const renderAgeStep = () => {
        const age = calculateAge();
        const isUnder18 = age !== null && age < 18;

        return (
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
                                    style={[styles.dateOption, formData.birthDay === day.toString() && styles.dateOptionSelected]}
                                    onPress={() => handleChange('birthDay', day.toString())}
                                >
                                    <Text
                                        style={[styles.dateText, formData.birthDay === day.toString() && styles.dateTextSelected]}
                                    >
                                        {day}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.dateColumn}>
                            {months.map((month) => (
                                <TouchableOpacity
                                    key={month}
                                    style={[styles.dateOption, formData.birthMonth === month.toString() && styles.dateOptionSelected]}
                                    onPress={() => handleChange('birthMonth', month.toString())}
                                >
                                    <Text
                                        style={[styles.dateText, formData.birthMonth === month.toString() && styles.dateTextSelected]}
                                    >
                                        {month}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.dateColumn}>
                            {years.map((year) => (
                                <TouchableOpacity
                                    key={year}
                                    style={[styles.dateOption, formData.birthYear === year.toString() && styles.dateOptionSelected]}
                                    onPress={() => handleChange('birthYear', year.toString())}
                                >
                                    <Text
                                        style={[styles.dateText, formData.birthYear === year.toString() && styles.dateTextSelected]}
                                    >
                                        {year}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </LinearGradient>
                <Text style={styles.ageNote}>Not allowed to use under 18</Text>
                {isUnder18 && (
                    <Text style={styles.errorText}>You must be at least 18 years old to proceed.</Text>
                )}
            </View>
        )
    }

    const renderLanguageStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.title2}>Select Languages</Text>
            <Text style={styles.subtitle}>
                Choose specific languages for communication, translation, localization, or learning purposes.
            </Text>
            <View style={styles.languageGrid}>
                {languages.map((language) => (
                    <TouchableOpacity
                        key={language.id}
                        style={[styles.languageOption, formData.selectedLanguages.includes(language.id) && styles.languageOptionSelected]}
                        onPress={() => handleChange('selectedLanguages', language.id)}
                    >
                        <Text
                            style={[styles.languageName, formData.selectedLanguages.includes(language.id) && styles.languageNameSelected]}
                        >
                            {language.name}
                        </Text>
                        <Text
                            style={[styles.languageNative, formData.selectedLanguages.includes(language.id) && styles.languageNativeSelected]}
                        >
                            {language.native}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )

    const renderProfileStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.title2}>Profile</Text>
            <Text style={styles.subtitle}>Upload your profile picture</Text>
            <View style={styles.profileImageContainer}>
                <View style={styles.imageWrapper}>
                    <Image
                        source={profileImage ? { uri: profileImage } : require('../assets/images/women.png')}
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
    )

    const isNextButtonDisabled = () => {
        if (step === 0 && !formData.name) {
            return true
        }
        if (step === 1 && !formData.gender) {
            return true
        }
        if (step === 2) {
            if (!formData.birthDay || !formData.birthMonth || !formData.birthYear) {
                return true
            }
            const age = calculateAge()
            if (age === null || age < 18) {
                return true
            }
        }
        if (step === 3 && formData.selectedLanguages.length === 0) {
            return true
        }
        if (step === 4 && !profileImage) {
            return true
        }
        return false
    }

    const renderStep = () => {
        switch (step) {
            case 0:
                return renderNameStep()
            case 1:
                return renderGenderStep()
            case 2:
                return renderAgeStep()
            case 3:
                return renderLanguageStep()
            case 4:
                return renderProfileStep()
            default:
                return null
        }
    }

    return (
        <View style={styles.container}>
            <Loading isVisible={isSubmitting} />
            <TouchableOpacity style={styles.backButton} onPress={() => setStep(Math.max(0, step - 1))}>
                <Text style={styles.backButtonText}>
                    <AntDesign name="arrowleft" size={20} color="black" />
                </Text>
            </TouchableOpacity>

            {renderStep()}
            <SubmitButton loading={isSubmitting} onPress={handleNext} title={'Next'} disabled={isNextButtonDisabled()} />
        </View>
    )
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
    errorText: {
        fontSize: 14,
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
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
})