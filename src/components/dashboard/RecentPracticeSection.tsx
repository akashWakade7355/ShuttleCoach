import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Grid4x4Icon, SpeedIcon, LightbulbIcon } from './DashboardIcons';

export function RecentPracticeSection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Recent Practice</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.navigate('/practice')}
          accessibilityRole="button"
          accessibilityLabel="View All Practice Sessions">
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Practice Sessions Cards */}
      <View style={styles.cardsList}>
        {/* Session Card 1 */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.navigate('/practice')}
          style={styles.sessionCard}
          accessibilityRole="button"
          accessibilityLabel="Full Court 4-Corner Diagonal">
          <View style={styles.cardLeftContent}>
            {/* 48x48 Lavender Icon Box */}
            <View style={styles.gridIconBox}>
              <Grid4x4Icon size={22} color="#2353C6" />
            </View>
            <View style={styles.cardTextGroup}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                Full Court 4-Corner Diagonal
              </Text>
              <Text style={styles.cardSubtitle} numberOfLines={1}>
                L1 Intermediate • Yesterday, 07:45 AM
              </Text>
            </View>
          </View>

          {/* Right Stats */}
          <View style={styles.cardRightStats}>
            <Text style={styles.timeText}>12m 30s</Text>
            <Text style={styles.repsText}>48 Reps</Text>
          </View>
        </TouchableOpacity>

        {/* Session Card 2 */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.navigate('/practice')}
          style={styles.sessionCard}
          accessibilityRole="button"
          accessibilityLabel="Front Net Agility and Tumble">
          <View style={styles.cardLeftContent}>
            {/* 48x48 Lilac Icon Box */}
            <View style={styles.speedIconBox}>
              <SpeedIcon size={22} color="#6E5096" />
            </View>
            <View style={styles.cardTextGroup}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                Front Net Agility & Tumble
              </Text>
              <Text style={styles.cardSubtitle} numberOfLines={1}>
                Advanced • Monday, 06:15 PM
              </Text>
            </View>
          </View>

          {/* Right Stats */}
          <View style={styles.cardRightStats}>
            <Text style={styles.timeText}>10m 00s</Text>
            <Text style={styles.speedRepsText}>40 Reps</Text>
          </View>
        </TouchableOpacity>

        {/* Quick Session Recommendation Tile */}
        <View style={styles.recommendationTile}>
          <View style={styles.recLeftContent}>
            <LightbulbIcon size={20} color="#2353C6" />
            <Text style={styles.recText}>
              Ready for overhead smash recovery drill today?
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.navigate('/practice')}
            style={styles.recStartButton}
            accessibilityRole="button"
            accessibilityLabel="Start overhead smash recovery drill">
            <Text style={styles.recStartText}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#191B25', // on-surface
    letterSpacing: -0.2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2353C6', // primary
  },
  cardsList: {
    gap: 12,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF', // surface-container-lowest
    shadowColor: '#191B25',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  gridIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F3F2FF', // surface-container-low
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  speedIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EEDCFF', // secondary-fixed
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  cardTextGroup: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#191B25', // on-surface
    letterSpacing: -0.1,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#434653', // on-surface-variant
    fontWeight: '400',
  },
  cardRightStats: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#191B25', // on-surface
  },
  repsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#006389', // tertiary
    marginTop: 2,
  },
  speedRepsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6E5096', // secondary
    marginTop: 2,
  },
  recommendationTile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#F3F2FF', // surface-container-low
    marginTop: 2,
  },
  recLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
    gap: 10,
  },
  recText: {
    fontSize: 12,
    color: '#434653', // on-surface-variant
    fontWeight: '500',
    lineHeight: 16,
    flex: 1,
  },
  recStartButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: '#2353C6', // primary
    shadowColor: '#2353C6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    flexShrink: 0,
  },
  recStartText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

