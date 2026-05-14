import type { ReactNode } from 'react';
import { View } from 'react-native';
import { AppText } from '@/components/ui/AppText';

export function GetStartedFormField({
  label,
  children,
  errorMessage,
}: {
  label: string;
  children: ReactNode;
  errorMessage?: string;
}) {
  return (
    <View>
      <AppText className="font-metropolis-medium text-primaryDark dark:text-primaryDark-dark mb-3">
        {label}
      </AppText>
      {children}
      {errorMessage ? (
        <AppText
          variant="caption"
          className="text-accent-red dark:text-accent-red-dark mt-2"
        >
          {errorMessage}
        </AppText>
      ) : null}
    </View>
  );
}
