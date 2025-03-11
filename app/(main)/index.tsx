import { StyleSheet, View } from 'react-native';
import React, { useState, useEffect, useRef } from 'react'
import { CameraView } from 'expo-camera'
import CameraMainComponent from '@/components/ui/live/CameraMainComponent';
import { MediaControlArea } from '@/components/ui/live/MediaControlArea';
import AudioRecordMainComponent from '@/components/ui/live/AudioRecordMainComponent';
import TextMainComponent from '@/components/ui/live/TextMainComponent';
import { useMedia } from '@/components/MediaContext';


type MediaPlayerType = 'text' | 'voice' | 'camera' | null;
type CameraModeType = 'photo' | 'video';



export default function CameraScreen() {
    const cameraRef = useRef<CameraView>(null);
    const [activeMediaPlayer, setActiveMediaPlayer] = useState<MediaPlayerType>('camera');
    const { mediaContents, setMediaContents } = useMedia();

    // Camera states
    const [cameraMode, setCameraMode] = useState<CameraModeType>('photo');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);

    //typing states

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

        // Media content props
        mediaContents={mediaContents}
        setMediaContents={setMediaContents}

        // Camera props
        cameraMode={cameraMode}
        setCameraMode={setCameraMode}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        cameraRef={cameraRef}
    />;

    return (
            <View style={styles.container}>
                {activeMediaPlayer === 'camera' && (
                    <CameraMainComponent
                        cameraRef={cameraRef}
                        controlArea={mediaControlArea}
                        cameraMode={cameraMode}
                        setCameraMode={setCameraMode}
                        isRecording={isRecording}
                        recordingDuration={recordingDuration}
                    />
                )}
                {activeMediaPlayer === 'voice' && (
                    <AudioRecordMainComponent
                        controlArea={mediaControlArea}
                    />
                )}
                {activeMediaPlayer === 'text' && (
                    <TextMainComponent
                        controlArea={mediaControlArea}
                    />
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
