import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  StyleProp,
} from 'react-native';
import { AeroColors, BorderRadius, Typography } from '@/constants/theme';

export interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  variant?: 'solid' | 'outline' | 'tint';
}

export function SecondaryButton({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  icon,
  variant = 'solid',
}: SecondaryButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return {
          button: styles.outlineButton,
          text: styles.outlineText,
        };
      case 'tint':
        return {
          button: styles.tintButton,
          text: styles.tintText,
        };
      case 'solid':
      default:
        return {
          button: styles.solidButton,
          text: styles.solidText,
        };
    }
  };

  const currentVariant = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.baseButton,
        currentVariant.button,
        disabled && styles.buttonDisabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'solid' ? AeroColors.pureWhite : AeroColors.deepTeal}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          <Text
            style={[
              styles.baseText,
              currentVariant.text,
              disabled && styles.textDisabled,
              textStyle,
            ]}>
            {title}
          </Text>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  solidButton: {
    backgroundColor: AeroColors.deepTeal,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: AeroColors.deepTeal,
  },
  tintButton: {
    backgroundColor: AeroColors.softTealTint,
  },
  buttonDisabled: {
    backgroundColor: AeroColors.outlineVariant,
    borderColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    ...Typography.labelLg,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  solidText: {
    color: AeroColors.pureWhite,
  },
  outlineText: {
    color: AeroColors.deepTeal,
  },
  tintText: {
    color: AeroColors.deepTeal,
  },
  textDisabled: {
    color: AeroColors.outline,
  },
  iconContainer: {
    marginLeft: 6,
  },
});

