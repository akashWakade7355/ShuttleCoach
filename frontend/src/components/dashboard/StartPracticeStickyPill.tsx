import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

export interface StartPracticeStickyPillProps {
  /** Animated scroll Y offset driving the docking fade */
  scrollY: Animated.Value;
  /** Distance from top of scroll content to docking threshold */
  dockThreshold: number;
  /** Whether reduced motion is enabled */
  reduceMotion?: boolean;
  /** Optional custom tap handler */
  onPress?: () => void;
}

export function StartPracticeStickyPill({
  scrollY,
  dockThreshold,
  reduceMotion = false,
  onPress,
}: StartPracticeStickyPillProps) {
  const router = useRouter();

  // Press scale feedback
  const pressScale = useRef(new Animated.Value(1)).current;

  // Continuous breathing loop
  const breatheAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) return;

    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 1700,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: 1700,
          useNativeDriver: true,
        }),
      ])
    );

    breatheLoop.start();

    return () => {
      breatheLoop.stop();
    };
  }, [breatheAnim, reduceMotion]);

  const handlePressIn = () => {
    if (reduceMotion) return;
    Animated.spring(pressScale, {
      toValue: 0.98,
      tension: 120,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (reduceMotion) return;
    Animated.spring(pressScale, {
      toValue: 1,
      tension: 120,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.navigate('/practice');
    }
  };

  // Docking backing opacity threshold
  const approachDistance = 24;
  const startFade = Math.max(0, dockThreshold - approachDistance);
  const endFade = dockThreshold;

  const backingOpacity = reduceMotion
    ? scrollY.interpolate({
        inputRange: [dockThreshold - 1, dockThreshold],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      })
    : scrollY.interpolate({
        inputRange: [startFade, endFade],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      });

  // Breathing animation scales
  const pillScale = reduceMotion
    ? 1
    : breatheAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.022],
      });

  const glowScale = reduceMotion
    ? 1
    : breatheAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.98, 1.08],
      });

  const glowOpacity = reduceMotion
    ? 0.2
    : breatheAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.2, 0.6],
      });

  const combinedScale = reduceMotion
    ? pressScale
    : Animated.multiply(pressScale, pillScale);

  return (
    <View style={styles.stickyWrapper} collapsable={false}>
      {/* Docked Backing */}
      <Animated.View
        style={[styles.dockedBacking, { opacity: backingOpacity }]}
        pointerEvents="none">
        <View style={styles.dockedDivider} />
      </Animated.View>

      {/* Pill Container */}
      <View style={styles.gutterContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityLabel="Start Practice"
          accessibilityHint="Starts the shadow footwork practice session"
          style={styles.touchTarget}>
          <View style={styles.buttonWrapper}>
            {/* Soft Ambient White Breathing Glow Aura */}
            <Animated.View
              style={[
                styles.breatheAura,
                {
                  transform: [{ scale: glowScale }],
                  opacity: glowOpacity,
                },
              ]}
              pointerEvents="none"
            />

            {/* Crisp Light White Theme Pill Surface */}
            <Animated.View
              style={[
                styles.animPillContainer,
                { transform: [{ scale: combinedScale }] },
              ]}>
              <View style={styles.pillContent}>
                {/* Center Title Label */}
                <Text style={styles.pillLabel}>Start Practice</Text>

                {/* Right Arrow Play Circle Badge */}
                <View style={styles.playCircle}>
                  <Text style={styles.playArrowIcon}>→</Text>
                </View>
              </View>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stickyWrapper: {
    width: '100%',
    zIndex: 30,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  dockedBacking: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0D1117',
    zIndex: -1,
  },
  dockedDivider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  gutterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
    backgroundColor: 'transparent',
  },
  touchTarget: {
    width: '100%',
    borderRadius: 9999,
  },
  buttonWrapper: {
    width: '100%',
    position: 'relative',
  },
  breatheAura: {
    ...StyleSheet.absoluteFill,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Soft Crisp White Glow
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 8,
  },
  animPillContainer: {
    width: '100%',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF', // Clean Light White Theme Surface
    paddingLeft: 24,
    paddingRight: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  pillLabel: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      web: 'Georgia, serif',
      default: 'serif',
    }),
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A', // Deep Obsidian Dark Typography
    letterSpacing: -0.2,
  },
  playCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0F172A', // Dark Slate Circle Badge
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  playArrowIcon: {
    color: '#FFFFFF', // Crisp White Arrow Icon
    fontSize: 18,
    fontWeight: '900',
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
});
