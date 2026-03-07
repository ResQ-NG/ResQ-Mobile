import { useColorScheme } from 'react-native';

export type AppThemeName = 'light' | 'dark';

export type AppThemeTokens = {
  /** Main page background: white (light) / black (dark) */
  background: string;
  /** Subtle surface (cards, sections): off-white (light) / dark-grey (dark) */
  surface: string;
  /** Surface color for inline styles (e.g. buttons, cards) */
  surfaceBackground: string;
  /** Muted text color for inline styles */
  textMuted: string;
  /** Heavy avatar border: dark in light theme, white in dark theme */
  avatarBorder: string;
  statusBarStyle: 'light' | 'dark';
};

export const LIGHT_THEME_TOKENS: AppThemeTokens = {
  background: 'bg-white',
  surface: 'bg-surface-light',
  surfaceBackground: '#F7F7F7',
  textMuted: '#6b7280',
  avatarBorder: 'rgba(0,0,0,0.14)',
  statusBarStyle: 'dark',
};

export const DARK_THEME_TOKENS: AppThemeTokens = {
  background: 'bg-black',
  surface: 'bg-surface-dark',
  surfaceBackground: '#121212',
  textMuted: '#9ca3af',
  avatarBorder: '#ffffff',
  statusBarStyle: 'light',
};

export function useAppColorScheme() {
  const colorScheme = useColorScheme();
  const themeName: AppThemeName = colorScheme === 'dark' ? 'dark' : 'light';
  const theme = themeName === 'dark' ? DARK_THEME_TOKENS : LIGHT_THEME_TOKENS;

  return { themeName, theme };
}
