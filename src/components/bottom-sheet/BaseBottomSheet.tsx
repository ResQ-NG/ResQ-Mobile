import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetFooter,
  type BottomSheetBackdropProps,
  type BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useState,
  type ReactNode,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Platform,
  type StyleProp,
  type ViewStyle,
  View,
  StyleSheet,
} from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetHeader } from './ui/Header';
import { useThemeColors } from '@/context/ThemeContext';

export interface BaseBottomSheetProps {
  children: ReactNode;
  title?: string;
  description?: string;
  snapPoints?: (string | number)[];
  initialIndex?: number;
  isOpen?: boolean;
  onClose?: () => void;
  onSnapIndexChange?: (index: number) => void;
  enableDynamicSizing?: boolean;
  enablePanDownToClose?: boolean;
  backdropOpacity?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  handleIndicatorStyle?: StyleProp<ViewStyle>;
  showHeader?: boolean;
  contentPadding?: {
    horizontal?: number;
    top?: number;
    bottom?: number;
  };
  footer?: ReactNode;
  customHeader?: ReactNode | ((onClose: () => void) => ReactNode);
  hideCloseButton?: boolean;
}

export interface BaseBottomSheetRef {
  present: () => void;
  dismiss: () => void;
  snapToIndex: (index: number) => void;
}

export const BaseBottomSheet = forwardRef<
  BaseBottomSheetRef,
  BaseBottomSheetProps
>(
  (
    {
      children,
      title,
      description,
      snapPoints: customSnapPoints,
      initialIndex = 0,
      isOpen = false,
      onClose,
      onSnapIndexChange,
      enableDynamicSizing = false,
      enablePanDownToClose = true,
      backdropOpacity = 0.5,
      contentContainerStyle,
      handleIndicatorStyle,
      showHeader,
      contentPadding = { horizontal: 16, top: 16, bottom: 16 },
      footer,
      customHeader,
      hideCloseButton = false,
    },
    ref
  ) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [snapIndex, setSnapIndex] = useState(initialIndex);
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();

    const snapPoints = useMemo(() => {
      if (enableDynamicSizing) {
        return customSnapPoints || [];
      }
      return customSnapPoints || ['50%', '75%'];
    }, [customSnapPoints, enableDynamicSizing]);

    const effectiveIndex = enableDynamicSizing ? 0 : snapIndex;

    useImperativeHandle(ref, () => ({
      present: () => {
        setSnapIndex(initialIndex);
        bottomSheetModalRef.current?.present();
      },
      dismiss: () => {
        bottomSheetModalRef.current?.dismiss();
      },
      snapToIndex: (index: number) => {
        bottomSheetModalRef.current?.snapToIndex(index);
      },
    }));

    useEffect(() => {
      if (isOpen) {
        setSnapIndex(initialIndex);
        bottomSheetModalRef.current?.present();
      } else {
        bottomSheetModalRef.current?.dismiss();
      }
    }, [isOpen, initialIndex]);

    const handleSheetChanges = useCallback(
      (index: number) => {
        setSnapIndex(index);
        onSnapIndexChange?.(index);
        if (index === -1) {
          onClose?.();
        }
      },
      [onClose, onSnapIndexChange]
    );

    const handleClose = useCallback(() => {
      onClose?.();
      bottomSheetModalRef.current?.dismiss();
    }, [onClose]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={backdropOpacity}
        />
      ),
      [backdropOpacity]
    );

    const renderFooter = useCallback(
      (props: BottomSheetFooterProps) => {
        if (!footer) return null;

        return (
          <BottomSheetFooter
            {...props}
            bottomInset={insets.bottom}
            style={{ zIndex: 1, elevation: 1 }}
          >
            <View
              style={[
                styles.footerContainer,
                { backgroundColor: colors.backgroundColor },
              ]}
            >
              {footer}
            </View>
          </BottomSheetFooter>
        );
      },
      [footer, insets.bottom, colors.backgroundColor]
    );

    const shouldShowHeader = customHeader
      ? true
      : showHeader !== undefined
        ? showHeader
        : !!title;

    const renderHeader = () => {
      if (customHeader) {
        if (typeof customHeader === 'function') {
          return customHeader(handleClose);
        }
        return customHeader;
      }

      if (shouldShowHeader && title) {
        return (
          <BottomSheetHeader
            title={title}
            description={description}
            onClose={hideCloseButton ? () => {} : handleClose}
            hideCloseButton={hideCloseButton}
          />
        );
      }

      return null;
    };

    const horizontalPadding = contentPadding.horizontal ?? 16;
    const topPadding = contentPadding.top ?? 16;

    const footerHeight = footer ? 72 + insets.bottom : 0;
    const baseBottomPadding = contentPadding.bottom ?? 16;
    const bottomPadding = footer
      ? Math.max(baseBottomPadding, footerHeight + 16)
      : baseBottomPadding;

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        index={effectiveIndex}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={enableDynamicSizing}
        enablePanDownToClose={enablePanDownToClose}
        enableDismissOnClose
        android_keyboardInputMode="adjustResize"
        handleIndicatorStyle={
          handleIndicatorStyle || {
            backgroundColor: colors.avatarBorder,
            width: 80,
          }
        }
        backgroundStyle={{
          backgroundColor: colors.backgroundColor,
        }}
        containerComponent={
          Platform.OS === 'ios'
            ? (FullWindowOverlay as unknown as React.ComponentType<{
                children?: ReactNode;
              }>)
            : undefined
        }
        footerComponent={footer ? renderFooter : undefined}
      >
        <BottomSheetView style={styles.bottomSheetView}>
          {shouldShowHeader && (
            <View
              style={[
                styles.headerContainer,
                {
                  paddingHorizontal: horizontalPadding,
                  paddingTop: topPadding,
                },
              ]}
            >
              {renderHeader()}
            </View>
          )}

          <View
            style={[
              styles.scrollViewWrapper,
              footer ? { marginBottom: footerHeight } : undefined,
            ]}
          >
            <BottomSheetScrollView
              style={styles.scrollView}
              contentContainerStyle={[
                styles.scrollContent,
                {
                  paddingHorizontal: horizontalPadding,
                  paddingTop: shouldShowHeader ? 0 : topPadding,
                  paddingBottom: bottomPadding,
                },
                contentContainerStyle,
              ]}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              bounces={true}
              overScrollMode="auto"
            >
              {children}
            </BottomSheetScrollView>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

BaseBottomSheet.displayName = 'BaseBottomSheet';

const styles = StyleSheet.create({
  bottomSheetView: {
    flex: 1,
    overflow: 'visible',
  },
  headerContainer: {
    marginBottom: 0,
  },
  scrollViewWrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
    overflow: 'visible',
  },
  footerContainer: {
    paddingTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    zIndex: -1,
    elevation: 0,
  },
});
