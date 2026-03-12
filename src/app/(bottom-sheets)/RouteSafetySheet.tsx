import { View } from 'react-native';
import { router } from 'expo-router';
import { BaseBottomSheet } from '@/components/bottom-sheet';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { useUnsafeRouteSheetStore } from '@/stores/unsafe-route-sheet-store';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';
import SolarWalkingBoldIcon from '@/components/icons/solar/walking-bold';
import MingcuteCar3FillIcon from '@/components/icons/mingcute/car-3-fill';
import SolarBusBoldIcon from '@/components/icons/solar/bus-bold';
import SolarTramBoldIcon from '@/components/icons/solar/tram-bold';
import SolarInfoCircleBoldIcon from '@/components/icons/solar/info-circle-bold';
import { useAppColorScheme } from '@/theme/colorMode';
import LottieView from 'lottie-react-native';
import { AppHeading } from '@/components/ui';

const SNAP_POINTS = ['75%', '98%'];

export function RouteSafetyStatusSheet() {
  const { isOpen, close, fromLabel, toLabel, issues } =
    useUnsafeRouteSheetStore();
  const { theme, themeName } = useAppColorScheme();

  const description =
    fromLabel && toLabel
      ? `People using Watch Me have recently reported issues going from ${fromLabel} to ${toLabel}.`
      : 'People using Watch Me have recently reported issues along this route.';

  const handleViewStories = () => {
    close();
    router.push('/screens/community');
  };

  const footer = (
    <View className="px-4 gap-3 w-full">
      <AppButton
        variant="outline"
        size="lg"
        className="w-full"
        onPress={handleViewStories}
      >
        View broadcasts
      </AppButton>
      <AppButton variant="primary" size="lg" className="w-full" onPress={close}>
        Got it
      </AppButton>
    </View>
  );

  return (
    <BaseBottomSheet
      snapPoints={SNAP_POINTS}
      enableDynamicSizing={false}
      isOpen={isOpen}
      onClose={close}
      title="Route safety concerns"
      description={description}
      footer={footer}
      contentPadding={{ horizontal: 16, top: 0, bottom: 16 }}
    >
      <View className="px-1 mb-80">
        {/* Overall status */}
        <View
          className="mb-4 rounded-2xl px-4 py-4 bg-white dark:bg-black"

        >
          <View className="items-center mb-3">
            <LottieView
              source={require('@assets/lottie/alert.json')}
              autoPlay
              loop={false}
              style={{ width: 110, height: 110 }}
            />
            <AppHeading level={4} className="text-center mt-1">
              Higher risk on this route
            </AppHeading>
            <AppText variant="caption" className="text-center mt-1">
              Recent Watch Me reports suggest extra caution here. Some ways of
              taking this route are safer than others.
            </AppText>
          </View>
          <View className="flex-row flex-wrap gap-2 mt-2">
            <View className="flex-row items-center gap-2 px-3 py-2 rounded-full bg-accent-red/10 dark:bg-accent-red-dark/15">
              <SolarWalkingBoldIcon width={16} height={16} color={theme.accentRed} />
              <AppText className="text-[11px] font-metropolis-semibold text-accent-red dark:text-accent-red-dark">
                Walking · higher risk
              </AppText>
            </View>
            <View className="flex-row items-center gap-2 px-3 py-2 rounded-full bg-accent-red/10 dark:bg-accent-red-dark/15">
              <MingcuteCar3FillIcon width={16} height={16} color={theme.accentRed} />
              <AppText className="text-[11px] font-metropolis-semibold text-accent-red dark:text-accent-red-dark">
                Driving · higher risk
              </AppText>
            </View>
            <View className="flex-row items-center gap-2 px-3 py-2 rounded-full bg-[#DCFCE7] dark:bg-[#14532D]">
              <SolarBusBoldIcon width={16} height={16} color="#166534" />
              <AppText className="text-[11px] font-metropolis-semibold text-[#166534] dark:text-[#BBF7D0]">
                Bus · relatively safer
              </AppText>
            </View>
            <View className="flex-row items-center gap-2 px-3 py-2 rounded-full bg-[#DCFCE7] dark:bg-[#14532D]">
              <SolarTramBoldIcon width={16} height={16} color="#166534" />
              <AppText className="text-[11px] font-metropolis-semibold text-[#166534] dark:text-[#BBF7D0]">
                Train · relatively safer
              </AppText>
            </View>
          </View>
        </View>

        {/* Route pill */}
        <View className="mb-4 rounded-full px-5 py-3 bg-surface-light dark:bg-surface-dark flex-row items-center gap-3">
          <SolarMapPointBoldIcon
            width={20}
            height={20}
            color={theme.primaryBlue}
          />
          <AppText
            className="flex-1 text-sm font-metropolis-medium text-primaryDark dark:text-primaryDark-dark"
            numberOfLines={2}
          >
            {fromLabel || 'Your location'} to {toLabel || 'this destination'}
          </AppText>
        </View>

        {/* Issues from Watch Me feedback */}
        <View className="mb-3 flex-row items-center justify-between">
          <AppText className="text-xs font-metropolis-semibold text-captionDark dark:text-captionDark-dark uppercase tracking-wide">
            Reported on this route
          </AppText>
          <View className="px-2 py-0.5 rounded-full bg-accent-red/10 dark:bg-accent-red-dark/10">
            <AppText className="text-[10px] font-metropolis-semibold text-accent-red dark:text-accent-red-dark uppercase">
              {issues.length} issue{issues.length === 1 ? '' : 's'}
            </AppText>
          </View>
        </View>
        <View className="rounded-2xl overflow-hidden bg-surface-light dark:bg-surface-dark">
          {issues.map((issue, index) => (
            <View
              key={issue.id}
              className="flex-row items-center gap-3 px-4 py-3"
              style={{
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor:
                  themeName === 'dark'
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.06)',
              }}
            >
              <View className="w-8 h-8 rounded-full bg-accent-red/10 dark:bg-accent-red-dark/10 items-center justify-center">
                <SolarInfoCircleBoldIcon
                  width={16}
                  height={16}
                  color={theme.accentRed}
                />
              </View>
              <AppText className="flex-1 text-sm font-metropolis-regular text-primaryDark dark:text-primaryDark-dark">
                {issue.count != null && issue.count > 0
                  ? `${issue.label} (${issue.count})`
                  : issue.label}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </BaseBottomSheet>
  );
}
