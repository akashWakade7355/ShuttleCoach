import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BellIcon } from './DashboardIcons';

interface NewUpperHeroSectionProps {
  onLayout?: (e: LayoutChangeEvent) => void;
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
}

const DAYS_DATA = [
  { day: 'Sun', mins: '18 min', height: 44, isToday: false },
  { day: 'Sun', mins: '12 min', height: 28, isToday: false },
  { day: 'Sun', mins: '22 min', height: 48, isToday: false },
  { day: 'Sun', mins: '35 min', height: 66, isToday: false },
  { day: 'Sun', mins: '4,5hr', height: 74, isToday: true },
  { day: 'Sun', mins: '20 min', height: 48, isToday: false },
  { day: 'Sun', mins: '10 min', height: 32, isToday: false },
];

export function NewUpperHeroSection({
  onLayout,
  onNotificationPress,
  onAvatarPress,
}: NewUpperHeroSectionProps) {
  // Flame breathing / flickering animation
  const flameScale = useRef(new Animated.Value(1)).current;
  const flameRotate = useRef(new Animated.Value(0)).current;

  // Greeting glow pulse animation
  const glowOpacity = useRef(new Animated.Value(0.4)).current;

  // Chart entrance bars animation
  const barsAnim = useRef(new Animated.Value(0)).current;

  // Notification badge pulse
  const bellRingAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Flame breathing loop
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(flameScale, {
            toValue: 1.15,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(flameRotate, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(flameScale, {
            toValue: 0.95,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(flameRotate, {
            toValue: -1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // 2. Ambient greeting glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.75,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.35,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Bars entrance spring
    Animated.spring(barsAnim, {
      toValue: 1,
      tension: 65,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [flameScale, flameRotate, glowOpacity, barsAnim]);

  const flameRotationStr = flameRotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-6deg', '0deg', '6deg'],
  });

  return (
    <View style={styles.heroSurface} onLayout={onLayout}>
      {/* ==================================================================== */}
      {/* 1. Header Row (Avatar, Pro Circuit Badge, Bell)                     */}
      {/* ==================================================================== */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onAvatarPress}
          style={styles.avatarProfileRow}>
          {/* Avatar with Lime Active Dot */}
          <View style={styles.avatarWrapper}>
            <Image
              source={require('@/../assets/images/dashboard-alex-avatar.jpg')}
              style={styles.avatarImage}
              contentFit="cover"
            />
            <View style={styles.onlineBadge} />
          </View>

          {/* User Tier & Level */}
          <View style={styles.profileTextCol}>
            <Text style={styles.proCircuitLabel}>PRO CIRCUIT</Text>
            <View style={styles.levelRow}>
              <Text style={styles.levelName}>AeroCourt Level 6</Text>
              <View style={styles.verifiedCheckBadge}>
                <Text style={styles.verifiedCheckText}>✓</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Frosted Glass Bell Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onNotificationPress}
          style={styles.glassBellBtn}>
          <BellIcon size={18} color="#1E293B" />
          <View style={styles.bellLimeDot} />
        </TouchableOpacity>
      </View>

      {/* ==================================================================== */}
      {/* 2. Interactive Greeting Card ("HI Alex, Ready to own the court Bro!!") */}
      {/* ==================================================================== */}
      <View style={styles.greetingCard}>
        {/* Soft Ambient Breathing Backlights */}
        <Animated.View
          style={[
            styles.greetingGlowBlob1,
            { opacity: glowOpacity },
          ]}
        />
        <Animated.View
          style={[
            styles.greetingGlowBlob2,
            { opacity: glowOpacity },
          ]}
        />

        <Text style={styles.greetingText}>
          <Text style={styles.greetingBold}>HI Alex, </Text>
          <Text style={styles.greetingSub}>Ready to own the court </Text>
          <Text style={styles.greetingBro}>Bro!!</Text>
        </Text>
      </View>

      {/* ==================================================================== */}
      {/* 3. Practice Streak / Progress Learning (Blended directly)           */}
      {/* ==================================================================== */}
      <View style={styles.blendedStreakContainer}>
        {/* Title & Top Right Pie Chart Icon Row */}
        <View style={styles.streakTitleRow}>
          <View>
            <Text style={styles.streakSubhead}>Progress Learning</Text>
            <View style={styles.bigTimeRow}>
              <Text style={styles.bigTimeNumber}>04</Text>
              <Text style={styles.bigTimeUnit}>hr </Text>
              <Text style={styles.bigTimeNumber}>54</Text>
              <Text style={styles.bigTimeUnit}>min</Text>
            </View>
          </View>

          {/* Top Right Pie Chart Action Button */}
          <TouchableOpacity activeOpacity={0.8} style={styles.pieChartCircleBtn}>
            <View style={styles.pieChartIconGraphic}>
              <View style={styles.pieSlice} />
            </View>
          </TouchableOpacity>
        </View>

        {/* 7 Vertical Pill Bars Chart */}
        <View style={styles.blendedChartRow}>
          {DAYS_DATA.map((item, index) => {
            const barAnimatedHeight = barsAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [6, item.height],
            });

            return (
              <View key={'col-' + index} style={styles.blendedChartCol}>
                {item.isToday ? (
                  /* Active Day Pink Candy-Striped Pill Bar with Tooltip */
                  <View style={styles.activeStripedBarWrapper}>
                    {/* Floating Pink Tooltip Badge */}
                    <View style={styles.pinkTooltipBadge}>
                      <Text style={styles.pinkTooltipText}>{item.mins}</Text>
                      <View style={styles.pinkCaretTriangle} />
                    </View>

                    {/* Striped Bar Container */}
                    <Animated.View
                      style={[
                        styles.stripedPillBar,
                        { height: barAnimatedHeight },
                      ]}>
                      <View style={styles.stripesPatternOverlay}>
                        {[...Array(7)].map((_, i) => (
                          <View
                            key={i}
                            style={[
                              styles.stripeLine,
                              { top: i * 11 - 12 },
                            ]}
                          />
                        ))}
                      </View>
                    </Animated.View>
                  </View>
                ) : (
                  /* Regular Dark Rounded Pill Bar */
                  <Animated.View
                    style={[
                      styles.regularPillBar,
                      { height: barAnimatedHeight },
                    ]}
                  />
                )}

                {/* Day Label */}
                <Text
                  style={[
                    styles.blendedDayLabel,
                    item.isToday && styles.blendedDayLabelActive,
                  ]}>
                  {item.day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroSurface: {
    width: '100%',
    backgroundColor: '#DDE9E2', // Soft Misty Sage/Mint
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
    position: 'relative',
    zIndex: 10,
  },

  /* 1. HEADER ROW */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  avatarProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D4FF00', // Electric Lime
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileTextCol: {
    justifyContent: 'center',
  },
  proCircuitLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#065F46', // Emerald-800
    textTransform: 'uppercase',
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  levelName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#022C22', // Emerald-950
  },
  verifiedCheckBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedCheckText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    lineHeight: 11,
  },
  glassBellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  bellLimeDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4FF00', // Electric Lime
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },

  /* 2. GREETING CARD */
  greetingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
  },
  greetingGlowBlob1: {
    position: 'absolute',
    top: -24,
    left: -24,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(52, 211, 153, 0.28)', // Emerald blur
  },
  greetingGlowBlob2: {
    position: 'absolute',
    bottom: -24,
    right: -24,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(212, 255, 0, 0.22)', // Lime blur
  },
  greetingText: {
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  greetingBold: {
    fontWeight: '900',
    color: '#0F1D18',
  },
  greetingSub: {
    fontWeight: '400',
    color: '#2B443C',
  },
  greetingBro: {
    fontWeight: '900',
    color: '#0F1D18',
  },

  /* 3. BLENDED PRACTICE STREAK / PROGRESS LEARNING SECTION */
  blendedStreakContainer: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 4,
  },
  streakTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  streakSubhead: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155', // Slate-700
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  bigTimeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bigTimeNumber: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      web: 'Georgia, serif',
      default: 'serif',
    }),
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A', // Slate-900
    letterSpacing: -0.5,
  },
  bigTimeUnit: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      web: 'Georgia, serif',
      default: 'serif',
    }),
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginRight: 6,
  },
  pieChartCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F172A', // Dark Slate Circle
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  pieChartIconGraphic: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieSlice: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 9,
    height: 9,
    backgroundColor: '#FFFFFF',
  },
  blendedChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  blendedChartCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  regularPillBar: {
    width: 36,
    backgroundColor: '#0F172A', // Dark Obsidian Rounded 3D Pill
    borderRadius: 18,
  },
  activeStripedBarWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  pinkTooltipBadge: {
    backgroundColor: '#F43F5E', // Vibrant Pink Tooltip
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  pinkTooltipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  pinkCaretTriangle: {
    position: 'absolute',
    bottom: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#F43F5E',
  },
  stripedPillBar: {
    width: 38,
    backgroundColor: '#0F172A',
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#F43F5E',
    overflow: 'hidden',
    position: 'relative',
  },
  stripesPatternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  stripeLine: {
    position: 'absolute',
    left: -15,
    right: -15,
    height: 5,
    backgroundColor: '#F43F5E',
    transform: [{ rotate: '45deg' }],
  },
  blendedDayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569', // Slate-600
    marginTop: 10,
  },
  blendedDayLabelActive: {
    color: '#0F172A',
    fontWeight: '800',
  },

  /* 4. BOTTOM HANDLE */
  handleContainer: {
    alignItems: 'center',
    marginTop: 14,
  },
  handlePill: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(6, 44, 34, 0.22)',
  },
});

