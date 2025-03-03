import { MaterialCommunityIcons } from "@expo/vector-icons"
import React, { useEffect } from "react";
import { GestureResponderEvent, TouchableOpacity, View, StyleSheet, Animated } from "react-native"
import { CameraView } from "expo-camera";
import { router } from "expo-router";

type MediaPlayerType = 'text' | 'voice' | 'camera' | null;
type CameraModeType = 'photo' | 'video';

interface MediaContent {
    type: MediaPlayerType;
    url?: string;
    text?: string;
    timestamp: number;
}

interface IMediaControlAreaProps {
    activeMediaPlayer: MediaPlayerType;
    setActiveMediaPlayer: (type: MediaPlayerType) => void;
    cameraMode: CameraModeType;
    setCameraMode: (mode: CameraModeType) => void;
    isRecording: boolean;
    setIsRecording: (isRecording: boolean) => void;
    cameraRef?: React.RefObject<CameraView>;
    mediaContents: MediaContent[];
    setMediaContents: (contents: MediaContent[]) => void;
}

export const MediaControlArea = ({
    activeMediaPlayer,
    setActiveMediaPlayer,
    cameraMode,
    setCameraMode,
    isRecording,
    setIsRecording,
    cameraRef,
    mediaContents,
    setMediaContents
}: IMediaControlAreaProps) => {
    const recordingProgress = new Animated.Value(0);

    useEffect(() => {
        if (isRecording) {
            Animated.timing(recordingProgress, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false
            }).start();
        } else {
            recordingProgress.setValue(0);
        }
    }, [isRecording]);

    const handleCameraAction = async (): Promise<void> => {
        if (!cameraRef?.current) return;

        try {
            if (cameraMode === 'photo') {
                const photo = await cameraRef.current.takePictureAsync();
                if (photo?.uri) {
                    const newContent: MediaContent = {
                        type: 'camera',
                        url: photo.uri,
                        timestamp: Date.now()
                    };
                    const updatedContents = [...mediaContents, newContent];
                    setMediaContents(updatedContents);

                    router.push({
                        pathname: "/preview-media",
                        params: {
                            image: photo.uri,
                            mediaContents: JSON.stringify(updatedContents)
                        }
                    });
                }
            } else if (cameraMode === 'video') {
                if (isRecording) {
                    cameraRef.current.stopRecording();
                    setIsRecording(false);
                    setCameraMode('photo');
                } else {
                    const recordingData = await cameraRef.current.recordAsync();
                    if (recordingData?.uri) {
                        const newContent: MediaContent = {
                            type: 'camera',
                            url: recordingData.uri,
                            timestamp: Date.now()
                        };
                        const updatedContents = [...mediaContents, newContent];
                        setMediaContents(updatedContents);

                        router.push({
                            pathname: "/preview-media",
                            params: {
                                video: recordingData.uri,
                                mediaContents: JSON.stringify(updatedContents)
                            }
                        });
                    }
                    setIsRecording(true);
                }
            }
        } catch (error) {
            console.error('Camera action error:', error);
        }
    };

    const disableRecording = (): void => {
        setIsRecording(false);
        setCameraMode("photo");
    };

    const handleTextMessage = (): void => {
        setActiveMediaPlayer('text');
        disableRecording();
    };

    const toggleAudioRecording = (): void => {
        setActiveMediaPlayer('voice');
        disableRecording();
    };

    const renderMediaControls = () => {
        const commonButtons = {
            text: (
                <TouchableOpacity style={styles.controlButton} onPress={handleTextMessage}>
                    <MaterialCommunityIcons name="message-text" size={24} color="white" />
                </TouchableOpacity>
            ),
            voice: (
                <TouchableOpacity style={styles.controlButton} onPress={toggleAudioRecording}>
                    <MaterialCommunityIcons name="microphone" size={24} color="white" />
                </TouchableOpacity>
            ),
            camera: (
                <TouchableOpacity style={styles.controlButton} onPress={() => setActiveMediaPlayer('camera')}>
                    <MaterialCommunityIcons name="video" size={24} color="white" />
                </TouchableOpacity>
            )
        };

        const activeMediaButton = (icon: keyof typeof MaterialCommunityIcons.glyphMap) => (
            <TouchableOpacity style={[styles.controlButton, styles.activeButton]}>
                <View style={styles.activeIconWrapper}>
                    <MaterialCommunityIcons name={icon} size={26} color="white" />
                </View>
            </TouchableOpacity>
        );

        const cameraButton = (
            <TouchableOpacity
                style={[styles.captureButton, styles.activeButton]}
                onLongPress={() => {
                    if (!isRecording) {
                        setCameraMode('video');
                        setIsRecording(true);
                    }
                }}
                onPress={handleCameraAction}
            >
                <View style={[
                    styles.captureButtonInner,
                    cameraMode === 'video' && styles.videoButtonInner
                ]}>
                    {cameraMode === 'video' && (
                        <Animated.View style={[
                            styles.recordingIndicator,
                            {
                                opacity: recordingProgress.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.3, 0.8]
                                })
                            }
                        ]} />
                    )}
                </View>
            </TouchableOpacity>
        );

        switch(activeMediaPlayer) {
            case 'text':
                return (
                    <>
                        {commonButtons.voice}
                        {activeMediaButton("message-text")}
                        {commonButtons.camera}
                    </>
                );
            case 'voice':
                return (
                    <>
                        {commonButtons.camera}
                        {activeMediaButton("microphone")}
                        {commonButtons.text}
                    </>
                );
            default:
                return (
                    <>
                        {commonButtons.text}
                        {cameraButton}
                        {commonButtons.voice}
                    </>
                );
        }
    };

    return (
        <View style={styles.mediaPlayerArea}>
            {renderMediaControls()}
        </View>
    );
};

const styles = StyleSheet.create({
    mediaPlayerArea: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
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
    activeButton: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        transform: [{scale: 1.1}],
    },
    activeIconWrapper: {
        width: 70,
        height: 70,
        borderRadius: 250,
        borderColor: "white",
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoButtonInner: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: '#ff4444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordingIndicator: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 8,
        backgroundColor: '#ff0000',
    }
});
