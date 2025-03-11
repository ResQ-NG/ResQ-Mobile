import { View, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform, ActivityIndicator, StatusBar } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { MediaContent } from '@/constants/Types';
import PagerView from 'react-native-pager-view';
import { useState, useRef, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import React from 'react';
import { useMedia } from '@/components/MediaContext';

// Constants
const VIDEO_EXTENSIONS = ['.mov', '.mp4', '.avi', '.mkv', '.webm', '.m4v'];
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


interface PreviewMediaProps {
  onPublish?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  previousImage?: string;
}


const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={Colors.brandConstants.primaryWhite} />
  </View>
);

const SwipeIndicator = ({ index, total }: { index: number, total: number }) => (
  <View style={styles.swipeIndicatorContainer}>
    <MaterialCommunityIcons
      name="gesture-swipe-horizontal"
      size={24}
      color={Colors.brandConstants.primaryWhite}
    />
    <ThemedText style={styles.swipeText}>
      {`${index + 1} of ${total}`}
    </ThemedText>
  </View>
);

const MediaControls = ({
  onRemove,
  onDownload,
  onShare,
  timestamp
}: {
  onRemove: (timestamp: number) => void,
  onDownload: () => void,
  onShare: () => void,
  timestamp: number
}) => (
  <View style={styles.mediaControls}>
    <TouchableOpacity
      style={styles.removeButton}
      onPress={() => onRemove(timestamp)}
    >
      <MaterialCommunityIcons name="trash-can-outline" size={18} color={Colors.brandConstants.primaryWhite} />
      <ThemedText style={styles.removeButtonText}>Remove</ThemedText>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.removeButton, { backgroundColor: 'rgba(0,0,0,0.85)' }]}
      onPress={onDownload}
    >
      <MaterialCommunityIcons name="download" size={18} color={Colors.brandConstants.primaryWhite} />
      <ThemedText style={styles.removeButtonText}>Download</ThemedText>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.removeButton, { backgroundColor: 'rgba(0,0,0,0.85)' }]}
      onPress={onShare}
    >
      <MaterialCommunityIcons name="share-variant" size={18} color={Colors.brandConstants.primaryWhite} />
      <ThemedText style={styles.removeButtonText}>Share</ThemedText>
    </TouchableOpacity>
  </View>
);

