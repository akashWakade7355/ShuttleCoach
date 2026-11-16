import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import { BadmintonAthlete, AthletePose } from './BadmintonAthlete';

export type WelcomeCourtState = 'ready' | 'lunge-right' | 'lunge-left' | 'recover';

export interface ElevatedBadmintonCourtProps {
  /** Optional controlled state to force a specific posture (for storyboard) */
  forcedState?: WelcomeCourtState;
  /** Callback fired whenever the interaction state changes */
  onStateChange?: (state: WelcomeCourtState, hint: string) => void;
  /** Interactive mode enabled (defaults to true) */
  interactive?: boolean;
}

export function ElevatedBadmintonCourt({
  forcedState,
  onStateChange,
  interactive = true,
}: ElevatedBadmintonCourtProps) {
  // Current internal animation state
  const [activeState, setActiveState] = useState<WelcomeCourtState>(forcedState || 'ready');
  const [activeTarget, setActiveTarget] = useState<'right' | 'left' | null>(null);

  // Position animated values for the athlete
  const athleteX = useRef(new Animated.Value(0)).current;
  const athleteY = useRef(new Animated.Value(0)).current;

  // Pulse animation for initial attention (front-right corner)
  const initialPulse = useRef(new Animated.Value(0)).current;
  const initialPulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  // Recovery pulse for the centre base marker
  const centrePulse = useRef(new Animated.Value(0)).current;

  // Active corner glow scale
  const rightCornerGlow = useRef(new Animated.Value(1)).current;
  const leftCornerGlow = useRef(new Animated.Value(1)).current;

  // Respect reduced motion
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => setReduceMotion(enabled))
      .catch(() => {});
  }, []);

  // Sync with forcedState if provided (for storyboard or preview mode)
  useEffect(() => {
    if (forcedState) {
      applyState(forcedState, false);
    }
  }, [forcedState]);

  // Initial front-right pulsing halo to guide user's first tap
  useEffect(() => {
    if (reduceMotion) return;

    initialPulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(initialPulse, {
          toValue: 1,
          duration: 1600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(initialPulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    if (activeState === 'ready') {
      initialPulseLoop.current.start();
    }

    return () => {
      initialPulseLoop.current?.stop();
    };
  }, [activeState, reduceMotion]);

  // Apply a specific state with animations
  const applyState = (targetState: WelcomeCourtState, animate: boolean = true) => {
    setActiveState(targetState);

    const duration = reduceMotion ? 100 : animate ? 320 : 0;

    if (targetState === 'ready') {
      setActiveTarget(null);
      Animated.parallel([
        Animated.spring(athleteX, {
          toValue: 0,
          tension: 70,
          friction: 9,
          useNativeDriver: true,
        }),
        Animated.spring(athleteY, {
          toValue: 0,
          tension: 70,
          friction: 9,
          useNativeDriver: true,
        }),
      ]).start();
      onStateChange?.('ready', 'Tap a corner');
    } else if (targetState === 'lunge-right') {
      setActiveTarget('right');
      initialPulseLoop.current?.stop();
      Animated.parallel([
        Animated.spring(athleteX, {
          toValue: 80,
          tension: 75,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(athleteY, {
          toValue: -75,
          tension: 75,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(rightCornerGlow, {
            toValue: 1.35,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(rightCornerGlow, {
            toValue: 1.15,
            duration: 180,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
      onStateChange?.('lunge-right', 'Front-right corner lunge');
    } else if (targetState === 'lunge-left') {
      setActiveTarget('left');
      initialPulseLoop.current?.stop();
      Animated.parallel([
        Animated.spring(athleteX, {
          toValue: -80,
          tension: 75,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(athleteY, {
          toValue: -75,
          tension: 75,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(leftCornerGlow, {
            toValue: 1.35,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(leftCornerGlow, {
            toValue: 1.15,
            duration: 180,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
      onStateChange?.('lunge-left', 'Front-left corner lunge');
    } else if (targetState === 'recover') {
      setActiveTarget(null);
      // Return to centre, then trigger single centre pulse
      Animated.parallel([
        Animated.spring(athleteX, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.spring(athleteY, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(rightCornerGlow, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(leftCornerGlow, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Trigger centre marker pulse once
        centrePulse.setValue(0);
        Animated.timing(centrePulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();

        setActiveState('ready');
        onStateChange?.('recover', 'Try the other corner.');
      });
    }
  };

  // Corner Tap Handler: Lunge -> Hold -> Recover -> Try other corner
  const handleCornerPress = (corner: 'right' | 'left') => {
    if (!interactive) return;

    const targetState: WelcomeCourtState = corner === 'right' ? 'lunge-right' : 'lunge-left';
    applyState(targetState, true);

    // After reaching corner, automatically recover to centre
    setTimeout(() => {
      applyState('recover', true);
    }, 1100);
  };

  // Interpolate initial pulse halo (front right)
  const pulseScale = initialPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.2],
  });
  const pulseOpacity = initialPulse.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.75, 0.4, 0],
  });

  // Interpolate centre recovery pulse
  const centrePulseScale = centrePulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.8],
  });
  const centrePulseOpacity = centrePulse.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.8, 0.4, 0],
  });

  return (
    <View style={styles.outerContainer}>
      {/* Elevated Badminton Court Container */}
      <View style={styles.courtSurface}>
        {/* ================================================================= */}
        {/* 1. Badminton Net Across the Front                                 */}
        {/* ================================================================= */}
        <View style={styles.netContainer}>
          <View style={styles.netPostLeft} />
          <View style={styles.netTape} />
          <View style={styles.netMeshRow}>
            {Array.from({ length: 18 }).map((_, i) => (
              <View key={`mesh-${i}`} style={styles.netMeshLine} />
            ))}
          </View>
          <View style={styles.netPostRight} />
        </View>

        {/* ================================================================= */}
        {/* 2. Soft Ice Blue Court Lines                                      */}
        {/* ================================================================= */}
        <View style={styles.courtBoundary}>
          {/* Singles Sidelines */}
          <View style={styles.singlesLineLeft} />
          <View style={styles.singlesLineRight} />

          {/* Short Service Line (Front) */}
          <View style={styles.shortServiceLine}>
            <View style={styles.serviceLineAccent} />
          </View>

          {/* Centre Line (Dividing Left & Right Half-Court) */}
          <View style={styles.centreLine} />

          {/* Doubles Long Service Line (Back) */}
          <View style={styles.doublesLongServiceLine} />

          {/* Back Boundary Line */}
          <View style={styles.backBoundaryLine} />

          {/* Subtle Court Texture Grid Accents */}
          <View style={styles.courtGridOverlay} />
        </View>

        {/* ================================================================= */}
        {/* 3. Base 0: Centre Marker & Recovery Pulse Wave                   */}
        {/* ================================================================= */}
        <View style={styles.centreBaseMarkerContainer}>
          {/* Expanding Single Pulse Wave on Recovery */}
          <Animated.View
            style={[
              styles.centrePulseWave,
              {
                transform: [{ scale: centrePulseScale }],
                opacity: centrePulseOpacity,
              },
            ]}
          />
          <View style={styles.centreBaseDot}>
            <View style={styles.centreBaseCrossH} />
            <View style={styles.centreBaseCrossV} />
          </View>
          <Text style={styles.baseLabel}>BASE 0</Text>
        </View>

        {/* ================================================================= */}
        {/* 4. Interactive Front Corners (Position 1 & Position 2)            */}
        {/* ================================================================= */}
        {/* Front-Left Corner (Pos 1) */}
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!interactive}
          onPress={() => handleCornerPress('left')}
          style={styles.frontLeftMarkerTouch}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          accessibilityRole="button"
          accessibilityLabel="Front-left badminton corner">
          <Animated.View
            style={[
              styles.cornerMarkerCircle,
              activeTarget === 'left' && styles.cornerMarkerActive,
              { transform: [{ scale: leftCornerGlow }] },
            ]}>
            <View style={styles.markerInnerDot} />
          </Animated.View>
          <Text style={styles.cornerLabel}>NET L</Text>
        </TouchableOpacity>

        {/* Front-Right Corner (Pos 2 - Features Soft Mint Pulse on Open) */}
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!interactive}
          onPress={() => handleCornerPress('right')}
          style={styles.frontRightMarkerTouch}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          accessibilityRole="button"
          accessibilityLabel="Front-right badminton corner">
          {/* Looping Mint Pulse Halo (Draws attention to first tap) */}
          <Animated.View
            style={[
              styles.pulseHalo,
              {
                transform: [{ scale: pulseScale }],
                opacity: pulseOpacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.cornerMarkerCircle,
              styles.cornerMarkerRight,
              activeTarget === 'right' && styles.cornerMarkerActive,
              { transform: [{ scale: rightCornerGlow }] },
            ]}>
            <View style={styles.markerInnerDot} />
          </Animated.View>
          <Text style={styles.cornerLabel}>NET R</Text>
        </TouchableOpacity>

        {/* ================================================================= */}
        {/* 5. Illustrated Badminton Athlete                                 */}
        {/* ================================================================= */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.athleteContainer,
            {
              transform: [
                { translateX: athleteX },
                { translateY: athleteY },
              ],
            },
          ]}>
          <BadmintonAthlete pose={activeState as AthletePose} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  courtSurface: {
    width: 324,
    height: 300,
    borderRadius: 20,
    backgroundColor: 'rgba(7, 90, 97, 0.42)',
    borderWidth: 1.5,
    borderColor: 'rgba(188, 234, 255, 0.35)',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },

  // 1. Badminton Net Across Front
  netContainer: {
    position: 'absolute',
    top: 14,
    left: 12,
    right: 12,
    height: 18,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  netPostLeft: {
    width: 5,
    height: 18,
    borderRadius: 2.5,
    backgroundColor: '#BCEAFF',
  },
  netPostRight: {
    width: 5,
    height: 18,
    borderRadius: 2.5,
    backgroundColor: '#BCEAFF',
  },
  netTape: {
    position: 'absolute',
    top: 0,
    left: 4,
    right: 4,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
  },
  netMeshRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    height: 14,
    marginTop: 2,
  },
  netMeshLine: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(188, 234, 255, 0.35)',
  },

  // 2. Soft Ice Blue Court Lines
  courtBoundary: {
    position: 'absolute',
    top: 32,
    left: 20,
    right: 20,
    bottom: 24,
    borderWidth: 2,
    borderColor: '#BCEAFF',
    borderRadius: 8,
    backgroundColor: 'rgba(18, 59, 58, 0.45)',
  },
  courtGridOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(22, 73, 205, 0.08)',
  },
  singlesLineLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 18,
    width: 1.5,
    backgroundColor: 'rgba(188, 234, 255, 0.65)',
  },
  singlesLineRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 18,
    width: 1.5,
    backgroundColor: 'rgba(188, 234, 255, 0.65)',
  },
  shortServiceLine: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#BCEAFF',
  },
  serviceLineAccent: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(169, 245, 182, 0.3)',
  },
  centreLine: {
    position: 'absolute',
    top: 48,
    bottom: 30,
    left: '50%',
    marginLeft: -1,
    width: 2,
    backgroundColor: '#BCEAFF',
  },
  doublesLongServiceLine: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(188, 234, 255, 0.65)',
  },
  backBoundaryLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#BCEAFF',
  },

  // 3. Centre Base Marker
  centreBaseMarkerContainer: {
    position: 'absolute',
    top: 176,
    left: '50%',
    marginLeft: -26,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  centrePulseWave: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#A9F5B6',
    backgroundColor: 'rgba(169, 245, 182, 0.25)',
  },
  centreBaseDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#BCEAFF',
    backgroundColor: 'rgba(18, 59, 58, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centreBaseCrossH: {
    position: 'absolute',
    width: 12,
    height: 1.5,
    backgroundColor: '#BCEAFF',
  },
  centreBaseCrossV: {
    position: 'absolute',
    height: 12,
    width: 1.5,
    backgroundColor: '#BCEAFF',
  },
  baseLabel: {
    position: 'absolute',
    bottom: -15,
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(188, 234, 255, 0.75)',
    letterSpacing: 1,
  },

  // 4. Interactive Front Corners
  frontLeftMarkerTouch: {
    position: 'absolute',
    top: 66,
    left: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  frontRightMarkerTouch: {
    position: 'absolute',
    top: 66,
    right: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  pulseHalo: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#A9F5B6',
    backgroundColor: 'rgba(169, 245, 182, 0.28)',
  },
  cornerMarkerCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#A9F5B6',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A9F5B6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  cornerMarkerRight: {
    borderColor: '#FFFFFF',
  },
  cornerMarkerActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#A9F5B6',
    borderWidth: 3,
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  markerInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#075A61',
  },
  cornerLabel: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: '800',
    color: '#A9F5B6',
    letterSpacing: 0.8,
  },

  // 5. Illustrated Athlete
  athleteContainer: {
    position: 'absolute',
    top: 146,
    left: '50%',
    marginLeft: -40, // Half of 80px width
    width: 80,
    height: 96,
    zIndex: 15,
  },
});
