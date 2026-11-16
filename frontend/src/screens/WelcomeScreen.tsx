import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { WelcomeCourtBackdrop } from '@/components/welcome/WelcomeCourtBackdrop';
import { Interactive3DShuttlecock } from '@/components/welcome/Interactive3DShuttlecock';

export interface WelcomeScreenProps {
  onGetStarted?: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <WelcomeCourtBackdrop>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.mainContainer}>
          {/* ==================================================================== */}
          {/* 1. Top Section: Left-Aligned Display Headline                        */}
          {/* ==================================================================== */}
          <View style={styles.topSection}>
            <Text style={styles.headline}>
              Every rally{'\n'}starts here.
            </Text>
          </View>

          {/* ==================================================================== */}
          {/* 2. Middle Section: Interactive 3D Shuttlecock with Drag Physics      */}
          {/* ==================================================================== */}
          <View style={styles.middleSection}>
            <Interactive3DShuttlecock />
          </View>

          {/* ==================================================================== */}
          {/* 3. Bottom Section: Floating Hint & "Get Started" Pill CTA Button     */}
          {/* ==================================================================== */}
          <View style={styles.bottomSection}>
            {/* Interaction Guidance Hint */}
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>Tilt or drag to move</Text>
            </View>

            {/* Warm-White Pill "Get Started" Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleGetStarted}
              style={styles.getStartedButton}
              accessibilityRole="button"
              accessibilityLabel="Get Started with AeroCourt">
              <View style={styles.buttonInner}>
                <Text style={styles.getStartedLabel}>Get Started</Text>
                <Text style={styles.arrowIcon}>→</Text>
              </View>
            </TouchableOpacity>

            {/* Android Home Navigation Gesture Bar Clearance */}
            <View style={styles.gestureIndicatorContainer}>
              <View style={styles.gestureIndicatorBar} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </WelcomeCourtBackdrop>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 4,
  },

  // 1. Top Section
  topSection: {
    width: '100%',
    paddingTop: 12,
    zIndex: 10,
  },
  headline: {
    fontFamily: Platform.select({
      android: 'sans-serif',
      ios: 'System',
      web: '"Plus Jakarta Sans", "Inter", -apple-system, sans-serif',
      default: 'sans-serif',
    }),
    fontSize: 35,
    lineHeight: 41,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.6,
  },

  // 2. Middle Section
  middleSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    marginVertical: -10,
  },

  // 3. Bottom Section
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    zIndex: 30,
    paddingBottom: 4,
  },
  hintContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  hintText: {
    fontFamily: Platform.select({
      android: 'sans-serif',
      ios: 'System',
      web: '"Plus Jakarta Sans", "Inter", sans-serif',
      default: 'sans-serif',
    }),
    fontSize: 13,
    fontWeight: '600',
    color: '#BCEDE4',
    letterSpacing: 0.1,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  getStartedButton: {
    width: '100%',
    height: 58,
    borderRadius: 9999, // Pill shape
    backgroundColor: '#FAF9F5', // Warm Cream / White
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#04182E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.38,
    shadowRadius: 24,
    elevation: 8,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  getStartedLabel: {
    fontFamily: Platform.select({
      android: 'sans-serif',
      ios: 'System',
      web: '"Plus Jakarta Sans", "Inter", sans-serif',
      default: 'sans-serif',
    }),
    fontSize: 17,
    fontWeight: '800',
    color: '#09243B', // Deep Navy
    letterSpacing: -0.2,
  },
  arrowIcon: {
    fontSize: 17,
    fontWeight: '800',
    color: '#09243B',
    marginTop: -1,
  },
  gestureIndicatorContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 2,
  },
  gestureIndicatorBar: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
});
