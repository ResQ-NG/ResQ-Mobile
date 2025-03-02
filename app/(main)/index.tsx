import { StyleSheet, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import CameraMainComponent from '@/components/ui/live/CameraMainComponent';
import { MediaControlArea } from '@/components/ui/live/MediaControlArea';
import AudioRecordMainComponent from '@/components/ui/live/AudioRecordMainComponent';
import TextMainComponent from '@/components/ui/live/TextMainComponent';

type MediaPlayerType = 'text' | 'voice' | 'camera' | null;
type CameraModeType = 'photo' | 'video';

export default function CameraScreen() {
    // Media player states
    const [activeMediaPlayer, setActiveMediaPlayer] = useState<MediaPlayerType>('camera');

    // Camera states
    const [cameraMode, setCameraMode] = useState<CameraModeType>('photo');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
            if (!isRecording) {
                setRecordingDuration(0);
            }
        };
    }, [isRecording]);

    const mediaControlArea = <MediaControlArea
        // Media player props
        activeMediaPlayer={activeMediaPlayer}
        setActiveMediaPlayer={setActiveMediaPlayer}

        // Camera props
        cameraMode={cameraMode}
        setCameraMode={setCameraMode}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
    />;

    return (
        <View style={styles.container}>
            {activeMediaPlayer === 'camera' && (
                <CameraMainComponent
                    controlArea={mediaControlArea}
                    cameraMode={cameraMode}
                    setCameraMode={setCameraMode}
                    isRecording={isRecording}
                    recordingDuration={recordingDuration}
                />
            )}
            {activeMediaPlayer === 'voice' && (
                <AudioRecordMainComponent controlArea={mediaControlArea} />
            )}
            {activeMediaPlayer === 'text' && (
                <TextMainComponent controlArea={mediaControlArea} />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
});
