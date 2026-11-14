import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AeroColors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import { SecondaryButton, FeatureCard } from '@/components/common';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ATHLETE PROFILE</Text>
          </View>
          <Text style={styles.title}>Player Settings</Text>
          <Text style={styles.subtitle}>
            Manage your audio cues, court display orientation, and practice targets.
          </Text>
        </View>

        {/* Profile Card */}
        <FeatureCard style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>A</Text>
            </View>
            <View style={styles.profileMeta}>
              <Text style={styles.playerName}>Aero Athlete</Text>
              <Text style={styles.playerLevel}>Singles Footwork • Level 0 Base</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Cadence Audio Cues</Text>
            <View style={styles.activePill}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Active</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Weekly Practice Goal</Text>
            <Text style={styles.statusValue}>3 Sessions / Week</Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Court Perspective</Text>
            <Text style={styles.statusValue}>Player View (Upward)</Text>
          </View>
        </FeatureCard>

        {/* Navigation Actions */}
        <View style={styles.actionContainer}>
          <SecondaryButton
            title="🏸 Play Welcome Mini-Game"
            variant="solid"
            onPress={() => router.navigate('/welcome')}
            style={styles.backBtn}
          />
          <SecondaryButton
            title="← Back to Dashboard"
            variant="outline"
            onPress={() => router.navigate('/')}
            style={[styles.backBtn, { marginTop: 10 }]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AeroColors.warmCream,
  },
  scrollContent: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.md,
    paddingBottom: 110,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: AeroColors.softTealTint,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: 6,
  },
  badgeText: {
    ...Typography.labelSm,
    color: AeroColors.deepTeal,
    fontWeight: '800',
  },
  title: {
    ...Typography.headlineLg,
    color: AeroColors.deepTeal,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: AeroColors.mutedSage,
    marginTop: 4,
  },
  profileCard: {
    marginBottom: Spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: AeroColors.deepTeal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: AeroColors.seafoam,
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: '800',
    color: AeroColors.pureWhite,
  },
  profileMeta: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  playerName: {
    ...Typography.headlineSm,
    color: AeroColors.deepTeal,
  },
  playerLevel: {
    ...Typography.bodySm,
    color: AeroColors.mutedSage,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(18, 59, 58, 0.06)',
    marginBottom: Spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(18, 59, 58, 0.04)',
  },
  statusLabel: {
    ...Typography.bodyMd,
    color: AeroColors.darkSlate,
  },
  statusValue: {
    ...Typography.labelMd,
    color: AeroColors.mutedSage,
    fontWeight: '600',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AeroColors.softTealTint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: AeroColors.seafoam,
    marginRight: 6,
  },
  activeText: {
    ...Typography.labelSm,
    color: AeroColors.deepTeal,
    fontWeight: '700',
  },
  actionContainer: {
    marginTop: Spacing.xs,
  },
  backBtn: {
    width: '100%',
  },
});

