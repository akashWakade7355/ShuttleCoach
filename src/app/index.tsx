import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Animated,
  AccessibilityInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// AeroCourt New Stitch Dashboard Components matching code.html
import { NewUpperHeroSection } from '@/components/dashboard/NewUpperHeroSection';
import { StartPracticeStickyPill } from '@/components/dashboard/StartPracticeStickyPill';
import { TrainingTargetsSlider } from '@/components/dashboard/TrainingTargetsSlider';
import { RecentSessionsCarousel } from '@/components/dashboard/RecentSessionsCarousel';
import { TodaysChallengeCard } from '@/components/dashboard/TodaysChallengeCard';
import { TrainingGuidesCard } from '@/components/dashboard/TrainingGuidesCard';
import { BuiltForAlexRating } from '@/components/dashboard/BuiltForAlexRating';

export default function HomeScreen() {
  // Continuous scroll Y offset for sticky docking animation
  const scrollY = useRef(new Animated.Value(0)).current;

  // Measure natural layout height of upper hero surface to calculate exact dock threshold
  const [heroHeight, setHeroHeight] = useState(380);

  // Respect reduced motion accessibility setting
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => {});

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]} // Index 1 is StartPracticeStickyPill
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}>
        {/* ==================================================================== */}
        {/* Child 0: Upper Frosted Glassmorphism Hero Section (Misty Sage Surface) */}
        {/* ==================================================================== */}
        <NewUpperHeroSection
          onLayout={(e) => setHeroHeight(e.nativeEvent.layout.height)}
        />

        {/* ==================================================================== */}
        {/* Child 1: Sticky "Start Practice" Pill Bar (Index 1 stickyHeader)     */}
        {/* ==================================================================== */}
        <StartPracticeStickyPill
          scrollY={scrollY}
          dockThreshold={heroHeight}
          reduceMotion={reduceMotion}
        />

        {/* ==================================================================== */}
        {/* Child 2: Your Training Targets Slider (45 Min Daily Goal)           */}
        {/* ==================================================================== */}
        <TrainingTargetsSlider />

        {/* ==================================================================== */}
        {/* Child 3: Recent Sessions Carousel (Full Court, Net Agility, etc.)   */}
        {/* ==================================================================== */}
        <RecentSessionsCarousel />

        {/* ==================================================================== */}
        {/* Child 4: Today's Challenge Quick Launcher (Random 6-Corner Shadow)   */}
        {/* ==================================================================== */}
        <TodaysChallengeCard />

        {/* ==================================================================== */}
        {/* Child 5: Training Guides Card (On Court, Footwork & Split-Step)       */}
        {/* ==================================================================== */}
        <TrainingGuidesCard />

        {/* ==================================================================== */}
        {/* Child 6: Built for Alex (5-Star Interactive Rating & Feedback)        */}
        {/* ==================================================================== */}
        <BuiltForAlexRating />

        {/* Child 7: Floating Bottom Nav Clearance Spacer */}
        <View style={styles.bottomNavSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#DDE9E2', // Misty Sage light top surface
  },
  scrollContent: {
    backgroundColor: '#0D1117', // Dark Tactical background for lower section
    paddingBottom: 24,
  },
  bottomNavSpacer: {
    height: 96,
  },
});

