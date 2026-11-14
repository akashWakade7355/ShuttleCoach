import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Platform,
  LayoutChangeEvent,
} from 'react-native';

export interface DashboardHeroSmashProps {
  onLayout?: (e: LayoutChangeEvent) => void;
}

export function DashboardHeroSmash({ onLayout }: DashboardHeroSmashProps) {
  // Floating breathing animation for athlete
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Pulsing energy glow on neon ribbons
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Background silhouette drift
  const driftAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Floating athlete breathing
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2400, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2400, useNativeDriver: true }),
      ])
    );

    // 2. Neon energy ribbon pulse
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );

    // 3. Floating background shuttlecocks
    const driftLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(driftAnim, { toValue: 1, duration: 3200, useNativeDriver: true }),
        Animated.timing(driftAnim, { toValue: 0, duration: 3200, useNativeDriver: true }),
      ])
    );

    floatLoop.start();
    glowLoop.start();
    driftLoop.start();

    return () => {
      floatLoop.stop();
      glowLoop.stop();
      driftLoop.stop();
    };
  }, []);

  const athleteTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-4, 4],
  });

  const ribbonGlowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.65, 1],
  });

  const shuttleDriftY = driftAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 6],
  });

  const shuttleDriftRotate = driftAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <View style={styles.container} onLayout={onLayout}>
      {/* ======================================================== */}
      {/* 1. Background Perspective Court & Silhouette Shuttles    */}
      {/* ======================================================== */}
      <View style={styles.courtGridBackdrop}>
        {/* Receding Perspective Court Lines */}
        <View style={styles.courtPerspectivePlane}>
          <View style={styles.gridLineH1} />
          <View style={styles.gridLineH2} />
          <View style={styles.gridLineV1} />
          <View style={styles.gridLineV2} />
          <View style={styles.gridLineV3} />
        </View>

        {/* Ambient Neon Atmosphere Glow */}
        <Animated.View style={[styles.ambientGlowCyan, { opacity: ribbonGlowOpacity }]} />
        <Animated.View style={[styles.ambientGlowPurple, { opacity: ribbonGlowOpacity }]} />

        {/* Floating Silhouette Shuttlecock 1 (Top Left) */}
        <Animated.View
          style={[
            styles.shuttleSilhouetteTL,
            { transform: [{ translateY: shuttleDriftY }, { rotate: shuttleDriftRotate }] },
          ]}>
          <View style={styles.silhouetteCone} />
          <View style={styles.silhouetteCork} />
        </Animated.View>

        {/* Floating Silhouette Shuttlecock 2 (Top Right) */}
        <Animated.View
          style={[
            styles.shuttleSilhouetteTR,
            { transform: [{ translateY: Animated.multiply(shuttleDriftY, -1) }, { rotate: '25deg' }] },
          ]}>
          <View style={styles.silhouetteCone} />
          <View style={styles.silhouetteCork} />
        </Animated.View>

        {/* Floating Silhouette Shuttlecock 3 (Bottom Right) */}
        <Animated.View
          style={[
            styles.shuttleSilhouetteBR,
            { transform: [{ translateY: shuttleDriftY }, { rotate: '-15deg' }] },
          ]}>
          <View style={styles.silhouetteCone} />
          <View style={styles.silhouetteCork} />
        </Animated.View>
      </View>

      {/* ======================================================== */}
      {/* 2. Jumping Badminton Athlete & Impact Artwork            */}
      {/* ======================================================== */}
      <Animated.View
        style={[
          styles.artworkWrapper,
          { transform: [{ translateY: athleteTranslateY }] },
        ]}>
        <Image
          source={require('../../../assets/images/dashboard-hero-art.png')}
          style={styles.heroArtworkImage}
          resizeMode="cover"
        />
      </Animated.View>

      {/* ======================================================== */}
      {/* 3. "Rise. Smash." Bold Serif Display Headline            */}
      {/* ======================================================== */}
      <View style={styles.headlineContainer} pointerEvents="none">
        <Text style={styles.headlineRise}>Rise.</Text>
        <Text style={styles.headlineSmash}>Smash.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 250,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 4,
  },

  // 1. Perspective Court Backdrop
  courtGridBackdrop: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  courtPerspectivePlane: {
    position: 'absolute',
    bottom: 50,
    left: '5%',
    right: '5%',
    height: 140,
    opacity: 0.35,
    transform: [{ perspective: 500 }, { rotateX: '55deg' }],
  },
  gridLineH1: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: '#38BDF8',
  },
  gridLineH2: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: '#38BDF8',
  },
  gridLineV1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '25%',
    width: 1.5,
    backgroundColor: '#38BDF8',
  },
  gridLineV2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1.5,
    backgroundColor: '#38BDF8',
  },
  gridLineV3: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: '25%',
    width: 1.5,
    backgroundColor: '#38BDF8',
  },

  // Ambient Glows
  ambientGlowCyan: {
    position: 'absolute',
    top: 70,
    right: 30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
    ...(Platform.OS === 'web' ? { filter: 'blur(35px)' } : {}),
  },
  ambientGlowPurple: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(168, 85, 247, 0.16)',
    ...(Platform.OS === 'web' ? { filter: 'blur(35px)' } : {}),
  },

  // Silhouette Shuttlecocks in corners
  shuttleSilhouetteTL: {
    position: 'absolute',
    top: 15,
    left: 15,
    opacity: 0.28,
  },
  shuttleSilhouetteTR: {
    position: 'absolute',
    top: 100,
    right: 10,
    opacity: 0.25,
  },
  shuttleSilhouetteBR: {
    position: 'absolute',
    bottom: 85,
    right: 20,
    opacity: 0.22,
  },
  silhouetteCone: {
    width: 38,
    height: 30,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
    borderWidth: 1.8,
    borderColor: '#7E8B9B',
    borderBottomWidth: 0,
  },
  silhouetteCork: {
    width: 18,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7E8B9B',
    alignSelf: 'center',
    marginTop: 2,
  },

  // 2. Athlete Artwork
  artworkWrapper: {
    width: '100%',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  heroArtworkImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },

  // 3. Display Headline: "Rise. Smash."
  headlineContainer: {
    position: 'absolute',
    top: 48,
    left: 20,
    zIndex: 20,
  },
  headlineRise: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 48,
    lineHeight: 52,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  headlineSmash: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 48,
    lineHeight: 52,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  // 4. Start Practice Pill Bar
  startPracticeBar: {
    width: '100%',
    height: 58,
    borderRadius: 9999,
    backgroundColor: 'rgba(13, 22, 38, 0.92)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 6,
    zIndex: 30,
  },
  startPracticeText: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 21,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  arrowCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8BF2C5', // Vibrant mint green from screenshot
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8BF2C5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 3,
  },
  arrowIcon: {
    fontSize: 20,
    fontWeight: '900',
    color: '#102321', // Dark text in arrow
    marginTop: -2,
  },
});
