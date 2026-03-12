import { View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { AppInput, InlineSelect } from '@/components/ui';
import SolarUsersGroupRoundedBoldIcon from '@/components/icons/solar/users-group-rounded-bold';
import SolarUserSpeakBoldIcon from '@/components/icons/solar/user-speak-bold';
import SolarFolderOpenBoldIcon from '@/components/icons/solar/folder-open-bold';
import SolarInfoCircleBoldIcon from '@/components/icons/solar/info-circle-bold';

export const RELATIONSHIP_OPTIONS = [
  { value: 'family', label: 'Family' },
  { value: 'friend', label: 'Friend' },
  { value: 'work', label: 'Work' },
  { value: 'other', label: 'Other' },
];

type Props = {
  name: string;
  phone: string;
  relationship: string | null;
  onChangeName: (v: string) => void;
  onChangePhone: (v: string) => void;
  onChangeRelationship: (v: string | null) => void;
};

export function WatchMeSheetAddForm({
  name,
  phone,
  relationship,
  onChangeName,
  onChangePhone,
  onChangeRelationship,
}: Props) {
  return (
    <View className='px-4'>
      <View className="gap-4 mt-4">
        <FormField label="Name">
          <AppInput
            placeholder="Enter"
            value={name}
            onChangeText={onChangeName}
          />
        </FormField>
        <FormField label="Phone number">
          <AppInput
            placeholder="Enter"
            value={phone}
            onChangeText={onChangePhone}
            keyboardType="phone-pad"
          />
        </FormField>
        <FormField label="Relationship (optional)">
          <InlineSelect
            options={RELATIONSHIP_OPTIONS}
            value={relationship}
            onChange={(v) => onChangeRelationship(v)}
            placeholder="Select"
            getIconForOption={(option, size, selected) => {
              const iconSize = size === 'large' ? 20 : 16;
              const commonProps = {
                width: iconSize,
                height: iconSize,
              } as const;

              switch (option.value) {
                case 'family':
                  return (
                    <SolarUsersGroupRoundedBoldIcon
                      {...commonProps}
                      color={selected ? '#0B63F6' : '#6B7280'}
                    />
                  );
                case 'friend':
                  return (
                    <SolarUserSpeakBoldIcon
                      {...commonProps}
                      color={selected ? '#0B63F6' : '#6B7280'}
                    />
                  );
                case 'work':
                  return (
                    <SolarFolderOpenBoldIcon
                      {...commonProps}
                      color={selected ? '#0B63F6' : '#6B7280'}
                    />
                  );
                default:
                  return (
                    <SolarInfoCircleBoldIcon
                      {...commonProps}
                      color={selected ? '#0B63F6' : '#6B7280'}
                    />
                  );
              }
            }}
          />
        </FormField>
      </View>
    </View>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View>
      <AppText className="font-metropolis-medium text-primaryDark dark:text-primaryDark-dark mb-3">
        {label}
      </AppText>
      {children}
    </View>
  );
}
