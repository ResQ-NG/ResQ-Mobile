import { View } from 'react-native';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarCameraBoldIcon from '@/components/icons/solar/camera-bold';

export function EvidencePlaceholder({ size }: { size: number }) {
  const { theme } = useAppColorScheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: theme.textMuted + '40',
        backgroundColor: theme.textMuted + '08',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SolarCameraBoldIcon width={20} height={20} color={theme.textMuted + '99'} />
    </View>
  );
}

export default function _EvidencePlaceholderRoute() {
  return null;
}
