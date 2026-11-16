import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AeroColors } from '@/constants/theme';

export interface ShuttlecockItemProps {
  style?: ViewStyle;
}

export function ShuttlecockItem({ style }: ShuttlecockItemProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Upper Feather Skirt (Flared pure white feathers) */}
      <View style={styles.featherSkirt}>
        {/* Rib lines representing realistic goose feathers */}
        <View style={styles.featherRibLeft} />
        <View style={styles.featherRibCenter} />
        <View style={styles.featherRibRight} />

        {/* Retaining string / black binding tape band */}
        <View style={styles.bindingBandUpper} />
        <View style={styles.bindingBandLower} />
      </View>

      {/* Rounded Cork Base (High contrast bottom dome) */}
      <View style={styles.corkBase}>
        <View style={styles.corkGloss} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: AeroColors.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
  },
  featherSkirt: {
    width: 22,
    height: 18,
    backgroundColor: AeroColors.pureWhite,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
    borderWidth: 1,
    borderColor: 'rgba(38, 51, 49, 0.25)',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featherRibLeft: {
    position: 'absolute',
    left: 4,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(135, 155, 148, 0.45)',
    transform: [{ rotate: '-10deg' }],
  },
  featherRibCenter: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(135, 155, 148, 0.45)',
  },
  featherRibRight: {
    position: 'absolute',
    right: 4,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(135, 155, 148, 0.45)',
    transform: [{ rotate: '10deg' }],
  },
  bindingBandUpper: {
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(18, 59, 58, 0.45)',
  },
  bindingBandLower: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(18, 59, 58, 0.45)',
  },
  corkBase: {
    width: 13,
    height: 11,
    backgroundColor: AeroColors.deepTeal,
    borderBottomLeftRadius: 6.5,
    borderBottomRightRadius: 6.5,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    marginTop: -1,
    borderWidth: 1,
    borderColor: AeroColors.seafoam,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corkGloss: {
    width: 5,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 2,
    marginTop: 1,
  },
});

