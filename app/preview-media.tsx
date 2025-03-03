import { View, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';


interface MediaContent {
  type: 'text' | 'voice' | 'camera' | 'previous' | null;
  url?: string;
  text?: string;
  timestamp: number;
}

interface PreviewMediaProps {
  onPublish?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  previousImage?: string;
}

export default function PreviewMedia({
  onPublish,
  onShare,
  onDownload,
  isOpen = false,
  onClose,
  previousImage
}: PreviewMediaProps) {
  const params = useLocalSearchParams();
  const { mediaContents: mediaContentsParam } = params ?? {};
  const router = useRouter();

  const mediaContents = mediaContentsParam ? JSON.parse(mediaContentsParam as string) as MediaContent[] : [];

  // Combine previous image with media contents
  const mediaItems = [
    ...(previousImage ? [{
      type: 'previous' as const,
      url: previousImage,
      timestamp: Date.now()
    }] : []),
    ...mediaContents.filter(content => content.type === 'camera' && content.url)
  ];

  const renderMediaItem = (item: MediaContent) => {
    if (item.type === 'previous') {
      return (
        <View key={item.timestamp} style={styles.carouselItem}>
          <ThemedText style={styles.mediaLabel}>Previous Report Image</ThemedText>
          <Image
            source={{ uri: item.url }}
            style={styles.carouselImage}
            resizeMode="contain"
            onError={(e) => console.warn('Image loading error:', e.nativeEvent.error)}
          />
        </View>
      );
    }

    if (item.url?.endsWith('.mp4')) {
      return (
        <View key={item.timestamp} style={styles.carouselItem}>
          <ThemedText style={styles.mediaLabel}>Video Evidence</ThemedText>
          <Video
            source={{ uri: item.url }}
            style={styles.carouselVideo}
            useNativeControls
            resizeMode={"contain" as ResizeMode}
            onError={(e) => console.warn('Video loading error:', e)}
          />
        </View>
      );
    }

    return (
      <View key={item.timestamp} style={styles.carouselItem}>
        <ThemedText style={styles.mediaLabel}>Photo Evidence</ThemedText>
        <Image
          source={{ uri: item.url }}
          style={styles.carouselImage}
          resizeMode="cover"
          onError={(e) => console.warn('Image loading error:', e.nativeEvent.error)}
        />
      </View>
    );
  };

  const handleDownload = () => {
    if (onDownload) onDownload();
  };

  const handleShare = () => {
    if (onShare) onShare();
  };

  const handlePublish = () => {
    if (onPublish) onPublish();
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.modalContainer}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={22} color={Colors.brandConstants.primaryWhite} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.contentContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {mediaItems.length > 0 && (
          <View style={styles.carouselContainer}>
            {mediaItems.map(item => renderMediaItem(item))}
          </View>
        )}

        {mediaContents?.map((content, index) => {
          if (content.type === 'text' && content.text) {
            return (
              <View key={content.timestamp} style={styles.textContainer}>
                <ThemedText style={styles.textLabel}>Description</ThemedText>
                <ThemedText style={styles.text}>{content.text}</ThemedText>
              </View>
            );
          }
          return null;
        })}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownload}
            activeOpacity={0.7}
          >
            <View style={styles.actionButtonInner}>
              <MaterialCommunityIcons name="download" size={24} color={Colors.brandConstants.primaryBlack} />
              <ThemedText style={styles.actionButtonText}>Save</ThemedText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <View style={styles.actionButtonInner}>
              <MaterialCommunityIcons name="share" size={24} color={Colors.brandConstants.primaryBlack} />
              <ThemedText style={styles.actionButtonText}>Share</ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.mainButtonsRow}>
          <TouchableOpacity
            style={styles.addMoreButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="plus-circle" size={20} color={Colors.brandConstants.primaryBlack} style={styles.buttonIcon} />
            <ThemedText style={styles.addMoreButtonText}>Add More Evidence</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.publishButton}
            onPress={handlePublish}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="send" size={20} color={Colors.brandConstants.primaryWhite} style={styles.buttonIcon} />
            <ThemedText style={styles.publishButtonText}>Submit Report</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.brandConstants.primaryBlack,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  carouselContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 20,
  },
  carouselItem: {
    width: screenWidth,
    alignItems: 'center',
    marginBottom: 20,
  },
  carouselImage: {
    width: screenWidth - 10,
    height: screenHeight * 0.5,
    borderRadius: 12,
  },
  carouselVideo: {
    width: screenWidth - 10,
    height: screenHeight * 0.5,
    borderRadius: 12,
  },
  mediaLabel: {
    fontSize: 16,
    color: Colors.brandConstants.primaryWhite,
    marginBottom: 12,
    fontWeight: '600',
  },
  textContainer: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.8)',
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 12,
  },
  textLabel: {
    fontSize: 16,
    color: Colors.brandConstants.primaryWhite,
    marginBottom: 8,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.brandConstants.primaryWhite,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 24,
    left: 0,
    right: 0,
    padding: 20,
    gap: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomPadding: {
    height: 200, // Adjust based on button container height
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  mainButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.brandConstants.primaryDullGray,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  actionButtonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: Colors.brandConstants.primaryBlack,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 6,
  },
  addMoreButton: {
    flex: 1,
    paddingHorizontal: 20,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.brandConstants.primaryDullGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  addMoreButtonText: {
    color: Colors.brandConstants.primaryBlack,
    fontSize: 15,
    fontWeight: '600',
  },
  publishButton: {
    flex: 1,
    paddingHorizontal: 20,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.brandConstants.primaryRed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  publishButtonText: {
    color: Colors.brandConstants.primaryWhite,
    fontSize: 15,
    fontWeight: '600',
  },
});
