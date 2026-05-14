import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** Legacy plain-string key; kept for migration and sync with older writes. */
export const LEGACY_AUTH_TOKEN_KEY = 'auth_token';

export type AuthTokenState = {
  token: string | null;
  refreshToken: string | null;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
};

export const useAuthTokenStore = create<AuthTokenState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
    }),
    {
      name: 'resq-auth-token',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
