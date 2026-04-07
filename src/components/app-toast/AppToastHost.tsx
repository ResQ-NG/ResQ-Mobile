import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useAppToastStore,
  type AppToast,
} from '@/stores/app-toast-store';
import { AppToastView } from './AppToast';

function ToastRow({
  toast,
  marginTop,
}: {
  toast: AppToast;
  marginTop: number;
}) {
  const hideToast = useAppToastStore((s) => s.hideToast);
  const onClose = useCallback(() => {
    hideToast(toast.id);
  }, [hideToast, toast.id]);

  return (
    <View style={[styles.toastWrapper, marginTop > 0 && { marginTop }]}>
      <AppToastView toast={toast} onClose={onClose} />
    </View>
  );
}

export function AppToastHost() {
  const insets = useSafeAreaInsets();
  const toasts = useAppToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { paddingTop: insets.top + 12 }]}
    >
      {toasts.map((toast, index) => (
        <ToastRow
          key={toast.id}
          toast={toast}
          marginTop={index > 0 ? 8 : 0}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    alignItems: 'center',
    zIndex: 45,
  },
  toastWrapper: {
    width: '100%',
    alignItems: 'center',
  },
});