export default function PreviewMedia({
  onPublish,
  onShare,
  onDownload,
  previousImage
}: PreviewMediaProps) {
  // Hooks
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const pagerRef = useRef<PagerView>(null);
  const { mediaContents, setMediaContents } = useMedia();


  const mediaItems = [
    ...(previousImage ? [{
      type: 'previous' as const,
      url: previousImage,
      timestamp: Date.now()
    }] : []),
    ...(mediaContents?.filter(content => content?.type === 'camera' && content?.url) || [])
  ];


  useEffect(() => {
    StatusBar.setHidden(true);
    return () => StatusBar.setHidden(false);
  }, []);


  const isVideo = (url: string) => {
    if (!url) return false;
    return VIDEO_EXTENSIONS.some(ext => url.toLowerCase().endsWith(ext));
  };

  const handleRemoveMedia = (timestamp: number) => {
    if (!mediaContents) return;

    const updatedMediaContents = mediaContents.filter(content =>
      content && content.timestamp !== timestamp
    );

    // Update context
    setMediaContents(updatedMediaContents);
  };

  const handleAction = async (action: (() => void) | undefined) => {
    if (!action) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      action();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => router.back();

  // Render functions
  const renderPaginationDots = () => {
    if (!mediaItems || mediaItems.length <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        {mediaItems.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentPage === index && styles.paginationDotActive
            ]}
          />
        ))}
      </View>
    );
  };

  const renderMediaItem = (item: MediaContent, index: number) => {
    if (!item?.url) return null;

    const commonProps = {
      onLoadStart: () => setLoading(true),
      onLoadEnd: () => setLoading(false),
      style: styles.carouselImage,
      resizeMode: "contain" as const
    };

    let mediaComponent;
    if (item.type === 'previous' || !isVideo(item.url)) {
      mediaComponent = (
        <Image
          source={{ uri: item.url }}
          {...commonProps}
          onError={(e) => console.warn('Image loading error:', e.nativeEvent.error)}
        />
      );
    } else {
      mediaComponent = (
        <Video
          source={{ uri: item.url }}
          style={styles.carouselVideo}
          useNativeControls
          resizeMode={"contain" as ResizeMode}
          shouldPlay={currentPage === index}
          isLooping={true}
          onError={(error) => {
            console.warn('Video loading error:', error);
            setLoading(false);
          }}
        />
      );
    }

    return (
      <View key={item.timestamp} style={styles.carouselItem}>
        <View style={styles.mediaHeader}>
          <View style={styles.mediaLabelContainer}>
            <Ionicons
              name={item.type === 'previous' ? 'images-outline' : isVideo(item.url) ? 'videocam' : 'camera'}
              size={18}
              color={Colors.brandConstants.primaryWhite}
            />
            <ThemedText style={styles.mediaLabel}>
              {item.type === 'previous' ? 'Previous Report Image' : isVideo(item.url) ? 'Video Evidence' : 'Photo Evidence'}
            </ThemedText>
          </View>
        </View>

        <View style={styles.mediaWrapper}>
          {mediaComponent}
          {loading && <LoadingIndicator />}
          <SwipeIndicator index={index} total={mediaItems.length} />
          <MediaControls
            onRemove={handleRemoveMedia}
            onDownload={() => handleAction(onDownload)}
            onShare={() => handleAction(onShare)}
            timestamp={item.timestamp}
          />
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.modalContainer}>
      {/* Header */}
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={22} color={Colors.brandConstants.primaryWhite} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.contentContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {mediaItems && mediaItems.length > 0 ? (
          <View style={styles.carouselContainer}>
            <PagerView
              ref={pagerRef}
              style={styles.pagerView}
              initialPage={0}
              pageMargin={10}
              onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
              {mediaItems.map((item, index) => renderMediaItem(item, index))}
            </PagerView>
            {renderPaginationDots()}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <BlurView intensity={20} style={styles.emptyStateBlur}>
              <MaterialCommunityIcons name="camera-plus" size={64} color={Colors.brandConstants.primaryWhite} />
              <ThemedText style={styles.emptyStateText}>No evidence added yet</ThemedText>
              <ThemedText style={styles.emptyStateSubText}>Close this modal to take photos or videos</ThemedText>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={handleClose}
              >
                <Ionicons name="camera" size={20} color={Colors.brandConstants.primaryWhite} />
                <ThemedText style={styles.emptyStateButtonText}>Add Media</ThemedText>
              </TouchableOpacity>
            </BlurView>
          </View>
        )}

        {/* Text Content */}
        {mediaContents?.map((content) => {
          if (content && content.type === 'text' && content.text) {
            return (
              <View key={content.timestamp} style={styles.textContainer}>
                <View style={styles.textHeaderContainer}>
                  <Ionicons name="document-text" size={18} color={Colors.brandConstants.primaryWhite} />
                  <ThemedText style={styles.textLabel}>Description</ThemedText>
                </View>
                <ThemedText style={styles.text}>{content.text}</ThemedText>
              </View>
            );
          }
          return null;
        })}
      </ScrollView>

      {/* Bottom Buttons */}
      {mediaItems && mediaItems.length > 0 && (
        <BlurView intensity={30} style={styles.buttonContainer}>
          <View style={styles.mainButtonsRow}>
            <TouchableOpacity
              style={[styles.publishButton, (!mediaItems || mediaItems.length === 0) && styles.disabledButton]}
              onPress={() => handleAction(onPublish)}
              activeOpacity={0.7}
              disabled={!mediaItems || mediaItems.length === 0 || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.brandConstants.primaryWhite} />
              ) : (
                <>
                  <MaterialCommunityIcons name="send" size={20} color={Colors.brandConstants.primaryWhite} style={styles.buttonIcon} />
                  <ThemedText style={styles.publishButtonText}>Submit Report</ThemedText>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addMoreButton}
              onPress={handleClose}
              activeOpacity={0.7}
              disabled={loading}
            >
              <MaterialCommunityIcons name="plus-circle" size={20} color={Colors.brandConstants.primaryBlack} style={styles.buttonIcon} />
              <ThemedText style={styles.addMoreButtonText}>Add More</ThemedText>
            </TouchableOpacity>
          </View>
        </BlurView>
      )}

      {/* Global Loading */}
      {loading && (
        <View style={styles.globalLoadingContainer}>
          <BlurView intensity={50} style={styles.loadingBlur}>
            <ActivityIndicator size="large" color={Colors.brandConstants.primaryWhite} />
            <ThemedText style={styles.loadingText}>Processing...</ThemedText>
          </BlurView>
        </View>
      )}
    </ThemedView>
  );
}

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
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 10,
    height: screenHeight * 0.75,
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 10,
    marginTop: 10,
  },
  pagerView: {
    width: screenWidth,
    height: '100%',
  },
  carouselItem: {
    width: screenWidth,
    alignItems: 'center',
    height: '100%',
  },
  mediaWrapper: {
    position: 'relative',
    width: screenWidth - 40,
    height: '90%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  carouselVideo: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  mediaHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  mediaLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  mediaControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'column',
    gap: 8,
  },
  removeButton: {
    backgroundColor: Colors.brandConstants.primaryRed,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  removeButtonText: {
    color: Colors.brandConstants.primaryWhite,
    fontSize: 13,
    fontWeight: '600',
  },
  mediaLabel: {
    fontSize: 14,
    color: Colors.brandConstants.primaryWhite,
    fontWeight: '600',
  },
  swipeIndicatorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    alignSelf: 'center',
    width: "auto",
    paddingHorizontal: 18,
    borderWidth: 0.4,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  swipeText: {
    color: Colors.brandConstants.primaryWhite,
    fontSize: 14,
    fontWeight: '500',
  },
  textContainer: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.brandConstants.primaryRed,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  textHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 10,
    borderRadius: 10,
    width: 'auto',
    alignSelf: 'flex-start',
  },
  textLabel: {
    fontSize: 16,
    color: Colors.brandConstants.primaryWhite,
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
    paddingTop: Platform.OS === 'ios' ?  10 : 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.brandConstants.primaryWhite,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 24,
    left: 15,
    right: 15,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    overflow: "hidden",
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
  },
  mainButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  buttonIcon: {
    marginRight: 6,
  },
  addMoreButton: {
    flex: 0.4,
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.brandConstants.primaryDullGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  addMoreButtonText: {
    color: Colors.brandConstants.primaryBlack,
    fontSize: 15,
    fontWeight: '600',
  },
  publishButton: {
    flex: 0.6,
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.brandConstants.primaryRed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  publishButtonText: {
    color: Colors.brandConstants.primaryWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    height: screenHeight * 0.7,
  },
  emptyStateBlur: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 35,
    borderRadius: 25,
    width: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  emptyStateText: {
    fontSize: 22,
    color: Colors.brandConstants.primaryWhite,
    marginTop: 20,
    fontWeight: '600',
  },
  emptyStateSubText: {
    fontSize: 15,
    color: Colors.brandConstants.primaryWhite,
    marginTop: 10,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  emptyStateButton: {
    backgroundColor: Colors.brandConstants.primaryRed,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  emptyStateButtonText: {
    color: Colors.brandConstants.primaryWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
  },
  globalLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingBlur: {
    padding: 35,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  loadingText: {
    color: Colors.brandConstants.primaryWhite,
    marginTop: 15,
    fontSize: 17,
    fontWeight: '500',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    gap: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  paginationDotActive: {
    backgroundColor: Colors.brandConstants.primaryWhite,
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
});
