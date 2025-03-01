import { StyleSheet, View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface IAudioRecordMainComponentProps {
    controlArea?: React.JSX.Element;
}

export default function AudioRecordMainComponent({ controlArea }: IAudioRecordMainComponentProps) {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [duration, setDuration] = useState(0);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRecording) {
            interval = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRecording]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const renderWaveform = () => {
        // Simple static waveform for demonstration
        // In a real app, you'd want to analyze audio levels
        return (
            <View style={styles.waveformContainer}>
                {Array.from({ length: 30 }).map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.waveformBar,
                            {
                                height: Math.random() * 50 + 10,
                                opacity: isRecording ? 1 : 0.5
                            }
                        ]}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.recordingContainer}>
                <MaterialCommunityIcons
                    name="microphone"
                    size={32}
                    color={isRecording ? "#ff4444" : "#ffffff"}
                />
                <Text style={styles.durationText}>
                    {formatDuration(duration)}
                </Text>
            </View>

            {renderWaveform()}

            {controlArea}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
    },
    recordingContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    durationText: {
        color: '#ffffff',
        fontSize: 48,
        fontWeight: 'bold',
        marginTop: 20,
    },
    waveformContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        gap: 3,
    },
    waveformBar: {
        width: 3,
        backgroundColor: '#ffffff',
        borderRadius: 2,
    },
});
