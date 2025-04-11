import { useEffect, useState } from 'react';
import { StyleSheet, Modal, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AuthService from '../../services/AuthService';
import { navigate } from '../../navigations/RootNavigation';
import { callType } from '../../constants/data';

const { height } = Dimensions.get('window');

const CallWrapper = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const [currentCall, setCurrentCall] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = AuthService.listenUserId(user.id, (data) => {
            if (!data?.currentCall) return;

            setCurrentCall((prevCall) => {
                if (prevCall?.callId !== data?.currentCall?.callId) {
                    setModalVisible(data.currentCall.type === callType.INCOMING);
                    return data.currentCall;
                }
                return prevCall;
            });
        });

        return () => unsubscribe();
    }, [user]);

    const handleAccept = () => {
        setModalVisible(false);
        navigate('Call', { id: currentCall });
    };

    const handleDecline = () => {
        setModalVisible(false);
        navigate('Call', { id: currentCall, end: true })
    };

    return (
        <>
            {children}

            <Modal transparent animationType="fade" visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <LinearGradient
                        colors={['rgba(97, 86, 226, 1)', 'rgba(171, 73, 161, 1)', 'rgba(171, 73, 161, 1)', 'rgba(171, 73, 161, 1)']}
                        style={styles.gradientContainer}
                    >
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
                                    <TouchableOpacity 
                                        style={[styles.mainActionButton, styles.declineButton]}
                                        onPress={handleDecline}
                                    >
                                        <Ionicons name="call" size={32} color="white" />
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        style={[styles.mainActionButton, styles.acceptButton]}
                                        onPress={handleAccept}
                                    >
                                        <Ionicons name="call" size={32} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
            </Modal>
        </>
    );
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
});

export default CallWrapper;