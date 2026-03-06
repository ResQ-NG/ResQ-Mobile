import { View } from 'react-native';
import { ExpandedMapView } from '@/components/maps/ExpandedMapView';
import { WatchMeOverlay } from '@/components/watchme/WatchMeOverlay';

export default function WatchMeScreen() {
  return (
    <View className="flex-1">
      <ExpandedMapView />
      <WatchMeOverlay />
    </View>
  );
}
