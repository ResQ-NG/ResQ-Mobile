import { useFonts } from 'expo-font';
import { metropolisFonts } from '@/theme/fonts';

export function useMetropolisFonts() {
  const [loaded, error] = useFonts(metropolisFonts);
  return { loaded: !!loaded, error };
}
