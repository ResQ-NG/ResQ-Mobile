import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { ThemedText } from '@/components/ThemedText'
import { CameraView, CameraType } from 'expo-camera';
import { useCheckPermission } from '@/hooks/useCheckPermission';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView, TapGestureHandler, State, GestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function CameraScreen() {
    const [facing, setFacing] = useState<CameraType>('back');
    const { cameraPermission } = useCheckPermission()
    const router = useRouter()
    const iconColor = useThemeColor({}, 'text')
    const doubleTapRef = useRef(null);

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    useEffect(() => {
        const checkPermission = async () => {
            if (cameraPermission === false) {
                router.push("/permission");
            }
        };

        checkPermission();
    }, [cameraPermission, router]);

    const handleSingleTap = ({ nativeEvent }: GestureHandlerStateChangeEvent) => {
        if (nativeEvent?.state === State.ACTIVE) {
            // Handle single tap if needed
        }
    };

    const handleDoubleTap = ({ nativeEvent }: GestureHandlerStateChangeEvent) => {
        if (nativeEvent?.state === State.ACTIVE) {
            toggleCameraFacing();
        }
    };

  return (
    <View style={styles.container}>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <TapGestureHandler
                onHandlerStateChange={handleSingleTap}
                waitFor={doubleTapRef}>
                <TapGestureHandler
                    onHandlerStateChange={handleDoubleTap}
                    numberOfTaps={2}
                    ref={doubleTapRef}>
                    <CameraView style={styles.camera} facing={facing}>
                        <View style={styles.controlsContainer}>
                            <TouchableOpacity
                                style={styles.controlButton}
                                onPress={toggleCameraFacing}
                            >
                                <Ionicons
                                    name="camera-reverse"
                                    size={28}
                                    color="white"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.captureButton}>
                                <View style={styles.captureButtonInner} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.controlButton}>
                                <Ionicons
                                    name="settings-outline"
                                    size={28}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                    </CameraView>
                </TapGestureHandler>
            </TapGestureHandler>
        </GestureHandlerRootView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  },
});
