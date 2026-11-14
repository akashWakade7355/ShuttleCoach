import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { AeroColors, BorderRadius, Spacing, Typography } from '@/constants/theme';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function EmptyState({
  title,
  description,
  icon,
  children,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerRow}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        {icon ? <View style={styles.iconCircle}>{icon}</View> : null}
      </View>
      {children ? <View style={styles.childrenContainer}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AeroColors.pureWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.margin,
    borderWidth: 1,
    borderColor: 'rgba(18, 59, 58, 0.06)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  title: {
    ...Typography.headlineSm,
    color: AeroColors.deepTeal,
  },
  description: {
    ...Typography.bodySm,
    color: AeroColors.mutedSage,
    marginTop: 4,
    lineHeight: 18,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: AeroColors.softTealTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  childrenContainer: {
    marginTop: Spacing.md,
  },
});

