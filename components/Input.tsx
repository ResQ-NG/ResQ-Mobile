import { StyleSheet, TextInput, TextInputProps, View, TouchableOpacity } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';

interface CustomInputProps extends TextInputProps {
  error?: string;
  type?: 'text' | 'password' | 'number';
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export const CustomInput = ({
  error,
  type = 'text',
  leftIcon,
  rightIcon,
  onRightIconPress,
  ...props
}: CustomInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputBackgroundColor = useThemeColor({}, 'background');
  const placeholderColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'icon');
  const iconColor = useThemeColor({}, 'text');

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getKeyboardType = () => {
    switch(type) {
      case 'number':
        return 'numeric';
      default:
        return 'default';
    }
  };

  return (
    <>
      <View style={styles.inputContainer}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={iconColor}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: inputBackgroundColor,
              color: placeholderColor,
              borderColor: 'rgba(0, 0, 0, 0.1)',
              paddingLeft: leftIcon ? 40 : 16,
              paddingRight: (type === 'password' || rightIcon) ? 40 : 16,
            }
          ]}
          placeholderTextColor={placeholderColor}
          secureTextEntry={type === 'password' && !isPasswordVisible}
          keyboardType={getKeyboardType()}
          {...props}
        />

        {type === 'password' && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={iconColor}
            />
          </TouchableOpacity>
        )}

        {rightIcon && type !== 'password' && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={iconColor}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
    top: 14,
    zIndex: 1,
  },
  errorText: {
    color: Colors.brandConstants.primaryRed,
    marginBottom: 8,
    fontSize: 12,
    alignSelf: 'flex-start'
  }
});
