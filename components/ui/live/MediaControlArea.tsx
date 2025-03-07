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
    recordingTimer: NodeJS.Timeout | null;
}

const MAX_RECORDING_DURATION = 45000; // 45 seconds in milliseconds

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
        recordingProgress: new Animated.Value(0),
        recordingTimer: null
    });

    useEffect(() => {
        if (isRecording) {
            animateRecordingProgress();
            const timer = setTimeout(() => {
                finalizeVideoRecording();
            }, MAX_RECORDING_DURATION);
            setMediaState(prev => ({ ...prev, recordingTimer: timer }));
        } else {
            mediaState.recordingProgress.setValue(0);
            if (mediaState.recordingTimer) {
                clearTimeout(mediaState.recordingTimer);
            }
        }
        return () => {
            if (mediaState.recordingTimer) {
                clearTimeout(mediaState.recordingTimer);
            }
        };
    }, [isRecording]);



    const animateRecordingProgress = () => {
        Animated.timing(mediaState.recordingProgress, {
            toValue: 1,
            duration: MAX_RECORDING_DURATION,
            useNativeDriver: false
        }).start();
    };

    const updateRecordingState = (recordingState: boolean) => {
        setCameraMode(recordingState ? "video" : "photo");
        setIsRecording(recordingState);
    };

    const appendMediaContent = (url: string) => {
        const newContent: MediaContent = {
            type: 'camera',
            url,
            timestamp: Date.now()
        };
        const updatedContents = [...mediaContents, newContent];
        setMediaContents(updatedContents);
        return updatedContents;
    };

    const openPreviewModalWithParams = (params: { image?: string, video?: string, mediaContents: string }) => {
        if (!params.image && !params.video) return;
        router.push({
            pathname: "/preview-media",
            params
        });
    };

    const processMediaCapture = async (mediaType:  CameraModeType, media?: CameraCapturedPicture | RecordingData) => {
        if (!media?.uri) return;


        const updatedContents = appendMediaContent(media.uri);

        if (mediaType === 'photo') {
            openPreviewModalWithParams({
                image: media.uri,
                mediaContents: JSON.stringify(updatedContents)
            });
        } else {
            openPreviewModalWithParams({
                video: media.uri,
                mediaContents: JSON.stringify(updatedContents)
            });
        }
    };



    const capturePhoto = async () => {
        if (!cameraRef?.current) return;
        try {
            const photo = await cameraRef.current.takePictureAsync();
            if (photo) {
                await processMediaCapture('photo', photo);
            }
        } catch (error) {
            console.error('Error taking picture:', error);
        }
    };

    const initiateVideoRecording = async () => {
        if (!cameraRef?.current) return;
        updateRecordingState(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            const recordedVideo = await cameraRef.current.recordAsync({
                maxDuration: MAX_RECORDING_DURATION / 1000,
            });
            updateRecordingState(false);
            await processMediaCapture('video', recordedVideo);

        } catch (error) {
            console.error('Error recording video:', error);
        }
    };


    const finalizeVideoRecording = () => {
        if (!cameraRef?.current || !isRecording) return;
        try {
            cameraRef.current.stopRecording();
        } catch (error) {
            console.error('Error stopping video recording:', error);
        }
    };

    const handleMediaCapture = async ( mode: CameraModeType, status?: "start" | "stop") => {
        try {
            if (mode === 'photo') {
                capturePhoto();
            } else {
                status === "start" ? initiateVideoRecording() : finalizeVideoRecording();
            }
        } catch (error) {
            console.error('Camera action error:', error);
        }
    };

    const stopRecording = () => {
        updateRecordingState(false);
    };

    const switchToTextMode = () => {
        setActiveMediaPlayer('text');
        stopRecording();
    };

    const switchToVoiceMode = () => {
        setActiveMediaPlayer('voice');
        stopRecording();
    };

    const renderMediaButton = (
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

    const renderCaptureButton = () => (
        <TouchableOpacity
            style={[styles.captureButton, styles.activeButton]}
            onLongPress={() => handleMediaCapture( "video", "start")}
            onPress={() => isRecording ? handleMediaCapture("video", "stop") : handleMediaCapture("photo")}
        >
            {isRecording && (
                <Animated.View
                    style={[
                        styles.circularProgress,
                        {
                            transform: [{
                                rotate: mediaState.recordingProgress.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg']
                                })
                            }]
                        }
                    ]}
                />
            )}
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

    const renderActiveMediaControls = () => {
        switch(activeMediaPlayer) {
            case 'text':
                return (
                    <>
                        {renderMediaButton("microphone", switchToVoiceMode)}
                        {renderMediaButton("message-text", switchToTextMode, true)}
                        {renderMediaButton("video", () => setActiveMediaPlayer('camera'))}
                    </>
                );
            case 'voice':
                return (
                    <>
                        {renderMediaButton("video", () => setActiveMediaPlayer('camera'))}
                        {renderMediaButton("microphone", switchToVoiceMode, true)}
                        {renderMediaButton("message-text", switchToTextMode)}
                    </>
                );
            default:
                return (
                    <>
                        {renderMediaButton("message-text", switchToTextMode)}
                        {renderCaptureButton()}
                        {renderMediaButton("microphone", switchToVoiceMode)}
                    </>
                );
        }
    };

    return (
        <View style={styles.mediaPlayerArea}>
            {renderActiveMediaControls()}
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
    },
    circularProgress: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 35,
        borderWidth: 5,
        borderColor: '#fff',
        borderTopColor: '#ff4444',
    }
});
