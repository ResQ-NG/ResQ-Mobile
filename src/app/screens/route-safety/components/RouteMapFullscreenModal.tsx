import { Modal, StatusBar, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import {
  MOCK_JOURNEY_DESTINATION,
  MOCK_JOURNEY_ORIGIN,
  type MockRoute,
} from '@/lib/mock/watchMeRouteSafetyMock';
import { RouteJourneyMap } from './RouteJourneyMap';

type RouteMapFullscreenModalProps = {
  visible: boolean;
  route: MockRoute;
  originLabel: string;
  destinationLabel: string;
  onClose: () => void;
};

export function RouteMapFullscreenModal({
  visible,
  route,
  originLabel,
  destinationLabel,
  onClose,
}: RouteMapFullscreenModalProps) {
  const insets = useSafeAreaInsets();

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
            accessibilityLabel="Close map"
          >
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
          <View className="flex-1 min-w-0">
            <AppText className="text-white font-metropolis-bold text-base" numberOfLines={1}>
              {route.label} · {route.via}
            </AppText>
            <AppText className="text-white/50 text-xs font-metropolis-regular" numberOfLines={1}>
              {originLabel || 'Start'} → {destinationLabel}
            </AppText>
          </View>
        </View>

        <View style={{ flex: 1, paddingBottom: insets.bottom }}>
          <RouteJourneyMap
            route={route}
            origin={MOCK_JOURNEY_ORIGIN}
            destination={MOCK_JOURNEY_DESTINATION}
            interactive
          />
        </View>
      </View>
    </Modal>
  );
}
