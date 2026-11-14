import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AeroColors, BorderRadius } from '@/constants/theme';

export interface BadmintonRacketProps {
  style?: ViewStyle;
  isCatching?: boolean;
}

export function BadmintonRacket({ style, isCatching = false }: BadmintonRacketProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Racket Head (Isometric Oval Frame) */}
      <View style={[styles.headFrame, isCatching && styles.headFrameCatching]}>
        {/* String Mesh - Vertical lines */}
        <View style={styles.meshContainer}>
          <View style={styles.stringVertical} />
          <View style={styles.stringVertical} />
          <View style={styles.stringVertical} />
        </View>

        {/* String Mesh - Horizontal lines */}
        <View style={styles.meshContainerHorizontal}>
          <View style={styles.stringHorizontal} />
          <View style={styles.stringHorizontal} />
        </View>

        {/* Sweet Spot Glow / Center Ring */}
        <View style={[styles.sweetSpot, isCatching && styles.sweetSpotCatching]} />
      </View>

      {/* T-Joint (Connecting Head to Shaft) */}
      <View style={styles.tJoint} />

      {/* Shaft (Aero Seafoam carbon fiber shaft) */}
      <View style={styles.shaft} />

      {/* Grip / Handle (Ergonomic wrapped handle) */}
      <View style={styles.handle}>
        <View style={styles.gripWrap} />
        <View style={styles.gripWrap} />
        <View style={styles.gripWrap} />
        <View style={styles.handleCap} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 64,
  },
  headFrame: {
    width: 58,
    height: 32,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: AeroColors.deepTeal,
    backgroundColor: 'rgba(224, 240, 234, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: AeroColors.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  headFrameCatching: {
    borderColor: AeroColors.seafoam,
    backgroundColor: 'rgba(101, 201, 184, 0.4)',
    transform: [{ scale: 1.08 }],
  },
  meshContainer: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    paddingHorizontal: 8,
  },
  stringVertical: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(135, 155, 148, 0.4)',
  },
  meshContainerHorizontal: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    paddingVertical: 5,
  },
  stringHorizontal: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(135, 155, 148, 0.4)',
  },
  sweetSpot: {
    width: 14,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(101, 201, 184, 0.4)',
    backgroundColor: 'transparent',
  },
  sweetSpotCatching: {
    backgroundColor: AeroColors.seafoam,
    borderColor: AeroColors.pureWhite,
  },
  tJoint: {
    width: 6,
    height: 4,
    backgroundColor: AeroColors.deepTeal,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  shaft: {
    width: 2.5,
    height: 16,
    backgroundColor: AeroColors.seafoam,
  },
  handle: {
    width: 7,
    height: 16,
    backgroundColor: AeroColors.darkSlate,
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 1,
  },
  gripWrap: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  handleCap: {
    width: 8,
    height: 2,
    backgroundColor: AeroColors.deepTeal,
    borderRadius: 1,
  },
});
