import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';

interface DayData {
  id: string;
  day: string;
  minutes: number;
  isSpecial?: boolean;
}

const WEEK_DATA: DayData[] = [
  { id: 'mon', day: 'Mon', minutes: 12 },
  { id: 'tue', day: 'Tue', minutes: 0 },
  { id: 'wed', day: 'Wed', minutes: 18 },
  { id: 'thu', day: 'Thu', minutes: 0 },
  { id: 'fri', day: 'Fri', minutes: 20 },
  { id: 'sat', day: 'Sat', minutes: 24, isSpecial: true },
  { id: 'sun', day: 'Sun', minutes: 10 },
];

export function PracticeStreakSection() {
  const [selectedDay, setSelectedDay] = useState<string>('sat');

  // Animated bar heights for entry
  const animProgress = useRef(new Animated.Value(0)).current;

  // Floating bounce animation for 24 min badge
  const badgeFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Staggered bar entry animation
    Animated.spring(animProgress, {
      toValue: 1,
      tension: 40,
      friction: 8,
      useNativeDriver: false,
    }).start();

    // 2. Floating bounce loop for Saturday 24 min badge
    const badgeLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(badgeFloat, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(badgeFloat, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    );
    badgeLoop.start();

    return () => {
      badgeLoop.stop();
    };
  }, []);

  const badgeTranslateY = badgeFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* 1. Header & Big Stat Row */}
        <Text style={styles.sectionTitle}>Practice Streak</Text>

        <View style={styles.streakRow}>
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streakDays}>3 days</Text>
          <View style={styles.streakDivider} />
          <Text style={styles.streakWeekTotal}>1h 24m this week</Text>
        </View>

        {/* 2. 7-Day Interactive Bar Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.barsRow}>
            {WEEK_DATA.map((item) => {
              const isSelected = selectedDay === item.id;
              const hasMinutes = item.minutes > 0;
              const maxMinutes = 24;
              const targetHeight = Math.max((item.minutes / maxMinutes) * 88, 4);

              // Animated scale height
              const barHeight = animProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [4, targetHeight],
              });

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDay(item.id)}
                  style={styles.barColumn}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.day}: ${item.minutes} minutes`}>
                  {/* Top Minute Label / Badge */}
                  <View style={styles.minuteLabelWrapper}>
                    {item.isSpecial ? (
                      <Animated.View
                        style={[
                          styles.specialBadge,
                          { transform: [{ translateY: badgeTranslateY }] },
                        ]}>
                        <Text style={styles.specialBadgeText}>24 min</Text>
                      </Animated.View>
                    ) : (
                      <Text style={[styles.minuteLabel, isSelected && styles.minuteLabelActive]}>
                        {item.minutes} min
                      </Text>
                    )}
                  </View>

                  {/* Vertical Bar */}
                  <View style={styles.barTrack}>
                    {hasMinutes ? (
                      item.isSpecial ? (
                        // Saturday Striped Highlight Bar
                        <Animated.View
                          style={[
                            styles.stripedBar,
                            { height: barHeight },
                            isSelected && styles.barSelectedOutline,
                          ]}>
                          {/* Diagonal Stripes Simulation */}
                          <View style={styles.stripesPattern}>
                            {Array.from({ length: 8 }).map((_, sIdx) => (
                              <View key={`stripe-${sIdx}`} style={styles.diagonalStripe} />
                            ))}
                          </View>
                        </Animated.View>
                      ) : (
                        // Standard Dark Bar
                        <Animated.View
                          style={[
                            styles.standardBar,
                            { height: barHeight },
                            isSelected && styles.barSelectedActive,
                          ]}
                        />
                      )
                    ) : (
                      // 0 min Dash
                      <View style={styles.zeroDash} />
                    )}
                  </View>

                  {/* Day Label (Mon, Tue, ...) */}
                  <Text style={[styles.dayLabel, (item.isSpecial || isSelected) && styles.dayLabelActive]}>
                    {item.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#121A28', // Dark card background from screenshot
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  streakFire: {
    fontSize: 22,
    marginRight: 6,
  },
  streakDays: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  streakDivider: {
    width: 1.5,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 12,
    alignSelf: 'center',
  },
  streakWeekTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: -0.1,
  },

  // 2. Bar Chart
  chartContainer: {
    width: '100%',
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  minuteLabelWrapper: {
    height: 28,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  minuteLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.45)',
  },
  minuteLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  specialBadge: {
    backgroundColor: '#F472B6', // Pink floating pill from screenshot
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 9999,
    shadowColor: '#F472B6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 3,
  },
  specialBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#121A28', // Dark text on pink
  },
  barTrack: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 90,
  },
  standardBar: {
    width: 28,
    borderRadius: 8,
    backgroundColor: '#222E42', // Dark filled bar from screenshot
  },
  barSelectedActive: {
    backgroundColor: '#334766',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  barSelectedOutline: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  stripedBar: {
    width: 32,
    borderRadius: 8,
    backgroundColor: '#1E1528',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#F472B6',
  },
  stripesPattern: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-around',
  },
  diagonalStripe: {
    width: 50,
    height: 4,
    backgroundColor: '#F472B6',
    transform: [{ rotate: '-45deg' }, { translateX: -8 }],
    opacity: 0.85,
  },
  zeroDash: {
    width: 22,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginBottom: 4,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.45)',
    marginTop: 8,
  },
  dayLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
