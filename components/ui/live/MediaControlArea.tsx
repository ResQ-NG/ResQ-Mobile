import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, StyleSheet, Animated } from "react-native";
import { CameraCapturedPicture, CameraView } from "expo-camera";
import { router } from "expo-router";
import { MediaContent } from "@/constants/Types";

type MediaPlayerType = 'text' | 'voice' | 'camera' | null;
type CameraModeType = 'photo' | 'video';

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

interface RecordingData {
    uri?: string;
}

interface MediaState {
    currentRecordingData: RecordingData | null;
    recordingProgress: Animated.Value;
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
    const [mediaState, setMediaState] = useState<MediaState>({
        currentRecordingData: null,
        recordingProgress: new Animated.Value(0)
    });

    useEffect(() => {
        if (isRecording) {
            startRecordingAnimation();
        } else {
            mediaState.recordingProgress.setValue(0);
        }
    }, [isRecording]);

    const startRecordingAnimation = () => {
        Animated.timing(mediaState.recordingProgress, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false
        }).start();
    };

    const handleRecordingState = (recordingState: boolean) => {
        setCameraMode(recordingState ? "video" : "photo");
        setIsRecording(recordingState);
    };

    const addMediaContent = (url: string) => {
        const newContent: MediaContent = {
            type: 'camera',
            url,
            timestamp: Date.now()
        };
        const updatedContents = [...mediaContents, newContent];
        setMediaContents(updatedContents);
        return updatedContents;
    };

    const handlePictureActivation = (photo?: CameraCapturedPicture) => {
        if (!photo?.uri) return;
        const updatedContents = addMediaContent(photo.uri);
        router.push({
            pathname: "/preview-media",
            params: {
                image: photo.uri,
                mediaContents: JSON.stringify(updatedContents)
            }
        });
    };

    const handleVideoActivation = (recordingData?: RecordingData) => {
        if (!recordingData?.uri) return;
        setMediaState(prev => ({
            ...prev,
            currentRecordingData: recordingData
        }));
        addMediaContent(recordingData.uri);
    };

    const openPreviewModal = () => {
        if (!mediaState.currentRecordingData?.uri) return;
        const updatedContents = addMediaContent(mediaState.currentRecordingData.uri);
        router.push({
            pathname: "/preview-media",
            params: {
                video: mediaState.currentRecordingData.uri,
                mediaContents: JSON.stringify(updatedContents)
            }
        });
    };

    const takePicture = async () => {
        if (!cameraRef?.current) return;
        try {
            const photo = await cameraRef.current.takePictureAsync();
            if (photo) {
                handlePictureActivation(photo);
            }
        } catch (error) {
            console.error('Error taking picture:', error);
        }
    };

    const startVideoProcess = async () => {
        if (!cameraRef?.current) return;
        handleRecordingState(true);
        try {
            const recordedVideo = await cameraRef.current.recordAsync();
            handleVideoActivation(recordedVideo);
        } catch (error) {
            console.error('Error recording video:', error);
        }
    };

    const stopVideoProcess = async () => {
        if (!cameraRef?.current) return;
        try {
            cameraRef.current.stopRecording();
            handleRecordingState(false);
            openPreviewModal();
        } catch (error) {
            console.error('Error stopping video recording:', error);
        }
    };

    const handleCameraAction = async (status: "start" | "stop", mode: "video" | "photo") => {
        try {
            if (mode === 'photo') {
                takePicture();
            } else {
                status === "start" ? startVideoProcess() : stopVideoProcess();
            }
        } catch (error) {
            console.error('Camera action error:', error);
        }
    };

    const disableRecording = () => {
        handleRecordingState(false);
    };

    const handleTextMessage = () => {
        setActiveMediaPlayer('text');
        disableRecording();
    };

    const toggleAudioRecording = () => {
        setActiveMediaPlayer('voice');
        disableRecording();
    };

    const renderControlButton = (
        icon: keyof typeof MaterialCommunityIcons.glyphMap, 
        onPress: () => void,
        isActive: boolean = false
    ) => (
        <TouchableOpacity 
            style={[styles.controlButton, isActive && styles.activeButton]} 
            onPress={onPress}
        >
            {isActive ? (
                <View style={styles.activeIconWrapper}>
                    <MaterialCommunityIcons name={icon} size={26} color="white" />
                </View>
            ) : (
                <MaterialCommunityIcons name={icon} size={24} color="white" />
            )}
        </TouchableOpacity>
    );

    const renderCameraButton = () => (
        <TouchableOpacity
            style={[styles.captureButton, styles.activeButton]}
            onLongPress={() => handleCameraAction("start", "video")}
            onPress={() => isRecording ? handleCameraAction("stop", "video") : handleCameraAction("stop", "photo")}
        >
            <View style={[
                styles.captureButtonInner,
                cameraMode === 'video' && styles.videoButtonInner
            ]}>
                {cameraMode === 'video' && (
                    <Animated.View style={[
                        styles.recordingIndicator,
                        {
                            opacity: mediaState.recordingProgress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.3, 0.8]
                            })
                        }
                    ]} />
                )}
            </View>
        </TouchableOpacity>
    );

    const renderMediaControls = () => {
        switch(activeMediaPlayer) {
            case 'text':
                return (
                    <>
                        {renderControlButton("microphone", toggleAudioRecording)}
                        {renderControlButton("message-text", handleTextMessage, true)}
                        {renderControlButton("video", () => setActiveMediaPlayer('camera'))}
                    </>
                );
            case 'voice':
                return (
                    <>
                        {renderControlButton("video", () => setActiveMediaPlayer('camera'))}
                        {renderControlButton("microphone", toggleAudioRecording, true)}
                        {renderControlButton("message-text", handleTextMessage)}
                    </>
                );
            default:
                return (
                    <>
                        {renderControlButton("message-text", handleTextMessage)}
                        {renderCameraButton()}
                        {renderControlButton("microphone", toggleAudioRecording)}
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
