import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AeroColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';

export interface FeatureCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'white' | 'teal' | 'cream';
}

export function FeatureCard({
  children,
  style,
  variant = 'white',
}: FeatureCardProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'teal':
        return styles.tealCard;
      case 'cream':
        return styles.creamCard;
      case 'white':
      default:
        return styles.whiteCard;
    }
  };

  return (
    <View style={[styles.baseCard, getVariantStyle(), style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  baseCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.margin,
    overflow: 'hidden',
  },
  whiteCard: {
    backgroundColor: AeroColors.pureWhite,
    borderWidth: 1,
    borderColor: 'rgba(18, 59, 58, 0.06)',
    ...Shadows.level1,
  },
  tealCard: {
    backgroundColor: AeroColors.deepTeal,
    ...Shadows.level2,
  },
  creamCard: {
    backgroundColor: AeroColors.surface,
    borderWidth: 1,
    borderColor: 'rgba(18, 59, 58, 0.05)',
  },
});

