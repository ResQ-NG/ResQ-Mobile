import { MaterialCommunityIcons } from "@expo/vector-icons"
import React from "react";
import { GestureResponderEvent, TouchableOpacity, View, StyleSheet } from "react-native"

type MediaPlayerType = 'text' | 'voice' | 'camera' | null;

interface IMediaControlAreaProps {
    activeMediaPlayer: MediaPlayerType;
    setActiveMediaPlayer: (type: MediaPlayerType) => void;
}

export const MediaControlArea = ({
    activeMediaPlayer,
    setActiveMediaPlayer
}: IMediaControlAreaProps) => {
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

                        <TouchableOpacity style={[styles.captureButton, styles.activeButton]}>
                            <View style={styles.captureButtonInner} />
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
    }
});
