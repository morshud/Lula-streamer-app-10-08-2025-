import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useZego } from './ZegoProvider'; // Import the Zego Context
import ZegoExpressEngine from 'zego-express-engine-reactnative';

const CallScreen = ({ route, navigation }) => {
  const { engine, isInitialized } = useZego();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [streaming, setStreaming] = useState(false); // Whether the user is streaming or not

  const { userID, userName, targetUserID, targetUserName } = route.params;
  const roomID = 'call_room';
  const streamID = 'stream1'; // Unique stream ID

  // Handle the stream being received
  useEffect(() => {
    if (!isInitialized || !engine) return;

    const onStreamAdded = async (roomID, streamID) => {
      console.log('Stream Added:', streamID);
      if (streamID === 'stream1') {
        setIsReceivingCall(true);
        // Auto accept call when the stream is added (you can add custom logic for incoming call alerts)
        await startPlayingStream();
      }
    };

    engine.on('roomStreamUpdate', onStreamAdded);

    return () => {
      engine.off('roomStreamUpdate', onStreamAdded);
    };
  }, [isInitialized, engine]);

  // To start receiving the stream (i.e., the user clicks accept on incoming call)
  const startPlayingStream = async () => {
    if (!isInitialized || !engine) return;

    try {
      // Start playing the incoming stream
      await engine.startPlayingStream(streamID);
      setStreaming(true);
      console.log('Started playing incoming stream...');
    } catch (error) {
      console.error('Error playing stream:', error);
    }
  };

  // To accept an incoming call
  const acceptCall = async () => {
    setIsReceivingCall(false); // Stop showing the "receiving call" UI
    await startPlayingStream();
  };

  // To reject an incoming call
  const rejectCall = async () => {
    setIsReceivingCall(false); // Close the call screen
    console.log('Call rejected');
    navigation.goBack();
  };

  // Mute and unmute
  const toggleMute = async () => {
    if (!isInitialized || !engine) return;

    try {
      if (isMuted) {
        await engine.muteMicrophone(false); // Unmute the microphone
      } else {
        await engine.muteMicrophone(true); // Mute the microphone
      }
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('Error toggling microphone mute:', error);
    }
  };

  // Start/Stop Video
  const toggleVideo = async () => {
    if (!isInitialized || !engine) return;

    try {
      if (isVideoEnabled) {
        await engine.stopPublishingStream(streamID); // Stop publishing video
      } else {
        await engine.startPublishingStream(streamID); // Start publishing video
      }
      setIsVideoEnabled(!isVideoEnabled);
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isReceivingCall
          ? `Incoming Call from ${targetUserName}`
          : `Call with ${targetUserName}`}
      </Text>

      {streaming && (
        <View style={styles.videoContainer}>
          {/* Rendering the streamer's video */}
          <ZegoExpressEngine.View
            style={styles.streamView} // Video view style
            streamID={streamID} // Pass the streamID to render the streamer's video
          />
        </View>
      )}

      <View style={styles.buttonsContainer}>
        {isReceivingCall ? (
          <>
            <TouchableOpacity onPress={acceptCall} style={[styles.button, styles.acceptButton]}>
              <Text style={styles.buttonText}>Accept Call</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={rejectCall} style={[styles.button, styles.rejectButton]}>
              <Text style={styles.buttonText}>Reject Call</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {streaming ? (
              <>
                <TouchableOpacity onPress={toggleMute} style={styles.button}>
                  <Text style={styles.buttonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleVideo} style={styles.button}>
                  <Text style={styles.buttonText}>{isVideoEnabled ? 'Stop Video' : 'Start Video'}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, styles.endButton]}>
                <Text style={styles.buttonText}>End Call</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f1f1f1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  videoContainer: {
    width: '100%',
    height: 300,
    backgroundColor: 'black',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streamView: {
    width: '100%',
    height: '100%',
  },
  buttonsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 300,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: 'green',
  },
  rejectButton: {
    backgroundColor: 'red',
  },
  endButton: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CallScreen;
