import { StyleSheet, View, TouchableOpacity, Text, Platform, SafeAreaView } from 'react-native'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { CameraView, CameraType, CameraMode } from 'expo-camera';
import { useCheckPermission } from '@/hooks/useCheckPermission';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView, TapGestureHandler, State, GestureHandlerStateChangeEvent, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HeaderControls } from './HeaderControl';

interface ICameraMainComponentProps {
    controlArea: React.JSX.Element;
    cameraMode: 'photo' | 'video';
    setCameraMode: (mode: 'photo' | 'video') => void;
    isRecording?: boolean;
    recordingDuration?: number;
    cameraRef?: React.RefObject<CameraView>;
    flash?: 'on' | 'off' | 'auto';
    setFlash?: (flash: 'on' | 'off' | 'auto') => void;
    setIsRecording?: (isRecording: boolean) => void;
}

const MAX_VIDEO_DURATION = 45; // Maximum video duration in seconds

export default function CameraMainComponent({
    controlArea,
    cameraMode,
    isRecording = false,
    recordingDuration = 0,
    cameraRef,
    flash = 'auto',
    setFlash,
    setIsRecording
}: ICameraMainComponentProps) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [isMuted, setIsMuted] = useState(false);
    const [flashMode, setFlashMode] = useState<'on' | 'off' | 'auto'>('auto');
    const [torchMode, setTorchMode] = useState<boolean>(false);
    const [zoom, setZoom] = useState(0);
    const [lastZoom, setLastZoom] = useState(0);
    const [isZooming, setIsZooming] = useState(false);
    const { cameraPermission } = useCheckPermission()
    const router = useRouter()
    const doubleTapRef = useRef(null);

    // Store current recording state in a ref to preserve between camera switches
    const recordingStateRef = useRef({
        isRecording: false,
        pauseRecording: false
    });

    useEffect(() => {
        // Stop recording when max duration is reached
        if (recordingDuration >= MAX_VIDEO_DURATION && isRecording && setIsRecording) {
            setIsRecording(false);
        }
    }, [recordingDuration, isRecording, setIsRecording]);

    // Update the ref when isRecording changes
    useEffect(() => {
        recordingStateRef.current.isRecording = isRecording;
    }, [isRecording]);

    const toggleCameraFacing = useCallback(() => {
        if (isRecording && setIsRecording && cameraRef?.current) {
            // Signal that recording should pause during camera switch
            recordingStateRef.current.pauseRecording = true;

            // Pause recording (or stop if necessary)
            // Option 1: If your camera API supports pausing
            // cameraRef.current.pauseRecording();

            // Option A2: If you need to stop recording temporarily
            setIsRecording(false);

            // Switch camera and resume recording after a short delay
            setTimeout(() => {
                setFacing(current => (current === 'back' ? 'front' : 'back'));

                // Resume recording after camera has switched
                setTimeout(() => {
                    if (recordingStateRef.current.pauseRecording) {
                        setIsRecording(true);
                        recordingStateRef.current.pauseRecording = false;
                    }
                }, 300); // Delay to ensure camera has switched
            }, 50);
        } else {
            // Normal camera flip when not recording
            setFacing(current => (current === 'back' ? 'front' : 'back'));
        }
    }, [isRecording, setIsRecording, cameraRef]);

    const toggleMute = useCallback(() => {
        // We can safely toggle mute without restarting recording
        setIsMuted(prev => !prev);
    }, []);

    const toggleFlash = useCallback(() => {
        setFlashMode(current => {
            const modes: ('on' | 'off' | 'auto')[] = ['auto', 'on', 'off'];
            const nextIndex = (modes.indexOf(current) + 1) % modes.length;
            const nextMode = modes[nextIndex];
            if (setFlash) {
                setFlash(nextMode);
            }
            return nextMode;
        });
    }, [setFlash]);

    const toggleTorch = useCallback(() => {
        setTorchMode(current => !current);
    }, []);

    const setQuickZoom = useCallback((zoomLevel: number) => {
        setZoom(zoomLevel);
        setLastZoom(zoomLevel);
    }, []);

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

    const onSwipeUp = useCallback((event: any) => {
        'worklet';
        if (event.velocityY < -500) {
            router.push("/preview-media");
        }
    }, [router]);

    const onPinch = useCallback(
        (event: any) => {
            'worklet';
            setIsZooming(true);
            const velocity = event.velocity / 10;
            const outFactor = lastZoom * (Platform.OS === 'ios' ? 40 : 20);

            const zoomChange = velocity > 0
                ? event.scale * velocity * (Platform.OS === 'ios' ? 0.015 : 20)
                : (event.scale * (outFactor || 1)) * Math.abs(velocity) * (Platform.OS === 'ios' ? 0.03 : 35);
            let newZoom = velocity > 0
                ? zoom + (zoomChange * 0.8)
                : zoom - (zoomChange * 0.8);

            // Smooth clamping with easing
            const clampedZoom = Math.max(0, Math.min(0.7, newZoom));
            newZoom = zoom + (clampedZoom - zoom) * 0.7;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setZoom(newZoom);
                });
            });
        },
        [zoom, lastZoom]
    );

    const onPinchEnd = useCallback(
        (event: any) => {
            'worklet';
            setLastZoom(zoom);
            setIsZooming(false);
        },
        [zoom]
    );

    const pinchGesture = useMemo(
        () => Gesture.Pinch().onUpdate(onPinch).onEnd(onPinchEnd),
        [onPinch, onPinchEnd]
    );

    const swipeGesture = useMemo(
        () => Gesture.Pan().onEnd(onSwipeUp),
        [onSwipeUp]
    );

    const combinedGestures = useMemo(
        () => Gesture.Race(pinchGesture, swipeGesture),
        [pinchGesture, swipeGesture]
    );

    const ControlsArea = useCallback(() => {
        return (
            <SafeAreaView style={styles.cameraControlsSection}>
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
                        name={flashMode === 'on' ? "flash" : flashMode === 'auto' ? "flash-auto" : "flash-off"}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={toggleTorch}
                >
                    <MaterialCommunityIcons
                        name={torchMode ? "flashlight" : "flashlight-off"}
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
            </SafeAreaView>
        )
    }, [isMuted, flashMode, torchMode, toggleMute, toggleFlash, toggleTorch, toggleCameraFacing]);

    const ZoomControls = useCallback(() => {
        return (
            <View style={styles.zoomControlsSection}>
                <TouchableOpacity
                    style={styles.zoomButton}
                    onPress={() => setQuickZoom(0)}
                >
                    <Text style={styles.zoomText}>1x</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.zoomButton}
                    onPress={() => setQuickZoom(0.3)}
                >
                    <Text style={styles.zoomText}>2x</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.zoomButton}
                    onPress={() => setQuickZoom(0.7)}
                >
                    <Text style={styles.zoomText}>3x</Text>
                </TouchableOpacity>
            </View>
        )
    }, [setQuickZoom]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GestureDetector gesture={combinedGestures}>
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
                            flash={flash}
                            enableTorch={torchMode}
                            mirror={true}
                            zoom={zoom}
                            videoStabilizationMode="auto"
                        >
                            <HeaderControls />
                            {isRecording && <View style={[
                                styles.recordingIndicator,
                                recordingDuration >= MAX_VIDEO_DURATION - 5 && styles.recordingIndicatorWarning
                            ]}>
                                <View style={[
                                    styles.recordingDot,
                                    recordingDuration >= MAX_VIDEO_DURATION - 5 && styles.recordingDotWarning
                                ]} />
                                <View style={styles.recordingTimer}>
                                    {recordingDuration !== undefined && (
                                        <Text style={[
                                            styles.recordingTimerText,
                                            recordingDuration >= MAX_VIDEO_DURATION - 5 && styles.recordingTimerTextWarning
                                        ]}>
                                            {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                                            {recordingDuration >= MAX_VIDEO_DURATION - 5 && ` / ${MAX_VIDEO_DURATION}s`}
                                        </Text>
                                    )}
                                </View>
                            </View>}
                            {isZooming && (
                                <View style={styles.zoomIndicator}>
                                    <Text style={styles.zoomIndicatorText}>
                                        {(zoom * 3 + 1).toFixed(1)}x
                                    </Text>
                                </View>
                            )}
                            {controlArea}
                            <ControlsArea />
                            <ZoomControls />
                        </CameraView>
                    </TapGestureHandler>
                </TapGestureHandler>
            </GestureDetector>
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
    recordingIndicatorWarning: {
        backgroundColor: 'rgba(255, 0, 0, 0.6)',
    },
    recordingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ff0000',
    },
    recordingDotWarning: {
        backgroundColor: '#fff',
    },
    recordingTimer: {
        minWidth: 40,
    },
    recordingTimerText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    recordingTimerTextWarning: {
        fontWeight: '700',
    },
    zoomIndicator: {
        position: 'absolute',
        top: 100,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    zoomIndicatorText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    zoomControlsSection: {
        position: 'absolute',
        bottom: 120,
        left: '50%',
        transform: [{translateX: -75}],
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
        padding: 5,
        gap: 10,
    },
    zoomButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    zoomText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    }
});
