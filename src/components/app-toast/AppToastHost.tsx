import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppToastStore } from '@/stores/app-toast-store';
import { AppToastView } from './AppToast';

export function AppToastHost() {
  const insets = useSafeAreaInsets();
  const toasts = useAppToastStore((state) => state.toasts);
  const hideToast = useAppToastStore((state) => state.hideToast);

  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { paddingTop: insets.top + 12 }]}
    >
      {toasts.map((toast, index) => (
        <View
          key={toast.id}
          style={[styles.toastWrapper, index > 0 && { marginTop: 8 }]}
        >
          <AppToastView toast={toast} onClose={() => hideToast(toast.id)} />
        </View>
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
