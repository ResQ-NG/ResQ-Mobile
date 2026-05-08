import { View, Pressable } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarUserSpeakBoldIcon from '@/components/icons/solar/user-speak-bold';
import SolarMapPointRotateBoldIcon from '@/components/icons/solar/map-point-rotate-bold';
import SolarCameraBoldIcon from '@/components/icons/solar/camera-bold';
import SolarSettingsBoldIcon from '@/components/icons/solar/settings-bold';
import type { ComponentType } from 'react';
import SolarFolderOpenBoldIcon from '../icons/solar/folder-open-bold';
import { useTabBadgesStore } from '@/stores/tab-badges-store';

type IconComponent = ComponentType<{ width: number; height: number; color: string }>;

const TAB_ICONS: Record<string, IconComponent> = {
  community: SolarUserSpeakBoldIcon,
  watchme: SolarMapPointRotateBoldIcon,
  main: SolarCameraBoldIcon,
  reports: SolarFolderOpenBoldIcon,
  settings: SolarSettingsBoldIcon,
};

const ICON_SIZE = 24;
const ACTIVE_ICON_SIZE = 26;

/** Map of tab route name → whether it currently has an unread dot. */
function useTabDots(): Record<string, boolean> {
  const badgesEnabled = useTabBadgesStore((s) => s.badgesEnabled);
  const watchMeHasUnread = useTabBadgesStore((s) => s.watchMeHasUnread);
  if (!badgesEnabled) return {};
  return { watchme: watchMeHasUnread };
}

export function AppTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useAppColorScheme();
  const tabDots = useTabDots();
  const clearWatchMeUnread = useTabBadgesStore((s) => s.clearWatchMeUnread);

  const activeColor = theme.iconOnAccent;
  const inactiveColor = theme.textMuted;

  const glassBackground = isDark ? 'rgba(18,18,18,0.75)' : 'rgba(255,255,255,0.72)';
  const glassBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <BlurView
        intensity={80}
        tint={isDark ? 'dark' : 'light'}
        style={{
          flex: 1,
          width: '100%',
          overflow: 'hidden',
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 12,
          paddingTop: 20,
          borderWidth: 1,
          borderColor: glassBorder,
          backgroundColor: glassBackground,
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const Icon = TAB_ICONS[route.name];

            const hasDot = Boolean(tabDots[route.name]);

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
              if (route.name === 'watchme') clearWatchMeUnread();
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              >
                {Icon &&
                  (isFocused ? (
                    <View
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 26,
                        backgroundColor: theme.primaryBlue,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon
                        width={ACTIVE_ICON_SIZE}
                        height={ACTIVE_ICON_SIZE}
                        color={activeColor}
                      />
                      {hasDot && (
                        <View
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            width: 9,
                            height: 9,
                            borderRadius: 5,
                            backgroundColor: '#ef4444',
                            borderWidth: 1.5,
                            borderColor: theme.primaryBlue,
                          }}
                        />
                      )}
                    </View>
                  ) : (
                    <View>
                      <Icon width={ICON_SIZE} height={ICON_SIZE} color={inactiveColor} />
                      {hasDot && (
                        <View
                          style={{
                            position: 'absolute',
                            top: -3,
                            right: -5,
                            width: 9,
                            height: 9,
                            borderRadius: 5,
                            backgroundColor: '#ef4444',
                            borderWidth: 1.5,
                            borderColor: glassBackground,
                          }}
                        />
                      )}
                    </View>
                  ))}
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}
