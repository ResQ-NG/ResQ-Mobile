import { StyleSheet, View, TouchableOpacity } from 'react-native'
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
}

export default function CameraMainComponent({ controlArea, cameraMode, setCameraMode }: ICameraMainComponentProps) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [isMuted, setIsMuted] = useState(false);
    const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
    const { cameraPermission } = useCheckPermission()
    const router = useRouter()
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
                        mode={cameraMode as CameraMode}
                        flashMode={flashMode}
                    >
                        <HeaderControls />
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
    }
});
