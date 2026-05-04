import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '@/components/ui/AppText';
import type { HowToUseSlideStat } from '@/components/help/howToUseAppData';

type HowToUseSlideHeroProps = {
  Icon: ComponentType<{ width: number; height: number; color: string }>;
  stats: HowToUseSlideStat[];
  gradientLight: readonly [string, string];
  gradientDark: readonly [string, string];
  isDark: boolean;
  iconColor: string;
};

export function HowToUseSlideHero({
  Icon,
  stats,
  gradientLight,
  gradientDark,
  isDark,
  iconColor,
}: HowToUseSlideHeroProps) {
  const colors = isDark ? [...gradientDark] : [...gradientLight];

  return (
    <LinearGradient
      colors={colors as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View
        pointerEvents="none"
        className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-primary-blue/15 dark:bg-primary-blue-dark/25"
      />
      <View
        pointerEvents="none"
        className="absolute -bottom-4 -left-10 h-24 w-24 rounded-full bg-primary-blue/10 dark:bg-primary-blue-dark/20"
      />

      <View className="mb-5 items-center">
        <View className="h-[88px] w-[88px] items-center justify-center rounded-full bg-white/85 shadow-sm dark:bg-white/12 dark:shadow-none">
          <Icon width={48} height={48} color={iconColor} />
        </View>
      </View>

      <View className="flex-row gap-2.5">
        {stats.map((s) => (
          <View
            key={`${s.value}-${s.label}`}
            className="min-h-[72px] flex-1 rounded-2xl border border-white/60 bg-white/90 px-3 py-2.5 dark:border-white/10 dark:bg-black/35"
          >
            <AppText
              className="font-metropolis-bold text-xl text-primary-blue dark:text-primary-blue-dark"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {s.value}
            </AppText>
            <AppText
              variant="caption"
              className="mt-0.5 text-captionDark dark:text-captionDark-dark"
              numberOfLines={3}
            >
              {s.label}
            </AppText>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 20,
  },
});
