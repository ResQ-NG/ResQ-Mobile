import { View } from 'react-native';
import { router } from 'expo-router';
import { ExpandedMapView } from '@/components/maps/ExpandedMapView';
import { WatchMeOverlay } from '@/components/watchme/WatchMeOverlay';

export default function WatchMeScreen() {
  return (
    <View className="flex-1">
      <ExpandedMapView />
      <WatchMeOverlay onWatchPress={() => router.push('/(modals)/watch-me-onboarding')} />
    </View>
  );
}
