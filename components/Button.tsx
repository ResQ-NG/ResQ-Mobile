import { View, Text, TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { Typography } from '@/constants/Typography'

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function Button({
  title,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  style,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style
      ]}
      disabled={disabled}
      {...props}
    >
      <Text style={[
        styles.text,
        variant === 'primary' && styles.primaryText,
        variant === 'secondary' && styles.secondaryText,
        disabled && styles.disabledText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.brandConstants.primaryRed,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.brandConstants.primaryRed,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...Typography,
    fontWeight: '600',
  },
  primaryText: {
    color: Colors.brandConstants.primaryWhite,
  },
  secondaryText: {
    color: Colors.brandConstants.primaryRed,
  },
  disabledText: {
    color: Colors.brandConstants.primaryDullGray,
  }
})
