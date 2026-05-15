import { Image, Modal, StatusBar, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import type { MockMediaItem } from '@/lib/mock/watchMeRouteSafetyMock';

type MediaFullscreenModalProps = {
  visible: boolean;
  item: MockMediaItem | null;
  onClose: () => void;
};

function kindLabel(kind: MockMediaItem['kind']) {
  if (kind === 'video') return 'Video';
  if (kind === 'report') return 'Report';
  return 'Photo';
}

export function MediaFullscreenModal({ visible, item, onClose }: MediaFullscreenModalProps) {
  const insets = useSafeAreaInsets();

  if (!item) return null;

  const isVideo = item.kind === 'video';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <View
          style={{
            paddingTop: insets.top + 8,
            paddingHorizontal: 16,
            paddingBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
          <View className="flex-1 min-w-0">
            <AppText className="text-white/50 text-[10px] font-metropolis-semibold uppercase tracking-wide">
              {kindLabel(item.kind)}
            </AppText>
            <AppText className="text-white font-metropolis-bold text-base" numberOfLines={2}>
              {item.title}
            </AppText>
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Image
            source={{ uri: item.thumbnailUri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              paddingTop: 48,
              paddingBottom: insets.bottom + 24,
              paddingHorizontal: 20,
            }}
          >
            {isVideo ? (
              <View className="items-center mb-4">
                <View
                  className="w-16 h-16 rounded-full items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
                >
                  <Ionicons name="play" size={28} color="#0f172a" style={{ marginLeft: 3 }} />
                </View>
                {item.durationLabel ? (
                  <AppText className="text-white/70 text-xs font-metropolis-medium mt-2">
                    {item.durationLabel}
                  </AppText>
                ) : null}
              </View>
            ) : null}
            <AppText className="text-white font-metropolis-semibold text-lg mb-1">
              {item.title}
            </AppText>
            <AppText className="text-white/65 text-sm font-metropolis-regular mb-2">
              {item.subtitle}
            </AppText>
            {item.authorLabel ? (
              <AppText className="text-white/45 text-xs font-metropolis-regular">
                {item.authorLabel}
              </AppText>
            ) : null}
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}
