import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';

export function TodaysChallengeCard() {
  const router = useRouter();

  // Ambient pulsing glow
  const glowPulse = useRef(new Animated.Value(0.3)).current;
  // Start button ping animation
  const pingScale = useRef(new Animated.Value(1)).current;
  const pingOpacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // 1. Ambient back glow loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 0.65,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.25,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 2. Pulse ping on the Start CTA
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pingScale, {
            toValue: 1.35,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pingOpacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pingScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(pingOpacity, {
            toValue: 0.7,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [glowPulse, pingScale, pingOpacity]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Ambient Backlight Glows */}
        <Animated.View
          style={[
            styles.glowLime,
            { opacity: glowPulse },
          ]}
        />
        <Animated.View
          style={[
            styles.glowAmber,
            { opacity: glowPulse },
          ]}
        />

        {/* Top Badges Row */}
        <View style={styles.badgesRow}>
          <View style={styles.leftBadges}>
            {/* Today's Challenge Badge */}
            <View style={styles.limeBadge}>
              <Text style={styles.badgeEmoji}>🔥</Text>
              <Text style={styles.limeBadgeText}>TODAY'S CHALLENGE</Text>
            </View>

            {/* 2x Streak Multiplier Badge */}
            <View style={styles.amberBadge}>
              <Text style={styles.badgeEmoji}>⚡</Text>
              <Text style={styles.amberBadgeText}>2x Streak Multiplier</Text>
            </View>
          </View>

          {/* Court Master Tier Badge */}
          <View style={styles.tierBadge}>
            <Text style={styles.badgeEmoji}>🏅</Text>
            <Text style={styles.tierBadgeText}>COURT MASTER</Text>
          </View>
        </View>

        {/* Challenge Title & Body */}
        <View style={styles.contentRow}>
          {/* Target Icon Box */}
          <View style={styles.iconBox}>
            <Text style={styles.iconSymbol}>🎯</Text>
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.challengeTitle}>Random 6-Corner Shadow Drill</Text>
            <Text style={styles.challengeDesc}>
              Full-court agility test: reactive 6-corner shadow footwork with randomized audio calls to test recovery and split-step speed.
            </Text>
          </View>
        </View>

        {/* Agility Ace Reward Strip */}
        <View style={styles.rewardBanner}>
          <Text style={styles.rewardText}>
            <Text style={styles.trophyIcon}>🏆 Agility Ace Reward: </Text>
            <Text style={styles.rewardPts}>+150 XP • +50 Streak Pts</Text>
          </Text>

          <View style={styles.activePill}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>2x Active</Text>
          </View>
        </View>

        {/* Bottom Cadence Specs & Start Action */}
        <View style={styles.bottomRow}>
          <View style={styles.specsRow}>
            <Text style={styles.specHighlight}>12 sets</Text>
            <Text style={styles.specBullet}>•</Text>
            <Text style={styles.specText}>20s active / 15s rest</Text>
            <Text style={styles.specBullet}>•</Text>
            <View style={styles.proPaceBadge}>
              <Text style={styles.proPaceText}>Pro Pace</Text>
            </View>
          </View>

          {/* Start CTA with Pulsing Ping */}
          <View style={styles.startBtnWrapper}>
            <Animated.View
              style={[
                styles.pulsePingRing,
                {
                  transform: [{ scale: pingScale }],
                  opacity: pingOpacity,
                },
              ]}
            />
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.navigate('/practice')}
              style={styles.startBtn}>
              <Text style={styles.startBtnText}>Start</Text>
              <Text style={styles.startArrowIcon}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: '#151B23', // Brand dark card
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 255, 0, 0.35)', // Electric Lime border
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#D4FF00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  glowLime: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(212, 255, 0, 0.18)',
  },
  glowAmber: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(251, 191, 36, 0.14)',
  },

  /* BADGES */
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  leftBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  limeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 255, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 0, 0.4)',
    borderRadius: 9999,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  badgeEmoji: {
    fontSize: 10.5,
  },
  limeBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#D4FF00',
    letterSpacing: 0.6,
  },
  amberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  amberBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FCD34D',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tierBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#CBD5E1',
    letterSpacing: 0.5,
  },

  /* CONTENT */
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(212, 255, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconSymbol: {
    fontSize: 20,
  },
  infoCol: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  challengeDesc: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
    fontWeight: '400',
  },

  /* REWARD BANNER */
  rewardBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 0, 0.22)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rewardText: {
    fontSize: 10,
  },
  trophyIcon: {
    color: '#FCD34D',
    fontWeight: '700',
  },
  rewardPts: {
    color: '#CBD5E1',
    fontWeight: '600',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#D4FF00',
  },
  activeText: {
    color: '#D4FF00',
    fontSize: 10,
    fontWeight: '800',
  },

  /* BOTTOM ROW */
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 10,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specHighlight: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#D4FF00',
  },
  specBullet: {
    color: '#64748B',
    fontSize: 10,
  },
  specText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  proPaceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  proPaceText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#E2E8F0',
  },

  /* START CTA */
  startBtnWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulsePingRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4FF00',
  },
  startBtn: {
    backgroundColor: '#D4FF00', // Electric Lime
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#D4FF00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  startBtnText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '900',
  },
  startArrowIcon: {
    color: '#0F172A',
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 2,
  },
});

