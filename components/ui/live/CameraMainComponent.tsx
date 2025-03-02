import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { CameraView, CameraType, CameraMode } from 'expo-camera';
import { useCheckPermission } from '@/hooks/useCheckPermission';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView, TapGestureHandler, State, GestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import {  MaterialCommunityIcons } from '@expo/vector-icons';
import { HeaderControls } from './HeaderControl';

interface ICameraMainComponentProps {
    controlArea: React.JSX.Element;
    cameraMode: 'photo' | 'video';
    setCameraMode: (mode: 'photo' | 'video') => void;
    isRecording?: boolean;
    recordingDuration?: number;
    onCapture?: () => void; // Callback for taking photo
    onStartRecording?: () => void; // Callback for starting video recording
    onStopRecording?: () => void; // Callback for stopping video recording
}

export default function CameraMainComponent({
    controlArea,
    cameraMode, 
    isRecording = false,
    recordingDuration = 0,
    onCapture,
    onStartRecording,
    onStopRecording
}: ICameraMainComponentProps) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [isMuted, setIsMuted] = useState(false);
    const [flashMode, setFlashMode] = useState<boolean>(false);
    const { cameraPermission } = useCheckPermission()
    const router = useRouter()
    const doubleTapRef = useRef(null);
    const cameraRef = useRef<CameraView>(null);

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    function toggleMute() {
        setIsMuted(prev => !prev);
    }

    function toggleFlash() {
        setFlashMode(current => current === false ? true : false);
    }

    const handleCapture = async () => {
        if (!cameraRef.current) return;

        if (cameraMode === 'photo') {
            if (onCapture) {
                onCapture();
            }
        } else {
            if (isRecording) {
                if (onStopRecording) {
                    onStopRecording();
                }
            } else {
                if (onStartRecording) {
                    onStartRecording();
                }
            }
        }
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
                        name={flashMode === true ? "flash" : "flash-off"}
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
        <GestureHandlerRootView style={{ flex: 1 }}>
            <TapGestureHandler
                onHandlerStateChange={handleSingleTap}
                waitFor={doubleTapRef}>
                <TapGestureHandler
                    onHandlerStateChange={handleDoubleTap}
                    numberOfTaps={2}
                    ref={doubleTapRef}>
                    <CameraView
                        ref={cameraRef}
                        style={styles.camera}
                        facing={facing}
                        mode={cameraMode as CameraMode}
                        mute={isMuted}
                        enableTorch={flashMode}
                    >
                        <HeaderControls />
                        {isRecording && <View style={styles.recordingIndicator}>
                            <View style={styles.recordingDot} />
                            <View style={styles.recordingTimer}>
                                {recordingDuration !== undefined && (
                                    <Text style={styles.recordingTimerText}>
                                        {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                                    </Text>
                                )}
                            </View>
                        </View>}
                        {controlArea}
                        <ControlsArea />
                    </CameraView>
                </TapGestureHandler>
            </TapGestureHandler>
        </GestureHandlerRootView>
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
    controlButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
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
    recordingIndicator: {
        position: 'absolute',
        top: 100,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 8,
    },
    recordingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ff0000',
    },
    recordingTimer: {
        minWidth: 40,
    },
    recordingTimerText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    }
});
