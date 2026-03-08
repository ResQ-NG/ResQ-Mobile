import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { SvgXml, type SvgProps } from "react-native-svg";
import { AppText } from "@/components/ui/AppText";
import { useThemeColors } from "@/context/ThemeContext";

function CloseIcon(props: Omit<SvgProps, "xml">) {
  const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"/></svg>`;
  return <SvgXml xml={xml} {...props} />;
}

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
          <CloseIcon
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
