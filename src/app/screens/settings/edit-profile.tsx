import { useCallback, useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppAnimatedSafeAreaView,
  AppAnimatedScrollView,
} from '@/lib/animation';
import { useAppColorScheme } from '@/theme/colorMode';
import { TAB_BAR_HEIGHT } from '@/theme/constants';
import { WatchMeHeader } from '@/components/watchme';
import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui/Avatar';
import SolarCameraBoldIcon from '@/components/icons/solar/camera-bold';
import {
  useGetProfileInformation,
  useUpdateProfileInformation,
} from '@/network/modules/auth/queries';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useAvatarPresetPickerStore } from '@/stores/avatar-preset-picker-store';
import { dicebearUriToRasterImageUri } from '@/lib/third-party/dicebear';

export default function EditProfileScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 24;

  const { data: profile, isPending: profileLoading } = useGetProfileInformation();
  const updateProfile = useUpdateProfileInformation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name ?? '');
    setLastName(profile.last_name ?? '');
    setAvatarUrl((profile.avatar_url ?? '').trim());
  }, [profile]);

  const openPresetPicker = useCallback(() => {
    useAvatarPresetPickerStore.getState().open((preset) => {
      setAvatarUrl(preset.preview_url.trim());
    });
  }, []);

  const displayName = [firstName, lastName].filter(Boolean).join(' ') || 'You';
  const avatarSource =
    avatarUrl.length > 0
      ? { uri: dicebearUriToRasterImageUri(avatarUrl) }
      : undefined;

  const canSave =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    avatarUrl.trim().length > 0;

  const handleSave = usePreventDoublePress(() => {
    if (!canSave) return;
    updateProfile.mutate({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      avatar_url: avatarUrl.trim(),
    });
  });

  const handleBack = usePreventDoublePress(() => router.back());

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="sm"
      header={
        <WatchMeHeader
          onBack={handleBack}
          title="Edit profile"
          subtitle="Update your name and profile photo"
        />
      }
    >
      <AppAnimatedScrollView
        className="flex-1 pt-6"
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-8">
          <Pressable
            onPress={openPresetPicker}
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
            className="relative"
          >
            <Avatar
              size={112}
              altText={displayName}
              backgroundColor={AVATAR_BACKGROUNDS[2]}
              source={avatarSource}
            />
            <View className="absolute bottom-0 right-0 w-11 h-11 rounded-full bg-primary-blue dark:bg-primary-blue-dark items-center justify-center border-4 border-white dark:border-black">
              <SolarCameraBoldIcon width={22} height={22} color="#ffffff" />
            </View>
          </Pressable>
          <AppText
            variant="caption"
            className="text-captionDark dark:text-captionDark-dark mt-3"
          >
            Tap to choose an avatar preset
          </AppText>
        </View>

        <View className="gap-5">
          <View>
            <AppText className="font-metropolis-medium text-primaryDark dark:text-primaryDark-dark mb-3">
              First name
            </AppText>
            <AppInput
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              editable={!profileLoading}
            />
          </View>
          <View>
            <AppText className="font-metropolis-medium text-primaryDark dark:text-primaryDark-dark mb-3">
              Last name
            </AppText>
            <AppInput
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              editable={!profileLoading}
            />
          </View>
        </View>

        <View className="mt-10">
          <AppButton
            variant="primary"
            size="lg"
            className="w-full"
            onPress={handleSave}
            loading={updateProfile.isPending}
            disabled={!canSave || profileLoading}
          >
            Save changes
          </AppButton>
        </View>
      </AppAnimatedScrollView>
    </AppAnimatedSafeAreaView>
  );
}
