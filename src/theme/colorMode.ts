import { useColorScheme } from 'react-native';

export type AppThemeName = 'light' | 'dark';

type AppThemeTokens = {
  /** Main page background: white (light) / black (dark) */
  background: string;
  /** Subtle surface (cards, sections): off-white (light) / dark-grey (dark) */
  surface: string;
  statusBarStyle: 'light' | 'dark';
};

export const LIGHT_THEME_TOKENS: AppThemeTokens = {
  background: 'bg-white',
  surface: 'bg-surface-light',
  statusBarStyle: 'dark',
};

export const DARK_THEME_TOKENS: AppThemeTokens = {
  background: 'bg-black',
  surface: 'bg-surface-dark',
  statusBarStyle: 'light',
};

export function useAppColorScheme() {
  const colorScheme = useColorScheme();
  const themeName: AppThemeName = colorScheme === 'dark' ? 'dark' : 'light';
  const theme = themeName === 'dark' ? DARK_THEME_TOKENS : LIGHT_THEME_TOKENS;

  return { themeName, theme };
}
