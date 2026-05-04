import type { ReactNode } from 'react';
import type { KeyboardTypeOptions, TextInputProps } from 'react-native';
import { View, ActivityIndicator } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { AppInput, InlineSelect, type InlineSelectOption } from '@/components/ui';

type Props = {
  name: string;
  contact: string;
  relationship: string | null;
  onChangeName: (v: string) => void;
  onChangeContact: (v: string) => void;
  onChangeRelationship: (v: string | null) => void;
  relationshipOptions: InlineSelectOption[];
  relationshipsLoading?: boolean;
  contactFieldLabel: string;
  contactPlaceholder: string;
  contactKeyboardType: KeyboardTypeOptions;
  contactTextContentType: TextInputProps['textContentType'];
  contactAutoCorrect?: boolean;
  /** Shown under the email/phone field (e.g. invalid hint). */
  contactHint?: string | null;
  contactLeftIcon?: ReactNode;
};

export function WatchMeSheetAddForm({
  name,
  contact,
  relationship,
  onChangeName,
  onChangeContact,
  onChangeRelationship,
  relationshipOptions,
  relationshipsLoading,
  contactFieldLabel,
  contactPlaceholder,
  contactKeyboardType,
  contactTextContentType,
  contactAutoCorrect = true,
  contactHint,
  contactLeftIcon,
}: Props) {
  return (
    <View className="px-4">
      <View className="gap-4 mt-4">
        <FormField label="Name">
          <AppInput
            placeholder="Enter"
            value={name}
            onChangeText={onChangeName}
          />
        </FormField>
        <FormField label={contactFieldLabel}>
          <AppInput
            placeholder={contactPlaceholder}
            value={contact}
            onChangeText={onChangeContact}
            keyboardType={contactKeyboardType}
            textContentType={contactTextContentType}
            autoCapitalize="none"
            autoCorrect={contactAutoCorrect}
            leftIcon={contactLeftIcon}
          />
          {contactHint ? (
            <AppText className="text-xs text-captionDark dark:text-captionDark-dark mt-2 px-0.5">
              {contactHint}
            </AppText>
          ) : null}
        </FormField>
        <FormField label="Relationship">
          {relationshipsLoading ? (
            <View className="min-h-[48px] items-center justify-center rounded-full border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]">
              <ActivityIndicator />
            </View>
          ) : relationshipOptions.length === 0 ? (
            <AppText className="text-sm text-captionDark dark:text-captionDark-dark">
              Could not load relationship options. Try again later.
            </AppText>
          ) : (
            <InlineSelect
              options={relationshipOptions}
              value={relationship}
              onChange={(v) => onChangeRelationship(v)}
              placeholder="Select"
            />
          )}
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
