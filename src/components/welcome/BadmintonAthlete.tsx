import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

export type AthletePose = 'ready' | 'lunge-right' | 'lunge-left' | 'recover';

export interface BadmintonAthleteProps {
  pose: AthletePose;
  style?: ViewStyle;
}

export function BadmintonAthlete({ pose, style }: BadmintonAthleteProps) {
  const isLungeRight = pose === 'lunge-right';
  const isLungeLeft = pose === 'lunge-left';
  const isLunge = isLungeRight || isLungeLeft;

  return (
    <View style={[styles.container, style]}>
      {/* Motion Trails (Only during lunge) */}
      {isLunge && (
        <>
          <View
            style={[
              styles.motionGhost,
              styles.motionGhostFar,
              isLungeLeft ? styles.motionGhostLeftFar : styles.motionGhostRightFar,
            ]}>
            <View style={styles.ghostTorso} />
            <View style={styles.ghostLeg} />
          </View>
          <View
            style={[
              styles.motionGhost,
              styles.motionGhostNear,
              isLungeLeft ? styles.motionGhostLeftNear : styles.motionGhostRightNear,
            ]}>
            <View style={styles.ghostTorso} />
            <View style={styles.ghostLeg} />
          </View>
        </>
      )}

      {/* Racket (Rendered on appropriate side) */}
      {isLungeRight ? (
        <View style={styles.racketLungeRight}>
          <View style={styles.racketHeadLunge} />
          <View style={styles.racketShaftLunge} />
        </View>
      ) : isLungeLeft ? (
        <View style={styles.racketLungeLeft}>
          <View style={styles.racketHeadLunge} />
          <View style={styles.racketShaftLunge} />
        </View>
      ) : (
        <View style={styles.racketReady}>
          <View style={styles.racketHeadReady} />
          <View style={styles.racketShaftReady} />
        </View>
      )}

      {/* Head & Hair */}
      <View style={[styles.headWrapper, isLungeRight && styles.headLungeRight, isLungeLeft && styles.headLungeLeft]}>
        <View style={styles.head}>
          <View style={styles.headband} />
        </View>
      </View>

      {/* Upper Body (Warm-White Jersey) */}
      <View style={[styles.torsoWrapper, isLungeRight && styles.torsoLungeRight, isLungeLeft && styles.torsoLungeLeft]}>
        <View style={styles.jersey}>
          <View style={styles.jerseyCollar} />
          <View style={styles.jerseyStripe} />
        </View>

        {/* Arms */}
        {isLungeRight ? (
          <>
            {/* Extended Right Striking Arm */}
            <View style={styles.leadArmRight} />
            {/* Trailing Left Balance Arm */}
            <View style={styles.trailArmRight} />
          </>
        ) : isLungeLeft ? (
          <>
            {/* Extended Left Striking Arm */}
            <View style={styles.leadArmLeft} />
            {/* Trailing Right Balance Arm */}
            <View style={styles.trailArmLeft} />
          </>
        ) : (
          <>
            {/* Ready Stance Bent Arms */}
            <View style={styles.readyArmRight} />
            <View style={styles.readyArmLeft} />
          </>
        )}
      </View>

      {/* Lower Body (Navy Shorts) */}
      <View style={[styles.shortsWrapper, isLungeRight && styles.shortsLungeRight, isLungeLeft && styles.shortsLungeLeft]}>
        {isLunge ? (
          <View style={styles.shortsLungeContainer}>
            <View style={[styles.shortsLegLead, isLungeLeft && styles.shortsLegLeadLeft]} />
            <View style={[styles.shortsLegTrail, isLungeLeft && styles.shortsLegTrailLeft]} />
          </View>
        ) : (
          <View style={styles.shortsReadyContainer}>
            <View style={styles.shortsLegReady} />
            <View style={styles.shortsLegReady} />
          </View>
        )}
      </View>

      {/* Legs & Shoes */}
      <View style={styles.legsWrapper}>
        {isLungeRight ? (
          // Right Corner Lunge: Deep bent front right leg, extended trailing left leg
          <View style={styles.lungeLegsRow}>
            {/* Trailing Extended Left Leg */}
            <View style={styles.trailingLegLeft}>
              <View style={styles.thighTrailing} />
              <View style={styles.calfTrailing} />
              <View style={styles.shoeTrailing} />
            </View>
            {/* Lead Bent Right Leg */}
            <View style={styles.leadLegRight}>
              <View style={styles.thighLead} />
              <View style={styles.calfLead} />
              <View style={styles.shoeLead} />
            </View>
          </View>
        ) : isLungeLeft ? (
          // Left Corner Lunge: Deep bent front left leg, extended trailing right leg
          <View style={styles.lungeLegsRow}>
            {/* Lead Bent Left Leg */}
            <View style={styles.leadLegLeft}>
              <View style={styles.thighLead} />
              <View style={styles.calfLead} />
              <View style={styles.shoeLead} />
            </View>
            {/* Trailing Extended Right Leg */}
            <View style={styles.trailingLegRight}>
              <View style={styles.thighTrailing} />
              <View style={styles.calfTrailing} />
              <View style={styles.shoeTrailing} />
            </View>
          </View>
        ) : (
          // Ready Stance: Athletic bent knees, shoulder-width apart
          <View style={styles.readyLegsRow}>
            <View style={styles.readyLegLeft}>
              <View style={styles.readyThigh} />
              <View style={styles.readyCalf} />
              <View style={styles.readyShoe} />
            </View>
            <View style={styles.readyLegRight}>
              <View style={styles.readyThigh} />
              <View style={styles.readyCalf} />
              <View style={styles.readyShoe} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 96,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },

  // Motion Trails
  motionGhost: {
    position: 'absolute',
    width: 48,
    height: 60,
    top: 10,
    zIndex: 1,
  },
  motionGhostFar: {
    opacity: 0.16,
  },
  motionGhostNear: {
    opacity: 0.32,
  },
  motionGhostRightFar: {
    left: -24,
    transform: [{ scale: 0.82 }],
  },
  motionGhostRightNear: {
    left: -12,
    transform: [{ scale: 0.9 }],
  },
  motionGhostLeftFar: {
    right: -24,
    transform: [{ scale: 0.82 }],
  },
  motionGhostLeftNear: {
    right: -12,
    transform: [{ scale: 0.9 }],
  },
  ghostTorso: {
    width: 24,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  ghostLeg: {
    width: 14,
    height: 22,
    borderRadius: 3,
    backgroundColor: '#0D1B2A',
    marginTop: 2,
  },

  // Head
  headWrapper: {
    alignItems: 'center',
    zIndex: 10,
  },
  headLungeRight: {
    transform: [{ translateX: 8 }, { rotate: '12deg' }],
  },
  headLungeLeft: {
    transform: [{ translateX: -8 }, { rotate: '-12deg' }],
  },
  head: {
    width: 18,
    height: 20,
    borderRadius: 9,
    backgroundColor: '#E5A982',
    position: 'relative',
    overflow: 'hidden',
  },
  headband: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#A9F5B6',
  },

  // Torso / Jersey (Warm-White)
  torsoWrapper: {
    alignItems: 'center',
    marginTop: 1,
    zIndex: 9,
    position: 'relative',
  },
  torsoLungeRight: {
    transform: [{ translateX: 10 }, { rotate: '16deg' }],
  },
  torsoLungeLeft: {
    transform: [{ translateX: -10 }, { rotate: '-16deg' }],
  },
  jersey: {
    width: 28,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#F5F0E6',
    borderWidth: 1,
    borderColor: '#E2DDD2',
    position: 'relative',
    overflow: 'hidden',
  },
  jerseyCollar: {
    position: 'absolute',
    top: 0,
    left: 7,
    width: 14,
    height: 4,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#0D1B2A',
  },
  jerseyStripe: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#0D1B2A',
  },

  // Arms: Ready Stance
  readyArmRight: {
    position: 'absolute',
    top: 4,
    right: -10,
    width: 12,
    height: 14,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 3,
    backgroundColor: '#E5A982',
    transform: [{ rotate: '-35deg' }],
  },
  readyArmLeft: {
    position: 'absolute',
    top: 4,
    left: -10,
    width: 12,
    height: 14,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 3,
    backgroundColor: '#E5A982',
    transform: [{ rotate: '35deg' }],
  },

  // Arms: Lunge Right
  leadArmRight: {
    position: 'absolute',
    top: 6,
    right: -24,
    width: 26,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5A982',
    transform: [{ rotate: '-14deg' }],
  },
  trailArmRight: {
    position: 'absolute',
    top: 8,
    left: -14,
    width: 16,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#E5A982',
    transform: [{ rotate: '-45deg' }],
  },

  // Arms: Lunge Left
  leadArmLeft: {
    position: 'absolute',
    top: 6,
    left: -24,
    width: 26,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5A982',
    transform: [{ rotate: '14deg' }],
  },
  trailArmLeft: {
    position: 'absolute',
    top: 8,
    right: -14,
    width: 16,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#E5A982',
    transform: [{ rotate: '45deg' }],
  },

  // Rackets
  racketReady: {
    position: 'absolute',
    top: -12,
    right: -18,
    zIndex: 15,
  },
  racketHeadReady: {
    width: 22,
    height: 28,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#A9F5B6',
    backgroundColor: 'rgba(169, 245, 182, 0.25)',
  },
  racketShaftReady: {
    width: 2,
    height: 16,
    backgroundColor: '#FFFFFF',
    marginLeft: 10,
  },

  racketLungeRight: {
    position: 'absolute',
    top: -4,
    right: -42,
    zIndex: 15,
    transform: [{ rotate: '45deg' }],
  },
  racketLungeLeft: {
    position: 'absolute',
    top: -4,
    left: -42,
    zIndex: 15,
    transform: [{ rotate: '-45deg' }],
  },
  racketHeadLunge: {
    width: 22,
    height: 28,
    borderRadius: 11,
    borderWidth: 2.5,
    borderColor: '#A9F5B6',
    backgroundColor: 'rgba(169, 245, 182, 0.35)',
  },
  racketShaftLunge: {
    width: 2,
    height: 18,
    backgroundColor: '#FFFFFF',
    marginLeft: 10,
  },

  // Shorts (Navy)
  shortsWrapper: {
    alignItems: 'center',
    zIndex: 8,
  },
  shortsLungeRight: {
    transform: [{ translateX: 6 }],
  },
  shortsLungeLeft: {
    transform: [{ translateX: -6 }],
  },
  shortsReadyContainer: {
    flexDirection: 'row',
    gap: 2,
    width: 28,
    height: 16,
    justifyContent: 'space-between',
  },
  shortsLegReady: {
    width: 13,
    height: 16,
    backgroundColor: '#0D1B2A',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  shortsLungeContainer: {
    flexDirection: 'row',
    width: 36,
    height: 16,
    justifyContent: 'space-between',
  },
  shortsLegLead: {
    width: 17,
    height: 16,
    backgroundColor: '#0D1B2A',
    transform: [{ rotate: '20deg' }],
  },
  shortsLegTrail: {
    width: 15,
    height: 16,
    backgroundColor: '#0D1B2A',
    transform: [{ rotate: '-35deg' }],
  },
  shortsLegLeadLeft: {
    transform: [{ rotate: '-20deg' }],
  },
  shortsLegTrailLeft: {
    transform: [{ rotate: '35deg' }],
  },

  // Legs & Shoes: Ready Stance
  legsWrapper: {
    width: '100%',
    alignItems: 'center',
    zIndex: 7,
  },
  readyLegsRow: {
    flexDirection: 'row',
    width: 32,
    justifyContent: 'space-between',
  },
  readyLegLeft: {
    alignItems: 'center',
  },
  readyLegRight: {
    alignItems: 'center',
  },
  readyThigh: {
    width: 8,
    height: 12,
    backgroundColor: '#E5A982',
  },
  readyCalf: {
    width: 7,
    height: 12,
    backgroundColor: '#E5A982',
  },
  readyShoe: {
    width: 12,
    height: 6,
    backgroundColor: '#DDA15E',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },

  // Legs & Shoes: Lunge
  lungeLegsRow: {
    flexDirection: 'row',
    width: 68,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: -2,
  },
  leadLegRight: {
    alignItems: 'center',
    transform: [{ translateX: 2 }],
  },
  trailingLegLeft: {
    alignItems: 'center',
    transform: [{ rotate: '-35deg' }, { translateY: 4 }, { translateX: -4 }],
  },
  leadLegLeft: {
    alignItems: 'center',
    transform: [{ translateX: -2 }],
  },
  trailingLegRight: {
    alignItems: 'center',
    transform: [{ rotate: '35deg' }, { translateY: 4 }, { translateX: 4 }],
  },
  thighLead: {
    width: 10,
    height: 14,
    backgroundColor: '#E5A982',
    transform: [{ rotate: '15deg' }],
  },
  calfLead: {
    width: 9,
    height: 14,
    backgroundColor: '#E5A982',
  },
  shoeLead: {
    width: 16,
    height: 7,
    backgroundColor: '#DDA15E',
    borderRadius: 2,
    borderRightWidth: 3,
    borderRightColor: '#A9F5B6',
  },
  thighTrailing: {
    width: 8,
    height: 16,
    backgroundColor: '#E5A982',
  },
  calfTrailing: {
    width: 7,
    height: 16,
    backgroundColor: '#E5A982',
  },
  shoeTrailing: {
    width: 14,
    height: 6,
    backgroundColor: '#DDA15E',
    borderRadius: 2,
  },
});

