import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { ThemedText } from '@/components/ThemedText'
import { CameraView, CameraType } from 'expo-camera';
import { useCheckPermission } from '@/hooks/useCheckPermission';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView, TapGestureHandler, State, GestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';


export default function CameraScreen() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [isMuted, setIsMuted] = useState(false);
    const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
    const [isRecordingAudio, setIsRecordingAudio] = useState(false);
    const { cameraPermission } = useCheckPermission()
    const router = useRouter()
    const iconColor = useThemeColor({}, 'text')
    const doubleTapRef = useRef(null);

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    function toggleMute() {
        setIsMuted(prev => !prev);
    }

    function toggleFlash() {
        setFlashMode(current => current === 'off' ? 'on' : 'off');
    }

    function toggleAudioRecording() {
        setIsRecordingAudio(prev => !prev);
        // Add audio recording logic here
    }

    const handleProfilePress = () => {
        router.push('/profile');
    };

    const handleNotificationsPress = () => {
        router.push('/notifications');
    };

    const handleTextMessage = () => {
        // Add text message logic here
    };

    useEffect(() => {
        const checkPermission = async () => {
            if (cameraPermission === false) {
                router.push("/permission");
            }
        };

        checkPermission();
    }, [cameraPermission, router]);

    const handleSingleTap = ({ nativeEvent }: GestureHandlerStateChangeEvent) => {
        if (nativeEvent?.state === State.ACTIVE) {
            // Handle single tap if needed
        }
    };

    const handleDoubleTap = ({ nativeEvent }: GestureHandlerStateChangeEvent) => {
        if (nativeEvent?.state === State.ACTIVE) {
            toggleCameraFacing();
        }
    };

const HeaderControls = () => {
    return (
        <View style={styles.headerControlsSection}>
            <TouchableOpacity
                style={styles.controlButton}
                onPress={handleProfilePress}
            >
                <Ionicons
                    name="person-circle"
                    size={28}
                    color="white"
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.controlButton}
                onPress={handleNotificationsPress}
            >
                <Ionicons
                    name="notifications"
                    size={26}
                    color="white"
                />
            </TouchableOpacity>
        </View>
    )
}

const ControlsArea = () => {
    return (
        <View style={styles.cameraControlsSection}>
            <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleMute}
            >
                <MaterialCommunityIcons
                    name={isMuted ? "microphone-off" : "microphone"}
                    size={24}
                    color="white"
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleFlash}
            >
                <MaterialCommunityIcons
                    name={flashMode === 'on' ? "flash" : "flash-off"}
                    size={24}
                    color="white"
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleCameraFacing}
            >
                <MaterialCommunityIcons
                    name="camera-flip"
                    size={24}
                    color="white"
                />
            </TouchableOpacity>
        </View>
    )
}


  return (
    <View style={styles.container}>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <TapGestureHandler
                onHandlerStateChange={handleSingleTap}
                waitFor={doubleTapRef}>
                <TapGestureHandler
                    onHandlerStateChange={handleDoubleTap}
                    numberOfTaps={2}
                    ref={doubleTapRef}>
                    <CameraView
                        style={styles.camera}
                        facing={facing}
                        audio={!isMuted}
                        flashMode={flashMode}
                    >
                        <HeaderControls />
                        <View style={styles.mediaPlayerArea}>
                            <TouchableOpacity
                                style={styles.controlButton}
                                onPress={handleTextMessage}
                            >
                                <MaterialCommunityIcons
                                    name="message-text"
                                    size={24}
                                    color="white"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.captureButton}>
                                <View style={styles.captureButtonInner} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.controlButton,
                                    isRecordingAudio && styles.recordingButton
                                ]}
                                onPress={toggleAudioRecording}
                            >
                                <MaterialCommunityIcons
                                    name="microphone"
                                    size={24}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                        <ControlsArea />
                    </CameraView>
                </TapGestureHandler>
            </TapGestureHandler>
        </GestureHandlerRootView>
    </View>
  )
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  mediaPlayerArea: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  recordingButton: {
    backgroundColor: 'rgba(255,0,0,0.3)',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  cameraControlsSection: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{translateY: -100}],
    paddingHorizontal: 7,
    paddingVertical: 15,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    borderRadius: 30,
  },
  headerControlsSection: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    zIndex: 1,
  }
});
