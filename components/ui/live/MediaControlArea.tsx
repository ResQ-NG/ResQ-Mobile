import { MaterialCommunityIcons } from "@expo/vector-icons"
import React, { useState, useEffect } from "react";
import { GestureResponderEvent, TouchableOpacity, View, StyleSheet, Animated } from "react-native"

type MediaPlayerType = 'text' | 'voice' | 'camera' | null;
type CameraModeType = 'photo' | 'video';

interface IMediaControlAreaProps {
    activeMediaPlayer: MediaPlayerType;
    setActiveMediaPlayer: (type: MediaPlayerType) => void;
    cameraMode: CameraModeType;
    setCameraMode: (mode: CameraModeType) => void;
}

export const MediaControlArea = ({
    activeMediaPlayer,
    setActiveMediaPlayer,
    cameraMode,
    setCameraMode
}: IMediaControlAreaProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const recordingProgress = new Animated.Value(0);

    useEffect(() => {
        if (isRecording) {
            Animated.timing(recordingProgress, {
                toValue: 1,
                duration: 30000, // 30 seconds recording limit
                useNativeDriver: false
            }).start();
        } else {
            recordingProgress.setValue(0);
        }
    }, [isRecording]);

    function handleTextMessage(event: GestureResponderEvent): void {
        setActiveMediaPlayer('text');
    }

    function toggleAudioRecording(event: GestureResponderEvent): void {
        setActiveMediaPlayer('voice');
    }

    const renderMediaControls = () => {
        switch(activeMediaPlayer) {
            case 'text':
                return (
                    <>
                        <TouchableOpacity style={styles.controlButton} onPress={toggleAudioRecording}>
                            <MaterialCommunityIcons name="microphone" size={24} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.controlButton, styles.activeButton]}>
                            <View style={styles.activeIconWrapper}>
                                <MaterialCommunityIcons name="message-text" size={26} color="white" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.controlButton}
                            onPress={() => setActiveMediaPlayer('camera')}
                        >
                            <MaterialCommunityIcons name="video" size={24} color="white" />
                        </TouchableOpacity>
                    </>
                );
            case 'voice':
                return (
                    <>
                        <TouchableOpacity
                            style={styles.controlButton}
                            onPress={() => setActiveMediaPlayer('camera')}
                        >
                            <MaterialCommunityIcons name="video" size={24} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.controlButton, styles.activeButton]}>
                            <View style={styles.activeIconWrapper}>
                                <MaterialCommunityIcons name="microphone" size={26} color="white" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.controlButton} onPress={handleTextMessage}>
                            <MaterialCommunityIcons name="message-text" size={24} color="white" />
                        </TouchableOpacity>
                    </>
                );
            default:
                return (
                    <>
                        <TouchableOpacity style={styles.controlButton} onPress={handleTextMessage}>
                            <MaterialCommunityIcons name="message-text" size={24} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.captureButton, styles.activeButton]}
                            onPressIn={() => {
                                setCameraMode('video');
                                setIsRecording(true);
                            }}
                            onPressOut={() => {
                                setCameraMode('photo');
                                setIsRecording(false);
                            }}
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

                        <TouchableOpacity style={styles.controlButton} onPress={toggleAudioRecording}>
                            <MaterialCommunityIcons name="microphone" size={24} color="white" />
                        </TouchableOpacity>
                    </>
                );
        }
    };

    return (
        <View style={styles.mediaPlayerArea}>
            {renderMediaControls()}
        </View>
    );
}

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
