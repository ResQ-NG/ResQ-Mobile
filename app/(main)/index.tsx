import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import CameraMainComponent from '@/components/ui/live/CameraMainComponent';
import { MediaControlArea } from '@/components/ui/live/MediaControlArea';
import AudioRecordMainComponent from '@/components/ui/live/AudioRecordMainComponent';
import TextMainComponent from '@/components/ui/live/TextMainComponent';

type MediaPlayerType = 'text' | 'voice' | 'camera' | null;
type CameraModeType = 'photo' | 'video';

export default function CameraScreen() {
    const [activeMediaPlayer, setActiveMediaPlayer] = useState<MediaPlayerType>('camera');
    const [cameraMode, setCameraMode] = useState<CameraModeType>('photo');

    const mediaControlArea = <MediaControlArea
        activeMediaPlayer={activeMediaPlayer}
        setActiveMediaPlayer={setActiveMediaPlayer}
        cameraMode={cameraMode}
        setCameraMode={setCameraMode}
    />;

    return (
        <View style={styles.container}>
            {activeMediaPlayer === 'camera' && (
                <CameraMainComponent
                    controlArea={mediaControlArea}
                    cameraMode={cameraMode}
                    setCameraMode={setCameraMode}
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
