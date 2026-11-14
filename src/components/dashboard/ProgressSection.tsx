import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarMonthIcon, SportsTennisIcon } from './DashboardIcons';

export function ProgressSection() {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>LIVE WEEKLY</Text>
        </View>
      </View>

      {/* 2 Metric Cards Grid */}
      <View style={styles.cardsGrid}>
        {/* Metric Card 1: Practice Sessions */}
        <View style={styles.metricCard}>
          <View style={styles.cardTopRow}>
            <View style={styles.lilacIconBox}>
              <CalendarMonthIcon size={20} color="#28064E" />
            </View>
            <Text style={styles.trendText}>+2 vs last wk</Text>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.metricLabel}>Practice Sessions</Text>
            <View style={styles.valueRow}>
              <Text style={styles.metricValue}>4</Text>
              <Text style={styles.metricUnit}>drills</Text>
            </View>
          </View>

          {/* Progress Bar (4 of 6 drills completed) */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '66.7%', backgroundColor: '#2353C6' }]} />
          </View>
        </View>

        {/* Metric Card 2: Guided Repetitions */}
        <View style={styles.metricCard}>
          <View style={styles.cardTopRow}>
            <View style={styles.cyanIconBox}>
              <SportsTennisIcon size={20} color="#004C6B" />
            </View>
            <Text style={styles.goalText}>96% Goal</Text>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.metricLabel}>Guided Repetitions</Text>
            <View style={styles.valueRow}>
              <Text style={styles.metricValue}>192</Text>
              <Text style={styles.metricUnit}>reps</Text>
            </View>
          </View>

          {/* Progress Bar (82% toward weekly goal) */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '82%', backgroundColor: '#D2AFFD' }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
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
  liveBadge: {
    backgroundColor: '#F3F2FF', // surface-container-low
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  liveBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2353C6', // primary
    letterSpacing: 0.6,
  },
  cardsGrid: {
    flexDirection: 'row',
    gap: 14,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF', // surface-container-lowest
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
    minHeight: 148,
    shadowColor: '#191B25',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  lilacIconBox: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#EEDCFF', // secondary-fixed
    alignItems: 'center',
    justifyContent: 'center',
  },
  cyanIconBox: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#C6E7FF', // tertiary-fixed
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2353C6', // primary
  },
  goalText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6E5096', // secondary
  },
  cardBody: {
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 12,
    color: '#434653', // on-surface-variant
    fontWeight: '500',
    marginBottom: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  metricValue: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: '#191B25', // on-surface
    letterSpacing: -0.6,
  },
  metricUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: '#434653', // on-surface-variant
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EDEDFB', // surface-container
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});

