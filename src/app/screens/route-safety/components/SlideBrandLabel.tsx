import { Image, View } from 'react-native';
import { AppAnimatedView } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { slideLabel } from './SlideAnimations';

const appLogo = require('@assets/applogo-without-bg.png');

export const SLIDE_BRAND_LOGO_TEXT_GAP = 6;
export const SLIDE_BRAND_ROW_MARGIN_BOTTOM = 8;

type SlideBrandLabelProps = {
  label: string;
  logoWidth?: number;
  logoHeight?: number;
};

export function SlideBrandLabel({
  label,
  logoWidth = 48,
  logoHeight = 18,
}: SlideBrandLabelProps) {
  return (
    <AppAnimatedView entering={slideLabel} className="self-start">
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: SLIDE_BRAND_LOGO_TEXT_GAP,
        }}
      >
        <Image
          source={appLogo}
          style={{
            width: logoWidth,
            height: logoHeight,
            marginRight: -4,
          }}
          resizeMode="contain"
          accessibilityLabel="ResQ"
        />
        <AppText
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 1,
            marginTop: 1,
          }}
        >
          {label}
        </AppText>
      </View>
    </AppAnimatedView>
  );
}
