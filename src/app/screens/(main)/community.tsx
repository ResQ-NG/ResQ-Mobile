import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppAnimatedSafeAreaView, AppAnimatedScrollView } from '@/lib/animation';
import { useAppColorScheme } from '@/theme/colorMode';
import { TAB_BAR_HEIGHT } from '@/theme/constants';
import { BroadcastHeader } from '@/components/community/BroadcastHeader';
import { BroadcastSegmentControl, type BroadcastSegment } from '@/components/community/BroadcastSegmentControl';
import { BroadcastHero } from '@/components/community/BroadcastHero';
import { BroadcastOfficialBanner } from '@/components/community/BroadcastOfficialBanner';

const BANNER_BOTTOM_OFFSET = TAB_BAR_HEIGHT;

export default function CommunityScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const [segment, setSegment] = useState<BroadcastSegment>('general');
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 24;
  const bannerBottom = BANNER_BOTTOM_OFFSET + insets.bottom;

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      header={<BroadcastHeader />}
    >
      <AppAnimatedScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: bottomPadding + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <BroadcastSegmentControl active={segment} onChange={setSegment} />
        <BroadcastHero badgeCount={3} />
      </AppAnimatedScrollView>

      <View
        className="absolute left-0 right-0 bottom-0 overflow-hidden"
        style={{ marginBottom: bannerBottom }}
      >
        <BroadcastOfficialBanner />
      </View>
    </AppAnimatedSafeAreaView>
  );
}
