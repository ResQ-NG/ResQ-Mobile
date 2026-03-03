import { AppAnimatedSafeAreaView } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { useAppColorScheme } from '@/theme/colorMode';

export default function EvidenceScreen() {
  const { theme } = useAppColorScheme();

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 items-center justify-center ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="md"
    >
      <AppText className="text-2xl font-metropolis-bold">Evidence</AppText>
    </AppAnimatedSafeAreaView>
  );
}
