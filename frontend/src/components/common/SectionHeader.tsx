import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { AeroColors, Typography, Spacing } from '@/constants/theme';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export function SectionHeader({
  title,
  subtitle,
  rightAction,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightAction ? <View style={styles.actionContainer}>{rightAction}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  textContainer: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  title: {
    ...Typography.headlineSm,
    color: AeroColors.deepTeal,
    letterSpacing: -0.2,
  },
  subtitle: {
    ...Typography.bodySm,
    color: AeroColors.mutedSage,
    marginTop: 2,
  },
  actionContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

