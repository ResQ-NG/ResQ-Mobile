import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppBannerStore } from '@/stores/app-banner-store';
import { AppBannerView } from './AppBanner';

export function AppBannerHost() {
  const banners = useAppBannerStore((state) => state.banners);
  const hideBanner = useAppBannerStore((state) => state.hideBanner);

  if (banners.length === 0) return null;

  return (
    <View pointerEvents="box-none" style={styles.host}>
      {banners.map((banner, index) => (
        <View
          key={banner.id}
          style={[styles.bannerWrapper, { marginTop: index === 0 ? 0 : 8 }]}
        >
          <AppBannerView banner={banner} onClose={() => hideBanner(banner.id)} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
  },
  bannerWrapper: {
    width: '100%',
  },
});

