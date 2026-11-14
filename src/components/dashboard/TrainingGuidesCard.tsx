import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

type GuideTab = 'On Court' | 'Myth Check' | 'Fitness';

const TABS: GuideTab[] = ['On Court', 'Myth Check', 'Fitness'];

export function TrainingGuidesCard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<GuideTab>('On Court');

  return (
    <View style={styles.container}>
      {/* Dark Frosted Glass Card Container */}
      <View style={styles.card}>
        {/* 1. Filter Tabs Row */}
        <View style={styles.tabsRow}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.8}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                accessibilityRole="button"
                accessibilityLabel={tab}>
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 2. Guide Editorial Info */}
        <View style={styles.guideInfo}>
          <View style={styles.tagRow}>
            <Text style={styles.tagIcon}>📖</Text>
            <Text style={styles.tagText}>TRAINING GUIDES</Text>
          </View>

          <Text style={styles.guideTitle}>Footwork &amp; Split-Step Timing</Text>
          <Text style={styles.guideSubtitle}>
            Improve your first step and recover to base.
          </Text>
        </View>

        {/* 3. Featured Image Thumbnail Preview */}
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => router.navigate('/training-hub')}
          style={styles.thumbnailContainer}
          accessibilityRole="button"
          accessibilityLabel="Watch Footwork and Split-Step Training Guide">
          <Image
            source={require('@/../assets/images/dashboard-guide-splitstep.jpg')}
            style={styles.thumbnailImage}
            contentFit="cover"
          />

          {/* Vignette Gradient Overlay */}
          <View style={styles.thumbnailOverlay}>
            {/* Top Badge Row */}
            <View style={styles.thumbTopRow}>
              <View>
                <Text style={styles.thumbTitleWhite}>FOOTWORK &amp; SPLIT-STEP</Text>
                <Text style={styles.thumbTitleAmber}>TRAINING GUIDE</Text>
              </View>

              <View style={styles.eliteBadge}>
                <Text style={styles.eliteBadgeText}>ELITE ACADEMY</Text>
              </View>
            </View>

            {/* Bottom Meta Row */}
            <View style={styles.thumbBottomRow}>
              <Text style={styles.featuredBadgeText}>
                Featured guide: Return to Base
              </Text>
              <Text style={styles.masterMovementText}>MASTER MOVEMENT</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* 4. Bottom Action Link */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.navigate('/training-hub')}
          style={styles.exploreLinkRow}
          accessibilityRole="button"
          accessibilityLabel="Explore Guides">
          <Text style={styles.exploreLinkText}>Explore Guides →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#FFFFFF', // Crisp light card matching reference
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },

  /* 1. FILTER TABS */
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: '#A1F0D1', // Soft Mint Pill
    shadowColor: '#A1F0D1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#083B28',
    fontWeight: '700',
  },

  /* 2. EDITORIAL INFO */
  guideInfo: {
    marginBottom: 14,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tagIcon: {
    fontSize: 13,
  },
  tagText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#0D9488', // Mint Teal
    textTransform: 'uppercase',
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  guideSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },

  /* 3. THUMBNAIL */
  thumbnailContainer: {
    width: '100%',
    height: 190,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'space-between',
    padding: 12,
  },
  thumbTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  thumbTitleWhite: {
    fontSize: 12.5,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  thumbTitleAmber: {
    fontSize: 12.5,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#FCD34D',
    letterSpacing: 0.5,
  },
  eliteBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  eliteBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  thumbBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  masterMovementText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.5,
  },

  /* 4. ACTION LINK */
  exploreLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 14,
  },
  exploreLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D9488', // Mint Teal
  },
});
