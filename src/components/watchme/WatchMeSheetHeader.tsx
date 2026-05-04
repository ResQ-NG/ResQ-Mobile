import { View, TouchableOpacity } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { useThemeColors } from '@/context/ThemeContext';
import MingcuteCloseLineIcon from '@/components/icons/mingcute/close-line';

export type SheetView = 'list' | 'add' | 'edit';

type Props = {
  view: SheetView;
  onCancel: () => void;
};

export function WatchMeSheetHeader({ view, onCancel }: Props) {
  const colors = useThemeColors();

  return (
    <View className="px-4 pt-2 pb-4 flex-row items-start justify-between">
      <View className="flex-1 pr-3">
        <AppText className="font-metropolis-bold text-lg text-primaryDark dark:text-primaryDark-dark">
          {view === 'list'
            ? 'Add emergency contacts'
            : view === 'edit'
              ? 'Edit contact'
              : 'Add contact'}
        </AppText>
        <AppText className="text-sm text-captionDark dark:text-captionDark-dark mt-0.5">
          {view === 'list'
            ? 'Add at least 2 trusted people'
            : 'These contacts will be notified when you activate SOS'}
        </AppText>
      </View>
      {view === 'add' || view === 'edit' ? (
        <TouchableOpacity
          onPress={onCancel}
          hitSlop={12}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Close"
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.surfaceBackground }}
        >
          <MingcuteCloseLineIcon
            width={18}
            height={18}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onCancel} hitSlop={12}>
          <AppText className="font-metropolis-medium text-primaryDark dark:text-primaryDark-dark">
            Cancel
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}
