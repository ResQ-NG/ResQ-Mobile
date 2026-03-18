import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { useThemeColors } from "@/context/ThemeContext";
import MingcuteCloseLineIcon from "@/components/icons/mingcute/close-line";

export interface BottomSheetHeaderProps {
  title: string;
  description?: string;
  onClose: () => void;
  hideCloseButton?: boolean;
}

export function BottomSheetHeader({
  title,
  description,
  onClose,
  hideCloseButton = false,
}: BottomSheetHeaderProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText
          className="font-metropolis-bold text-lg text-primaryDark dark:text-primaryDark-dark"
          numberOfLines={2}
        >
          {title}
        </AppText>
        {description && (
          <AppText className="text-sm text-captionDark dark:text-captionDark-dark mt-0.5">
            {description}
          </AppText>
        )}
      </View>

      {!hideCloseButton && (
        <TouchableOpacity
          onPress={onClose}
          hitSlop={12}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={[
            styles.closeButton,
            { backgroundColor: colors.surfaceBackground },
          ]}
        >
          <MingcuteCloseLineIcon
            width={18}
            height={18}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingBottom: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
