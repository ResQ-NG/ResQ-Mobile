import { View } from 'react-native';
import type { ComponentType } from 'react';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';

const ICON_COLOR = '#F00033';

export type OnboardingFeature = {
  Icon: ComponentType<{ width: number; height: number; color: string }>;
  title: string;
  description: string;
};

type OnboardingFeatureRowProps = {
  feature: OnboardingFeature;
  index: number;
};

export function OnboardingFeatureRow({ feature, index }: OnboardingFeatureRowProps) {
  const { Icon, title, description } = feature;

  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(160 + index * 80)}
      className="mb-6 flex-row gap-4"
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark">
        <Icon width={24} height={24} color={ICON_COLOR} />
      </View>
      <View className="flex-1">
        <AppText className="font-metropolis-extrabold text-lg">
          {title}
        </AppText>
        <AppText className="mt-1 text-base leading-5">
          {description}
        </AppText>
      </View>
    </AppAnimatedView>
  );
}
