import { View, ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Avatar, AppButton, AVATAR_BACKGROUNDS } from '@/components/ui';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';
import { useAppColorScheme } from '@/theme/colorMode';
import type { ActiveWatch } from './types';
import { getStatusBadgeBg, getStatusBadgeLabel } from './types';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';

interface WatchMeContactListProps {
  watches: ActiveWatch[];
  onSelectContact: (id: string) => void;
  onExpandPress?: () => void;
}

export function WatchMeContactList({
  watches,
  onSelectContact,
  onExpandPress,
}: WatchMeContactListProps) {
  const { theme } = useAppColorScheme();

  return (
    <>
      {watches.length > 0 ? (
        <AppAnimatedView
          entering={brandFadeInUp.delay(80)}
          className="bg-[rgba(255,255,255,0.96)] dark:bg-[rgba(18,18,18,0.95)] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.16)] px-5 rounded-[3rem]"
          style={{
            marginHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 20,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 12,
              gap: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            className="w-full"
          >
            {watches.map((watch, index) => {
              const bgIndex = watch.avatarBgIndex ?? index;
              const badgeBg = getStatusBadgeBg(watch.status);
              const badgeLabel = getStatusBadgeLabel(watch.status);
              const onMap = watch.availableOnMap === true;
              return (
                <TouchableOpacity
                  key={watch.id}
                  activeOpacity={0.85}
                  onPress={() => onSelectContact(watch.id)}
                >
                  <View className="items-center mx-1">
                    <View style={{ marginBottom: 8 }}>
                      <Avatar
                        size={44}
                        backgroundColor={
                          AVATAR_BACKGROUNDS[
                            bgIndex % AVATAR_BACKGROUNDS.length
                          ]
                        }
                        altText={watch.name}
                      />
                      <View
                        style={{
                          position: 'absolute',
                          bottom: -6,
                          alignSelf: 'center',
                          borderRadius: 999,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          backgroundColor: badgeBg,
                        }}
                      >
                        <AppText className="text-[10px] font-metropolis-semibold text-white">
                          {badgeLabel}
                        </AppText>
                      </View>
                    </View>
                    <AppText
                      className="text-xs font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark"
                      numberOfLines={1}
                    >
                      {watch.name}
                    </AppText>
                    <AppText
                      className="text-[10px] text-captionDark dark:text-captionDark-dark"
                      numberOfLines={1}
                    >
                      {watch.lastCheckLabel}
                    </AppText>
                    {onMap && (
                      <View className="flex-row items-center gap-1 mt-0.5">
                        <SolarMapPointBoldIcon
                          width={10}
                          height={10}
                          color={theme.primaryBlue}
                        />
                        <AppText
                          className="text-[10px] text-primaryBlue font-metropolis-medium"
                          numberOfLines={1}
                        >
                          On map
                        </AppText>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {watches.length >= 5 && (
            <View className="w-full items-end mt-2">
              <AppButton
                variant="outline"
                size="sm"
                className="rounded-full border-[rgba(0,0,0,0.16)] dark:border-[rgba(255,255,255,0.35)]"
                onPress={onExpandPress}
              >
                Expand
              </AppButton>
            </View>
          )}
        </AppAnimatedView>
      ) : (
        <></>
      )}
    </>
  );
}
