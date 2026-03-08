import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  AppAnimatedSafeAreaView,
  AppAnimatedScrollView,
  AppAnimatedView,
  brandFadeIn,
  brandFadeInUp,
} from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppButton } from '@/components/ui/AppButton';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarArrowLeftBrokenIcon from '@/components/icons/solar/arrow-left-broken';
import SolarShieldCheckBoldIcon from '@/components/icons/solar/shield-check-bold';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';
import SolarUsersGroupRoundedBoldIcon from '@/components/icons/solar/users-group-rounded-bold';
import { useAppColorScheme } from '@/theme/colorMode';
import LottieView from 'lottie-react-native';

export default function WatchMeOnboardingScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();

  const handleDismiss = () => router.back();

  const handleGetStarted = () => {
    router.back();
    setTimeout(() => {
      router.push('/screens/watch-me-contacts');
    }, 100);
  };

  const isDark = theme.background.includes('black');
  const cardBg = isDark ? 'bg-[#1c1c1c]' : 'bg-[#f5f5f5]';
  const cardBorder = isDark
    ? 'border-[rgba(255,255,255,0.08)]'
    : 'border-[rgba(0,0,0,0.06)]';

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="md"
      header={
        <AppAnimatedView
          entering={brandFadeIn}
          className="flex-row items-center justify-between py-2"
        >
          <RoundedButton
            onPress={handleDismiss}
            icon={
              <SolarArrowLeftBrokenIcon
                width={20}
                height={20}
                color={theme.textMuted}
              />
            }
            className="bg-white dark:bg-[#1a1a1a] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]"
            accessibilityLabel="Close"
          />
          <View style={{ width: 44, height: 44 }} />
        </AppAnimatedView>
      }
    >
      <AppAnimatedScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <AppAnimatedView
          entering={brandFadeInUp.delay(80)}
          className="items-center mb-10"
        >
          <LottieView
            source={require('../../../assets/lottie/watch-me.json')}
            autoPlay
            loop
            style={{ width: 250, height: 200 }}
          />
          <AppHeading
            level={2}
            className="text-primaryDark dark:text-primaryDark-dark text-center mb-2"
          >
            Watch me
          </AppHeading>
          <AppText
            variant="body"
            className="text-captionDark dark:text-captionDark-dark text-center max-w-[320px]"
          >
            Share your journey with people who care
          </AppText>
        </AppAnimatedView>

        {/* ——— Part 1: Why it matters ——— */}
        <AppAnimatedView entering={brandFadeInUp.delay(140)} className="mb-8">
          <View className="flex-row items-center gap-2 mb-3">
            <View
              className={`w-8 h-8 rounded-full ${cardBg} border ${cardBorder} items-center justify-center`}
            >
              <SolarShieldCheckBoldIcon
                width={18}
                height={18}
                color={theme.primaryBlue}
              />
            </View>
            <AppHeading
              level={5}
              className="text-primaryDark font-metropolis-bold dark:text-primaryDark-dark"
            >
              Why it matters
            </AppHeading>
          </View>
          <View
            className={`rounded-2xl p-4 ${cardBg}`}
            style={{ gap: 16 }}
          >
            <View className="flex-row items-start gap-3">
              <View className="w-9 h-9 rounded-full bg-[#9B87F5]/15 dark:bg-[#8B77E5]/20 items-center justify-center">
                <SolarMapPointBoldIcon
                  width={20}
                  height={20}
                  color="#9B87F5"
                />
              </View>
              <View className="flex-1">
                <AppText className="font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark mb-0.5">
                  Live location sharing
                </AppText>
                <AppText
                  variant="caption"
                  className="text-captionDark dark:text-captionDark-dark leading-5"
                >
                  Chosen contacts see where you are until you arrive safely. If something goes wrong, they can get help faster.
                </AppText>
              </View>
            </View>
            <View className="flex-row items-start gap-3">
              <View className="w-9 h-9 rounded-full bg-[#9B87F5]/15 dark:bg-[#8B77E5]/20 items-center justify-center">
                <SolarUsersGroupRoundedBoldIcon
                  width={20}
                  height={20}
                  color="#9B87F5"
                />
              </View>
              <View className="flex-1">
                <AppText className="font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark mb-0.5">
                  Peace of mind
                </AppText>
                <AppText
                  variant="caption"
                  className="text-captionDark dark:text-captionDark-dark leading-5"
                >
                  Perfect for late-night trips, unfamiliar areas, or whenever you want loved ones in the loop.
                </AppText>
              </View>
            </View>
          </View>
        </AppAnimatedView>

        {/* ——— Part 2: How to get started ——— */}
        <AppAnimatedView entering={brandFadeInUp.delay(220)} className="mb-8">
          <View className="flex-row items-center gap-2 mb-3">
            <View
              className={`w-8 h-8 rounded-full ${cardBg} border ${cardBorder} items-center justify-center`}
            >
              <SolarMapPointBoldIcon
                width={18}
                height={18}
                color={theme.primaryBlue}
              />
            </View>
            <AppHeading
              level={5}
              className="text-primaryDark font-metropolis-bold dark:text-primaryDark-dark"
            >
              How to get started
            </AppHeading>
          </View>
          <View
            className={`rounded-2xl p-4 ${cardBg}`}
            style={{ gap: 16 }}
          >
            <View className="flex-row items-start gap-3">
              <View className="w-9 h-9 rounded-full bg-[#9B87F5]/15 dark:bg-[#8B77E5]/20 items-center justify-center">
                <AppText className="text-[#9B87F5] dark:text-[#8B77E5] font-metropolis-bold text-sm">
                  1
                </AppText>
              </View>
              <View className="flex-1">
                <AppText className="font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark mb-0.5">
                  Setup your contacts
                </AppText>
                <AppText
                  variant="caption"
                  className="text-captionDark dark:text-captionDark-dark leading-5"
                >
                  Add and group trusted contacts (e.g. family, work). You’ll choose who watches when you start a session.
                </AppText>
              </View>
            </View>
            <View className="flex-row items-start gap-3">
              <View className="w-9 h-9 rounded-full bg-[#9B87F5]/15 dark:bg-[#8B77E5]/20 items-center justify-center">
                <AppText className="text-[#9B87F5] dark:text-[#8B77E5] font-metropolis-bold text-sm">
                  2
                </AppText>
              </View>
              <View className="flex-1">
                <AppText className="font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark mb-0.5">
                  Pick your destination
                </AppText>
                <AppText
                  variant="caption"
                  className="text-captionDark dark:text-captionDark-dark leading-5"
                >
                  Enter where you’re going and your estimated arrival
                </AppText>
              </View>
            </View>
            <View className="flex-row items-start gap-3">
              <View className="w-9 h-9 rounded-full bg-[#9B87F5]/15 dark:bg-[#8B77E5]/20 items-center justify-center">
                <AppText className="text-[#9B87F5] dark:text-[#8B77E5] font-metropolis-bold text-sm">
                  3
                </AppText>
              </View>
              <View className="flex-1">
                <AppText className="font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark mb-0.5">
                  They follow along — you stay safer
                </AppText>
                <AppText
                  variant="caption"
                  className="text-captionDark dark:text-captionDark-dark leading-5"
                >
                  Your contacts see your live location until you arrive. If you need help, they know where you are.
                </AppText>
              </View>
            </View>
          </View>
        </AppAnimatedView>
      </AppAnimatedScrollView>

      <View
        className="absolute left-0 right-0 bottom-0 px-4 bg-white dark:bg-black"
        style={{ paddingBottom: insets.bottom + 16, paddingTop: 16 }}
      >
        <AppButton
          onPress={handleGetStarted}
          variant="primary"
          size="lg"
          className="w-full"
        >
          Get started
        </AppButton>
      </View>
    </AppAnimatedSafeAreaView>
  );
}
