import { SafeAreaView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/Button';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PermissionScreen() {
  const [cameraPermission, setCameraPermission] = useState<null | boolean>(null);
  const [microphonePermission, setMicrophonePermission] = useState<null | boolean>(null);
  const [galleryPermission, setGalleryPermission] = useState<null | boolean>(null);

  const requestPermissions = async () => {
    // Request camera and microphone permissions
    const cameraResponse = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(cameraResponse?.granted ?? false);

    const microphoneResponse = await Camera.requestMicrophonePermissionsAsync();
    setMicrophonePermission(microphoneResponse?.granted ?? false);

    // Request media library permissions
    const galleryResponse = await MediaLibrary.requestPermissionsAsync();
    setGalleryPermission(galleryResponse?.granted ?? false);
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const allPermissionsGranted = cameraPermission && microphonePermission && galleryPermission;

  return (
    <SafeAreaView style={styles.container}>
    <ThemedView style={styles.container}>
      <ThemedView style={styles.contentContainer}>
        <ThemedText type="title" style={styles.title}>
          Enable Permissions
        </ThemedText>

        <ThemedText style={styles.description}>
          To provide you with the best emergency response experience, ResQ needs access to the following:
        </ThemedText>

        <ThemedView style={styles.permissionList}>
          <ThemedView style={styles.permissionItem}>
            <MaterialIcons name="camera-alt" size={32} style={styles.icon} />
            <ThemedView style={styles.permissionTextContainer}>
              <ThemedText style={styles.permissionTitle}>Camera</ThemedText>
              <ThemedText style={styles.permissionDescription}>
                To capture photos and videos during emergencies
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.permissionItem}>
            <MaterialCommunityIcons name="microphone" size={32} style={styles.icon} />
            <ThemedView style={styles.permissionTextContainer}>
              <ThemedText style={styles.permissionTitle}>Microphone</ThemedText>
              <ThemedText style={styles.permissionDescription}>
                To record audio and enable voice communication
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.permissionItem}>
            <Ionicons name="images" size={32} style={styles.icon} />
            <ThemedView style={styles.permissionTextContainer}>
              <ThemedText style={styles.permissionTitle}>Photo Gallery</ThemedText>
              <ThemedText style={styles.permissionDescription}>
                To access and save important media files
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {allPermissionsGranted ? (
          <Link href="/(main)" asChild>
            <Button
              title="Continue to App"
              style={styles.button}
            />
          </Link>
        ) : (
          <Button
            onPress={requestPermissions}
            title="Enable All Permissions"
            style={styles.button}
          />
        )}
      </ThemedView>
    </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '30%',
    marginTop: 40,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.8,
    lineHeight: 24,
  },
  permissionList: {
    width: '100%',
    marginBottom: 32,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  icon: {
    marginRight: 16,
    color: '#000',
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  button: {
    height: 56,
    borderRadius: 12,
  },
});
