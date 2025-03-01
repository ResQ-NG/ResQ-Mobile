import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import CameraMainComponent from '@/components/ui/live/CameraMainComponent';
import { MediaControlArea } from '@/components/ui/live/MediaControlArea';
import AudioRecordMainComponent from '@/components/ui/live/AudioRecordMainComponent';
import TextMainComponent from '@/components/ui/live/TextMainComponent';

type MediaPlayerType = 'text' | 'voice' | 'camera' | null;

export default function CameraScreen() {
    const [activeMediaPlayer, setActiveMediaPlayer] = useState<MediaPlayerType>('camera');

    const mediaControlArea = <MediaControlArea
        activeMediaPlayer={activeMediaPlayer}
        setActiveMediaPlayer={setActiveMediaPlayer}
    />;

    return (
        <View style={styles.container}>
            {activeMediaPlayer === 'camera' && (
                <CameraMainComponent controlArea={mediaControlArea} />
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
