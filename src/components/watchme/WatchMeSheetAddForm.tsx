import { View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { AppInput, AppDropdown } from '@/components/ui';

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
        <FormField label="Relationship">
          <AppDropdown
            options={RELATIONSHIP_OPTIONS}
            value={relationship}
            onChange={onChangeRelationship}
            placeholder="Select"
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
