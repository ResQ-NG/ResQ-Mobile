import { View } from 'react-native';
import { CameraOverlay } from '@/components/evidence/CameraOverlay';

export default function MainScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      {/* Camera feed will live here */}
      <CameraOverlay
        location="MARYLAND, LAGOS."
        time="9:01:12 PM"
      />
    </View>
  );
}
