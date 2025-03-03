import { StyleSheet, View } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { CameraView } from 'expo-camera'

import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler'
import { router } from 'expo-router'
import CameraMainComponent from '@/components/ui/live/CameraMainComponent';
import { MediaControlArea } from '@/components/ui/live/MediaControlArea';
import AudioRecordMainComponent from '@/components/ui/live/AudioRecordMainComponent';
import TextMainComponent from '@/components/ui/live/TextMainComponent';
import { VideoView } from 'expo-video'

type MediaPlayerType = 'text' | 'voice' | 'camera' | null;
type CameraModeType = 'photo' | 'video';

interface MediaContent {
    type: MediaPlayerType;
    url?: string;
    text?: string;
    timestamp: number;
}

export default function CameraScreen() {
    const cameraRef = useRef<CameraView>(null);
    const videoRef = useRef<VideoView>(null)

    // Media player states
    const [activeMediaPlayer, setActiveMediaPlayer] = useState<MediaPlayerType>('camera');
    const [mediaContents, setMediaContents] = useState<MediaContent[]>([]);

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

    const swipeGesture = Gesture.Pan()
        .onEnd((event) => {
            if (event.velocityY < -500) {
                router.push({
                    pathname: "/preview-media",
                    params: {
                        mediaContents: JSON.stringify(mediaContents)
                    }
                });
            }
        });

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
        <GestureHandlerRootView>
        <GestureDetector gesture={swipeGesture}>
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
        </GestureDetector>
        </GestureHandlerRootView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
});
