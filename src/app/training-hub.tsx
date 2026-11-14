import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AeroColors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import { SecondaryButton, FeatureCard } from '@/components/common';

export default function TrainingHubScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>TRAINING HUB</Text>
          </View>
          <Text style={styles.title}>Technique & Mechanics</Text>
          <Text style={styles.subtitle}>
            Sports science, movement kinematics, and tactical badminton court primers.
          </Text>
        </View>

        {/* Technical Article Preview 1 */}
        <FeatureCard style={styles.articleCard}>
          <View style={styles.tagRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>BIOMECHANICS</Text>
            </View>
            <Text style={styles.readTimeText}>3 min read</Text>
          </View>
          <Text style={styles.articleTitle}>
            The Split-Step Timing Trigger: Unlocking Faster First Movement
          </Text>
          <Text style={styles.articleBody}>
            How landing on pre-loaded knees precisely at opponent contact eliminates movement latency and accelerates your initial burst toward the shuttle.
          </Text>
        </FeatureCard>

        {/* Technical Article Preview 2 */}
        <FeatureCard style={styles.articleCard}>
          <View style={styles.tagRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>COURT POSITIONING</Text>
            </View>
            <Text style={styles.readTimeText}>4 min read</Text>
          </View>
          <Text style={styles.articleTitle}>
            Mastering Base 0: The Neutral Center Recovery
          </Text>
          <Text style={styles.articleBody}>
            Why returning your center of gravity to the T-junction after every shot protects against aggressive deceptive clears and sharp net tumbles.
          </Text>
        </FeatureCard>

        {/* Navigation Action */}
        <View style={styles.actionContainer}>
          <SecondaryButton
            title="← Back to Home Dashboard"
            variant="outline"
            onPress={() => router.navigate('/')}
            style={styles.backBtn}
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
  articleCard: {
    marginBottom: Spacing.md,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: AeroColors.softTealTint,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  categoryText: {
    ...Typography.labelSm,
    color: AeroColors.deepTeal,
    fontWeight: '700',
    fontSize: 9,
  },
  readTimeText: {
    ...Typography.bodySm,
    color: AeroColors.mutedSage,
    fontSize: 11,
  },
  articleTitle: {
    ...Typography.headlineSm,
    color: AeroColors.deepTeal,
    marginBottom: 6,
  },
  articleBody: {
    ...Typography.bodySm,
    color: AeroColors.mutedSage,
    lineHeight: 20,
  },
  actionContainer: {
    marginTop: Spacing.sm,
  },
  backBtn: {
    width: '100%',
  },
});

