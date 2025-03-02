'use client';

import { useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { ResizeMode, Video } from 'expo-av';

interface PreviewMediaProps {
  image?: string;
  video?: string;
  text?: string;
  onPublish?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
}

export default function PreviewMedia({
  image,
  video,
  text,
  onPublish,
  onShare,
  onDownload
}: PreviewMediaProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = () => {
    if (onDownload) onDownload();
    // Add download logic here
  };

  const handleShare = () => {
    if (onShare) onShare();
    // Add share logic here
  };

  const handlePublish = () => {
    if (onPublish) onPublish();
    // Add publish logic here
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsOpen(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Preview Content</Text>

          <ScrollView style={styles.contentContainer}>
            {image && (
              <Image
                source={{ uri: image }}
                style={styles.image}
                resizeMode="contain"
              />
            )}

            {video && (
              <Video
                source={{ uri: video }}
                style={styles.video}
                useNativeControls
                resizeMode={"cover" as ResizeMode}
              />
            )}

            {text && (
              <Text style={styles.text}>{text}</Text>
            )}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.outlineButton]}
              onPress={handleDownload}
            >
              <Text style={styles.buttonText}>Download</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.outlineButton]}
              onPress={handleShare}
            >
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handlePublish}
            >
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                Publish Report
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  contentContainer: {
    flexGrow: 0,
    maxHeight: 400,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 15,
  },
  video: {
    width: '100%',
    height: 300,
    marginBottom: 15,
  },
  text: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
  },
  primaryButtonText: {
    color: 'white',
  },
});
