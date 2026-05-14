import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOfflineModeStore } from '@/stores/offline-mode-store';
import { useTheme, useThemeColors } from '@/context/ThemeContext';
import { AppText } from '@/components/ui/AppText';

/**
 * Compact pill shown when the app considers the device offline.
 * Sits below the status bar so it stays noticeable above in-app banners.
 */
export function OfflineModeBadge() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { isDark } = useTheme();
  const isOffline = useOfflineModeStore((s) => s.isOffline);

  if (!isOffline) {
    return null;
  }

  return (
    <View pointerEvents="none" style={[styles.host, { top: insets.top + 6 }]}>
      <View
        style={[
          styles.pill,
          {
            backgroundColor: colors.surfaceBackground,
            borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)',
          },
        ]}
        accessibilityRole="text"
        accessibilityLabel="Offline mode. You have no network connection."
      >
        <Ionicons
          name="cloud-offline-outline"
          size={16}
          color={colors.textMuted}
          accessibilityElementsHidden
        />
        <AppText
          variant="caption"
          className="font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark"
        >
          Offline
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 60,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
});
