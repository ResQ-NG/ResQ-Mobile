import { View } from 'react-native';
import { WatchMeOverlay } from '@/components/watchme/WatchMeOverlay';

export default function WatchMeScreen() {
  return (
    <View className="flex-1 bg-[#dbeafe] dark:bg-black">
      {/* Map placeholder — actual map view will replace this */}

      <WatchMeOverlay />
    </View>
  );
}
