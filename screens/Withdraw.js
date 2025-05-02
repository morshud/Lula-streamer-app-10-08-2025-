import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Modal, TextInput } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import AuthService from '../services/AuthService'
import WithdrawService from '../services/WithdrawService'
import { useSelector } from 'react-redux'
import showToast from '../utils/toast'
import { handleError } from '../utils/function'

const Withdraw = () => {
    const navigation = useNavigation()
    const { user } = useSelector((state) => state.auth)
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [withdrawals, setWithdrawals] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: '',
        ifsc: '',
        upiId: '',
        amount: ''
    })

    // Fetch user data
    useEffect(() => {
        const getData = async () => {
            try {
                setIsLoading(true)
                const res = await AuthService.getUser(user.id)
                if (!res.error) {
                    setData(res.user)
                }
            } catch (error) {
                handleError(error)
            } finally {
                setIsLoading(false)
            }
        }
        getData()
    }, [])

    // Fetch withdrawals
    useEffect(() => {
        const fetchWithdrawals = async () => {
            try {
                setIsLoading(true)
                const res = await WithdrawService.getWithdrawals(user.id)
                if (!res.error) {
                    setWithdrawals(res.data)
                } else {
                    showToast('Error fetching withdrawals')
                }
            } catch (error) {
                handleError(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchWithdrawals()
    }, [])

    const handleFormSubmit = async () => {
        try {
            if (!formData.bankName && !formData.upiId) {
                showToast('Please provide either Bank Name or UPI ID')
                return
            }
            if (!formData.amount || parseFloat(formData.amount) <= 0) {
                showToast('Please enter a valid amount')
                return
            }

            setIsSubmitting(true)
            const res = await WithdrawService.createWithdrawal(
                user.id,
                formData.bankName,
                formData.accountNumber,
                formData.ifsc,
                formData.upiId,
                parseFloat(formData.amount)
            )

            if (!res.error) {
                showToast('Withdrawal request created!', 'success')
                setModalVisible(false)
                setFormData({
                    bankName: '',
                    accountNumber: '',
                    ifsc: '',
                    upiId: '',
                    amount: ''
                })
                // Refresh withdrawals
                const updatedWithdrawals = await WithdrawService.getWithdrawals(user.id)
                if (!updatedWithdrawals.error) {
                    setWithdrawals(updatedWithdrawals.data)
                }
            } else {
                showToast('Error creating withdrawal request')
            }
        } catch (error) {
            handleError(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderWithdrawalItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.cardName}>{item.bankName} Bank</Text>
                <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}  -  IFSC: {item.ifsc}</Text>
                <Text style={styles.cardPrice}>{item.amount} Coin</Text>
                <View style={[styles.statusBadge, item.status === 'completed' ? styles.completed : styles.pending]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>
        </View>
    )

    return (
        <LinearGradient colors={['rgba(171, 73, 161, 0.9)', 'rgba(97, 86, 226, 0.9)']} style={styles.gradient}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Withdraw</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={() => navigation.navigate('StreamerProfile')}>
                        <Image 
                            source={data?.profileUri ? { uri: data?.profileUri } : require('../assets/images/avatar.png')} 
                            style={styles.headerIconsImage} 
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.content}>
                <FlatList
                    data={withdrawals}
                    renderItem={renderWithdrawalItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={<Text style={styles.emptyText}>No withdrawals found</Text>}
                />
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>New Withdrawal Request</Text>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Coin"
                            value={formData.amount}
                            onChangeText={(text) => setFormData({...formData, amount: text})}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Bank Name (Optional)"
                            value={formData.bankName}
                            onChangeText={(text) => setFormData({...formData, bankName: text})}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Bank Account Number (Optional)"
                            value={formData.accountNumber}
                            onChangeText={(text) => setFormData({...formData, accountNumber: text})}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="IFSC Code (Optional)"
                            value={formData.ifsc}
                            onChangeText={(text) => setFormData({...formData, ifsc: text})}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="UPI ID (Optional)"
                            value={formData.upiId}
                            onChangeText={(text) => setFormData({...formData, upiId: text})}
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                style={styles.button2} 
                                onPress={() => setModalVisible(false)}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.button2Text}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.button1} 
                                onPress={handleFormSubmit}
                                disabled={isSubmitting}
                            >
                                <LinearGradient
                                    colors={['#CE54C1', 'rgba(97, 86, 226, 0.9)']}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </Text>
                                </LinearGradient>  
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    header: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
    },
    headerIcons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    headerIconsImage: {
        width: 32,
        height: 32,
        marginLeft: 10,
        borderRadius: 250,
        objectFit: 'cover',
    },
    content: {
        width: '100%',
        marginBottom: 30,
        backgroundColor: '#fff',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        flex: 1,
        position: 'relative',
    },
    listContainer: {
        padding: 15,
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginBottom: 10,
        padding: 15,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'column',
    },
    cardName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    cardDate: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    cardPrice: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6200ee',
        marginTop: 4,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
        position: 'absolute',
        textTransform: 'capitalize',
        right: 0,
        top: 0,
    },
    pending: {
        backgroundColor: '#ffebee',
    },
    completed: {
        backgroundColor: '#e8f5e9',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(171, 73, 161, 0.9)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 14,
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button1: {
        width: '47%',
    },
    button: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 40,
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    button2: {
        backgroundColor: 'white',
        width: '47%',
        borderWidth: 1,
        borderColor: '#000',
        paddingVertical: 13,
        paddingHorizontal: 15,
        borderRadius: 45,
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 10,
        marginHorizontal: 2,
    },
    button2Text: {
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        padding: 20,
    }
})

export default Withdraw