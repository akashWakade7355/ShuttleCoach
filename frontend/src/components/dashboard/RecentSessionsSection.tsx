import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CourtGridIcon, AgilityIcon } from './DashboardIcons';

export function RecentSessionsSection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 1. Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.navigate('/practice')}
          accessibilityRole="button"
          accessibilityLabel="View All Recent Sessions">
          <Text style={styles.viewAllText}>View All &gt;</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Session Cards List */}
      <View style={styles.cardsList}>
        {/* Session Card 1: Full Court 4-Corner (Paused) */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.navigate('/practice')}
          style={styles.sessionCard}
          accessibilityRole="button"
          accessibilityLabel="Resume Full Court 4-Corner">
          <View style={styles.cardLeft}>
            <View style={styles.gridIconContainer}>
              <CourtGridIcon size={20} color="#38BDF8" />
            </View>
            <View style={styles.textGroup}>
              <Text style={styles.cardTitle}>Full Court 4-Corner</Text>
              <View style={styles.subtitleRow}>
                <View style={styles.pausedIndicatorDot} />
                <Text style={styles.cardSubtitle}>Paused • 6 min done</Text>
              </View>
            </View>
          </View>

          {/* Mint Resume Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.navigate('/practice')}
            style={styles.resumeButton}
            accessibilityRole="button"
            accessibilityLabel="Resume">
            <Text style={styles.resumeButtonText}>Resume</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Session Card 2: Front Net Agility (Completed) */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.navigate('/practice')}
          style={styles.sessionCard}
          accessibilityRole="button"
          accessibilityLabel="Replay Front Net Agility">
          <View style={styles.cardLeft}>
            <View style={styles.agilityIconContainer}>
              <AgilityIcon size={20} color="#C084FC" />
            </View>
            <View style={styles.textGroup}>
              <Text style={styles.cardTitle}>Front Net Agility</Text>
              <View style={styles.subtitleRow}>
                <View style={styles.completedIndicatorDot} />
                <Text style={styles.cardSubtitle}>Completed • 10 min</Text>
              </View>
            </View>
          </View>

          {/* Outlined Replay Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.navigate('/practice')}
            style={styles.replayButton}
            accessibilityRole="button"
            accessibilityLabel="Replay">
            <Text style={styles.replayButtonText}>Replay</Text>
          </TouchableOpacity>
        </TouchableOpacity>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8BF2C5', // Mint from screenshot
    letterSpacing: -0.1,
  },
  cardsList: {
    gap: 12,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#121A28', // Dark card from screenshot
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  gridIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(56, 189, 248, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  agilityIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(168, 85, 247, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textGroup: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pausedIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B', // Amber dot for paused
    marginRight: 6,
  },
  completedIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8BF2C5', // Mint dot for completed
    marginRight: 6,
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '500',
  },
  resumeButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: '#8BF2C5', // Solid mint pill
    shadowColor: '#8BF2C5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 2,
  },
  resumeButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#102321', // Dark text on mint
  },
  replayButton: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 9999,
    backgroundColor: 'transparent',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  replayButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

