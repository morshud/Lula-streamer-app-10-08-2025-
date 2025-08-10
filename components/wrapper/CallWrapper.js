import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Modal, Text, TouchableOpacity, View, Dimensions, AppState } from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AuthService from '../../services/AuthService';
import { navigate } from '../../navigations/RootNavigation';
import { callType } from '../../constants/data';
import { Audio } from 'expo-av';

const { height } = Dimensions.get('window');

const CallWrapper = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const [currentCall, setCurrentCall] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const ringtoneRef = useRef(null);
    const appState = useRef(AppState.currentState);

    const playRingtone = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/audio/iphone_15.mp3'),
                { isLooping: true }
            );
            ringtoneRef.current = sound;
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing ringtone:', error);
        }
    };

    const stopRingtone = async () => {
        if (ringtoneRef.current) {
            await ringtoneRef.current.stopAsync();
            await ringtoneRef.current.unloadAsync();
            ringtoneRef.current = null;
        }
    };

    useEffect(() => {
        if (!user) return;

        const handleAppStateChange = (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // App came to foreground - check if we need to hide modal
                if (currentCall?.type === callType.INCOMING) {
                    // Check if call was already accepted
                    AuthService.getUser(user.id).then(({ user: updatedUser }) => {
                        if (!updatedUser?.currentCall || updatedUser.currentCall.type !== callType.INCOMING) {
                            setModalVisible(false);
                            stopRingtone();
                        }
                    });
                }
            }
            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        const unsubscribe = AuthService.listenUserId(user.id, (data) => {
            setCurrentCall((prevCall) => {
                // If call was accepted from notification, skip showing modal
                if (data?.currentCall?.type === callType.INCOMING && 
                    prevCall?.callId !== data.currentCall.callId) {
                    // Check if app is in background (call was accepted via notification)
                    if (appState.current === 'background') {
                        return data.currentCall;
                    }
                    
                    setModalVisible(true);
                    playRingtone();
                    return data.currentCall;
                }
                
                if (!data.currentCall && prevCall) {
                    setModalVisible(false);
                    stopRingtone();
                    return null;
                }
                
                return prevCall;
            });
        });

        return () => {
            subscription.remove();
            unsubscribe();
            stopRingtone();
        };
    }, [user]);

    const handleAccept = () => {
        setModalVisible(false);
        stopRingtone();
        navigate('Call', { 
            id: currentCall,
            shouldJoin: true // Add this flag
        });
    };

    const handleDecline = () => {
        setModalVisible(false);
        stopRingtone();
        navigate('Call', { 
            id: currentCall, 
            end: true 
        });
    };

    return (
        <>
            {children}

            <Modal transparent animationType="fade" visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <LinearGradient colors={['rgba(97, 86, 226, 1)', 'rgba(171, 73, 161, 1)', 'rgba(171, 73, 161, 1)', 'rgba(171, 73, 161, 1)']} style={styles.gradientContainer}>
                        <View style={styles.contentContainer}>
                            <Text style={styles.mobileText}>Lula</Text>
                            <Text style={styles.callerName}>Incoming Call</Text>

                            <View style={styles.actionsContainer}>
                                {/* <View style={styles.actionRow}>
                                    <TouchableOpacity style={styles.secondaryAction}>
                                        <View style={styles.actionButton}>
                                            <Ionicons name="alarm" size={24} color="white" />
                                        </View>
                                        <Text style={styles.actionText}>Remind Me</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.secondaryAction}>
                                        <View style={styles.actionButton}>
                                            <Ionicons name="chatbubble" size={24} color="white" />
                                        </View>
                                        <Text style={styles.actionText}>Message</Text>
                                    </TouchableOpacity>
                                </View> */}

                                <View style={styles.mainActions}>
                                    <TouchableOpacity style={[styles.mainActionButton, styles.declineButton]} onPress={handleDecline}>
                                        <Ionicons name="call" size={32} color="white" />
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.mainActionButton, styles.acceptButton]} onPress={handleAccept}>
                                        <Ionicons name="call" size={32} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
            </Modal>
        </>
    )
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    gradientContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: height * 0.1,
    },
    mobileText: {
        color: '#eee',
        fontSize: 16,
        marginBottom: 8,
    },
    callerName: {
        color: 'white',
        fontSize: 36,
        fontWeight: '500',
        marginBottom: height * 0.08,
    },
    actionsContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 40,
    },
    secondaryAction: {
        alignItems: 'center',
    },
    actionButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionText: {
        color: 'white',
        fontSize: 14,
    },
    mainActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 30,
    },
    mainActionButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    declineButton: {
        backgroundColor: '#FF3B30',
        transform: [{ rotate: '135deg' }],
    },
    acceptButton: {
        backgroundColor: '#34C759',
    },
})

export default CallWrapper
