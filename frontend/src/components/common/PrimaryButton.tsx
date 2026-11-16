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

export interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function PrimaryButton({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  icon,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}>
      {loading ? (
        <ActivityIndicator color={AeroColors.darkSlate} size="small" />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.text, disabled && styles.textDisabled, textStyle]}>
            {title}
          </Text>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    backgroundColor: AeroColors.seafoam,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    shadowColor: AeroColors.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: AeroColors.outlineVariant,
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Typography.labelLg,
    color: AeroColors.darkSlate,
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  textDisabled: {
    color: AeroColors.outline,
  },
  iconContainer: {
    marginLeft: 8,
  },
});

