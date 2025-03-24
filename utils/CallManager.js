// CallManager.js
import { Alert } from 'react-native';
import { StreamVideoClient } from '@stream-io/video-react-native-sdk';
import functions from '@react-native-firebase/functions';
import { navigate } from '../navigations/RootNavigation'; // Custom navigation service

class CallManager {
    static instance;

    constructor(user) {
        if (CallManager.instance) {
            return CallManager.instance; // Ensure singleton instance
        }

        this.user = user;
        this.client = new StreamVideoClient({
            apiKey: '62qpjv7q879v',
            user,
            tokenProvider: this.tokenProvider,
            options: {
                logger: (logLevel, message) => console.log(message),
            },
        });

        this.setupCallListeners();
        CallManager.instance = this;
    }

    async tokenProvider() {
        try {
            const reference = functions().httpsCallable('generateStreamToken');
            const { data } = await reference({ user: this.user });
            return data.token;
        } catch (error) {
            console.error('Error generating token:', error);
        }
    }

    setupCallListeners() {
        this.client.on('call.invited', (call) => {
            console.log('Incoming call:', call);

            Alert.alert(
                'Incoming Call',
                `You have an incoming call from ${call.state.members[0]?.user?.name || 'Unknown'}`,
                [
                    {
                        text: 'Decline',
                        onPress: () => call.leave(),
                        style: 'cancel',
                    },
                    {
                        text: 'Accept',
                        onPress: () => navigate('CallComponent', { id: call.id }),
                    },
                ]
            );
        });
    }

    getClient() {
        return this.client;
    }
}

export default CallManager;
