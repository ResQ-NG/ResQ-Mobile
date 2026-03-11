import { create } from 'zustand';

export type AppBannerVariant = 'info' | 'warning' | 'danger' | 'success';

export type AppBanner = {
  id: string;
  title: string;
  message: string;
  actionLabel?: string;
  onActionPress?: () => void;
  variant?: AppBannerVariant;
  /** When true, show a close (X) button so the user can dismiss the banner */
  dismissable?: boolean;
};

type AppBannerState = {
  banners: AppBanner[];
};

type AppBannerActions = {
  showBanner: (banner: Omit<AppBanner, 'id'> & { id?: string }) => string;
  hideBanner: (id: string) => void;
  clearBanners: () => void;
};

const initialState: AppBannerState = {
  banners: [],
};

export const useAppBannerStore = create<AppBannerState & AppBannerActions>()(
  (set) => ({
    ...initialState,
    showBanner: (banner) => {
      const id = banner.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      set((state) => ({
        banners: [
          // Replace any existing banner with the same id, keep others so multiple can stack
          ...state.banners.filter((existing) => existing.id !== id),
          { ...banner, id },
        ],
      }));

      return id;
    },
    hideBanner: (id) =>
      set((state) => ({
        banners: state.banners.filter((banner) => banner.id !== id),
      })),
    clearBanners: () => set(initialState),
  })
);

