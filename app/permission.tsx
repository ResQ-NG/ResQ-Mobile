import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useCheckPermission } from '@/hooks/useCheckPermission';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function PermissionScreen() {
  const {
    cameraPermission,
    microphonePermission,
    galleryPermission,
    allPermissionsGranted,
    requestPermissions,
    checkPermissions
  } = useCheckPermission();
  const backgroundTheme = useThemeColor({}, 'background');
  const textTheme = useThemeColor({}, "text")

  const handleCameraPermissionClick = async () => {
    try {
      const response = await Camera.requestCameraPermissionsAsync();
      if (response?.status === 'granted') {
        await checkPermissions();
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  }

  const handleMicrophonePermissionClick = async () => {
    try {
      const response = await Camera.requestMicrophonePermissionsAsync();
      if (response?.status === 'granted') {
        await checkPermissions();
      }
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
    }
  }

  const handleGalleryPermissionClick = async () => {
    try {
      const response = await MediaLibrary.requestPermissionsAsync();
      if (response?.status === 'granted') {
        await checkPermissions();
      }
    } catch (error) {
      console.error('Error requesting gallery permission:', error);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ThemedView style={styles.contentContainer}>
          <ThemedText type="title" style={styles.title}>
            Enable Permissions
          </ThemedText>

          <ThemedText style={styles.description}>
            To provide you with the best emergency response experience, ResQ needs access to the following:
          </ThemedText>

          <View style={styles.permissionList}>
            <TouchableOpacity onPress={handleCameraPermissionClick} style={styles.permissionButton}>
              <ThemedView style={styles.permissionItem}>
                <Ionicons name="camera" size={32} style={[styles.icon, {color: textTheme}]} />
                <ThemedView style={styles.permissionTextContainer}>
                  <ThemedText style={styles.permissionTitle}>Camera</ThemedText>
                  <ThemedText style={styles.permissionDescription}>
                    To capture photos and videos during emergencies
                  </ThemedText>
                </ThemedView>
                {cameraPermission && (
                  <Ionicons name="checkmark-circle" size={24} style={[styles.checkIcon, {color: textTheme}]} />
                )}
              </ThemedView>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleMicrophonePermissionClick} style={styles.permissionButton}>
              <ThemedView style={styles.permissionItem}>
                <Ionicons name="mic" size={32} style={[styles.icon, {color: textTheme}]} />
                <ThemedView style={styles.permissionTextContainer}>
                  <ThemedText style={styles.permissionTitle}>Microphone</ThemedText>
                  <ThemedText style={styles.permissionDescription}>
                    To record audio and enable voice communication
                  </ThemedText>
                </ThemedView>
                {microphonePermission && (
                  <Ionicons name="checkmark-circle" size={24} style={[styles.checkIcon, {color: textTheme}]} />
                )}
              </ThemedView>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleGalleryPermissionClick} style={[styles.permissionButton,]}>
              <ThemedView style={styles.permissionItem}>
                <Ionicons name="image" size={32} style={[styles.icon, {color: textTheme}]} />
                <ThemedView style={styles.permissionTextContainer}>
                  <ThemedText style={styles.permissionTitle}>Photo Gallery</ThemedText>
                  <ThemedText style={styles.permissionDescription}>
                    To access and save important media files
                  </ThemedText>
                </ThemedView>
                {galleryPermission && (
                  <Ionicons name="checkmark-circle" size={24} style={[styles.checkIcon, {color: textTheme}]} />
                )}
              </ThemedView>
            </TouchableOpacity>
          </View>
        </ThemedView>

        <View style={[styles.buttonContainer, {backgroundColor: backgroundTheme}]}>
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
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  permissionList: {
    width: '100%',
    gap: 16,
  },
  permissionButton: {
    width: '100%',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
  },
  icon: {
    marginRight: 20,
    opacity: 0.9,
  },
  checkIcon: {
    marginLeft: 12,
    opacity: 0.9,
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginBottom: 6,
  },
  permissionDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 24,
    paddingBottom: 32,

  },
  button: {
    height: 56,
    borderRadius: 16,
  },
});
