import { useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  AppAnimatedSafeAreaView,
  AppAnimatedView,
  brandFadeIn,
} from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarArrowLeftBrokenIcon from '@/components/icons/solar/arrow-left-broken';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';
import SolarArchiveMinimalisticBoldIcon from '@/components/icons/solar/archive-minimalistic-bold';
import { useAppColorScheme } from '@/theme/colorMode';

const MIN_DESCRIPTION_LENGTH = 20;
const IMAGE_STRIP_HEIGHT = 200;
const IMAGE_GAP = 8;

interface NewReportDetailsStepProps {
  /** Optional media URIs from previous step to show in strip */
  mediaUris?: string[];
  description?: string;
  location?: string;
  onDescriptionChange?: (text: string) => void;
  onLocationChange?: (text: string) => void;
  onBack?: () => void;
  onSubmitPress?: () => void;
}

export function NewReportDetailsStep({
  mediaUris = [],
  description = '',
  location = '',
  onDescriptionChange,
  onLocationChange,
  onBack,
  onSubmitPress,
}: NewReportDetailsStepProps) {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.36;
  const [desc, setDesc] = useState(description);
  const [loc, setLoc] = useState(location);
  const bottomInset = insets.bottom;

  const handlePreviewImage = (uri: string, index: number) => {
    router.push({
      pathname: '/(modals)/image-preview',
      params: { uri, mode: 'details', index: String(index) },
    } as Parameters<typeof router.push>[0]);
  };

  const handleDescChange = (text: string) => {
    setDesc(text);
    onDescriptionChange?.(text);
  };
  const handleLocChange = (text: string) => {
    setLoc(text);
    onLocationChange?.(text);
  };

  const count = desc.length;
  const meetsMin = count >= MIN_DESCRIPTION_LENGTH;
  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="sm"
      header={
        <AppAnimatedView
          entering={brandFadeIn}
          className="flex-row items-center justify-between py-2"
        >
          <RoundedButton
            onPress={onBack}
            icon={
              <SolarArrowLeftBrokenIcon
                width={20}
                height={20}
                color={theme.textMuted}
              />
            }
            className="bg-white dark:bg-[#1a1a1a] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]"
            accessibilityLabel="Go back"
          />
          <AppHeading
            level={4}
            className="text-primaryDark dark:text-primaryDark-dark"
          >
            New report
          </AppHeading>
          <View style={{ width: 44, height: 44 }} />
        </AppAnimatedView>
      }
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: bottomInset + 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Horizontal image strip – equal gap between all images */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 16,
          }}
          style={{ flexGrow: 0 }}
        >
          {mediaUris.length > 0
            ? mediaUris.map((uri, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handlePreviewImage(uri, i)}
                  activeOpacity={0.9}
                  className="rounded-xl overflow-hidden bg-surface-light dark:bg-surface-dark border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]"
                  style={{
                    width: cardWidth,
                    height: IMAGE_STRIP_HEIGHT,
                    marginRight: IMAGE_GAP,
                  }}
                >
                  <Image
                    source={{ uri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))
            : [1, 2, 3].map((i) => (
                <View
                  key={i}
                  className="rounded-xl overflow-hidden bg-surface-light dark:bg-surface-dark border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] items-center justify-center"
                  style={{
                    width: cardWidth,
                    height: IMAGE_STRIP_HEIGHT,
                    marginRight: IMAGE_GAP,
                  }}
                >
                  <SolarArchiveMinimalisticBoldIcon
                    width={28}
                    height={28}
                    color={theme.textMuted}
                  />
                </View>
              ))}
        </ScrollView>

        {/* Describe what happened */}
        <View className="px-4 mb-5 mt-4">
          <AppHeading
            level={5}
            className="text-primaryDark font-metropolis-bold dark:text-primaryDark-dark mb-1"
          >
            Describe what happened
          </AppHeading>
          <AppText
            variant="caption"
            className="text-captionDark dark:text-captionDark-dark mb-2"
          >
            Provide as much detail as possible
          </AppText>
          <AppInput
            value={desc}
            onChangeText={handleDescChange}
            placeholder="I witnessed a robbery at the market. Two men on a motorcycle snatched a woman's bag and fled towards the Ozone mall..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="min-h-[100px]"
          />
          <View className="flex-row justify-between mt-1.5">
            <AppText
              variant="caption"
              className="text-captionDark dark:text-captionDark-dark"
            >
              Minimum {MIN_DESCRIPTION_LENGTH} characters
            </AppText>
            <AppText
              variant="caption"
              className={
                meetsMin
                  ? 'text-success-green dark:text-success-green-dark'
                  : 'text-captionDark dark:text-captionDark-dark'
              }
            >
              {count} / {MIN_DESCRIPTION_LENGTH}
            </AppText>
          </View>
        </View>

        {/* Location (Optional) */}
        <View className="px-4 mb-8">
          <AppHeading
            level={5}
            className="text-primaryDark font-metropolis-bold dark:text-primaryDark-dark mb-2"
          >
            Location (Optional)
          </AppHeading>
          <AppInput
            value={loc}
            onChangeText={handleLocChange}
            placeholder="Lekki phase 1, Lagos"
            className="rounded-full"
            leftIcon={
              <SolarMapPointBoldIcon
                width={20}
                height={20}
                color={theme.textMuted}
              />
            }
          />
          <AppText
            variant="caption"
            className="text-captionDark dark:text-captionDark-dark mt-1.5"
          >
            Your GPS location will be automatically captured
          </AppText>
        </View>
      </ScrollView>

      {/* Submit report – fixed at bottom, same border style */}
      <View
        className="absolute left-0 right-0 bottom-0 px-4 b bg-white dark:bg-black"
        style={{ paddingBottom: bottomInset + 16, paddingTop: 16 }}
      >
        <AppButton
          onPress={onSubmitPress}
          variant="primary"
          size="lg"
          className="w-full"
        >
          Submit report
        </AppButton>
      </View>
    </AppAnimatedSafeAreaView>
  );
}
