import { View, TouchableOpacity } from 'react-native';
import { AppText } from '@/components/ui/AppText';

export type SheetView = 'list' | 'add';

type Props = {
  view: SheetView;
  onCancel: () => void;
};

export function WatchMeSheetHeader({ view, onCancel }: Props) {
  return (
    <View className="px-4 pt-2 pb-4 flex-row items-center justify-between">
      <View className="flex-1">
        <AppText className="font-metropolis-bold text-lg text-primaryDark dark:text-primaryDark-dark">
          {view === 'list' ? 'Add emergency contacts' : 'Add contact'}
        </AppText>
        <AppText className="text-sm text-captionDark dark:text-captionDark-dark mt-0.5">
          {view === 'list'
            ? 'Add at least 2 trusted people'
            : 'These contacts will be notified when you activate SOS'}
        </AppText>
      </View>
      <TouchableOpacity onPress={onCancel} hitSlop={12}>
        <AppText className="font-metropolis-medium text-primaryDark dark:text-primaryDark-dark">
          {view === 'list' ? 'Cancel' : 'Back'}
        </AppText>
      </TouchableOpacity>
    </View>
  );
}
