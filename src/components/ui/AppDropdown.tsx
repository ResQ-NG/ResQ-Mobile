//TODO: fix the dropdown bug here
import { useState } from 'react';
import {
  View,
  Modal,
  FlatList,
  Pressable,
  Platform,
  type ListRenderItem,
} from 'react-native';
import { cn } from '@/lib/cn';
import { AppText } from '@/components/ui/AppText';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarAltArrowDownBoldIcon from '@/components/icons/solar/alt-arrow-down-bold';


const BORDER_CLASS =
  'border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]';

export type AppDropdownOption = { value: string; label: string };

export type AppDropdownProps = {
  options: AppDropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function AppDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select',
  className = '',
}: AppDropdownProps) {
  const { theme } = useAppColorScheme();
  const [open, setOpen] = useState(true);

  const selected = value ? options.find((o) => o.value === value) : null;
  const displayText = selected?.label ?? placeholder;

  const handleSelect = (option: AppDropdownOption) => {
    onChange(option.value);
    setOpen(false);
  };

  const renderItem: ListRenderItem<AppDropdownOption> = ({ item }) => (
    <Pressable
      onPress={() => handleSelect(item)}
      className="py-3 px-4 active:opacity-80"
      style={{ backgroundColor: theme.surfaceBackground }}
    >
      <AppText
        className={
          item.value === value
            ? 'font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark'
            : 'font-metropolis-regular text-primaryDark dark:text-primaryDark-dark'
        }
      >
        {item.label}
      </AppText>
    </Pressable>
  );

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className={cn(
          'flex-row items-center justify-between rounded-full min-h-[48px] px-4 gap-2',
          BORDER_CLASS,
          className
        )}
        style={{
          backgroundColor: theme.surfaceBackground,
          minHeight: 48,
        }}
      >
        <AppText
          className={
            selected
              ? 'font-metropolis-regular text-primaryDark dark:text-primaryDark-dark flex-1'
              : 'font-metropolis-regular text-captionDark dark:text-captionDark-dark flex-1'
          }
          numberOfLines={1}
        >
          {displayText}
        </AppText>
        <SolarAltArrowDownBoldIcon
          width={20}
          height={20}
          color={theme.textMuted}
        />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
        {...(Platform.OS === 'ios' && {
          presentationStyle: 'overFullScreen',
        })}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setOpen(false)}
        >
          <Pressable
            className="max-h-[50%] rounded-t-2xl overflow-hidden"
            style={{ backgroundColor: theme.surfaceBackground }}
            onPress={(e) => e.stopPropagation()}
          >
            <View className="py-2 border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]">
              <AppText className="text-center font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark">
                {placeholder}
              </AppText>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
