import { useColorScheme } from 'react-native';

export type AppThemeName = 'light' | 'dark';

export type AppThemeTokens = {
  /** Main page background: white (light) / black (dark) */
  background: string;

  /** background color for inline styles (e.g. buttons, cards) */
  backgroundColor: string;

  /** Subtle surface (cards, sections): off-white (light) / dark-grey (dark) */
  surface: string;
  /** Surface color for inline styles (e.g. buttons, cards) */
  surfaceBackground: string;
  /** Muted text / icon color for inline styles */
  textMuted: string;
  /** Heavy avatar border: dark in light theme, white in dark theme */
  avatarBorder: string;
  /** Icon color on accent/primary buttons (e.g. white) */
  iconOnAccent: string;
  /** Accent red for badges, feedback, etc. */
  accentRed: string;
  /** Primary blue for links, primary actions */
  primaryBlue: string;
  statusBarStyle: 'light' | 'dark';
};

export const LIGHT_THEME_TOKENS: AppThemeTokens = {
  background: 'bg-white',
  surface: 'bg-surface-light',
  backgroundColor: 'white',
  surfaceBackground: '#F7F7F7',
  textMuted: '#6b7280',
  avatarBorder: 'rgba(0,0,0,0.14)',
  iconOnAccent: '#ffffff',
  accentRed: '#F00033',
  primaryBlue: '#0000FF',
  statusBarStyle: 'dark',
};

export const DARK_THEME_TOKENS: AppThemeTokens = {
  background: 'bg-black',
  surface: 'bg-surface-dark',
  backgroundColor: '#121212',
  surfaceBackground: '#121212',
  textMuted: '#9ca3af',
  avatarBorder: '#ffffff',
  iconOnAccent: '#ffffff',
  accentRed: '#FF3366',
  primaryBlue: '#3333FF',
  statusBarStyle: 'light',
};

export function useAppColorScheme() {
  const colorScheme = useColorScheme();
  const themeName: AppThemeName = colorScheme === 'dark' ? 'dark' : 'light';
  const theme = themeName === 'dark' ? DARK_THEME_TOKENS : LIGHT_THEME_TOKENS;

  return { themeName, theme };
}
