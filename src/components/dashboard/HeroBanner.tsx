import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BoltIcon, ArrowForwardIcon } from './DashboardIcons';

const HERO_SMASH_URI =
  'https://lh3.googleusercontent.com/aida/ALJJyrCDX6tynugG0AqPlHkugokvxvY-iLHhe02t2jyLsF-wjYB5WQC5tbP4C-FKt5y5JbPIsNdjpB8m66tkMFUJcgn4IDDx_xE5e4HzVdErL6Jvvlm9UKh-r0foROiCKO7o54M6ODYXuP6xeuqWaiC6HynvBrGAB9UClQ7C6rSSSq9Cm6Jt4D9fPJp1hoG4mXXjp7T_PWehvkpsc_TfYrzQdYfjh3aPZ3NAYF4AknoSsyW8zQ';

export function HeroBanner() {
  const router = useRouter();

  const handleStartPractice = () => {
    router.navigate('/practice');
  };

  return (
    <View style={styles.bannerContainer}>
      {/* Background Jump Smash Athlete Image on the Right */}
      <Image
        source={{ uri: HERO_SMASH_URI }}
        style={styles.heroImage}
        resizeMode="cover"
      />

      {/* Gradient Feathering Overlays for Maximum Text Legibility */}
      {Platform.OS === 'web' ? (
        <View style={[StyleSheet.absoluteFill, styles.webGradientOverlay]} />
      ) : (
        <>
          <View style={[StyleSheet.absoluteFill, styles.nativeDarkBase]} />
          <View style={styles.nativeGradientSliceLeft} />
          <View style={styles.nativeGradientSliceMid} />
        </>
      )}

      {/* Left Content Column */}
      <View style={styles.contentColumn}>
        <View>
          {/* Badge: Bolt + AeroCourt Training */}
          <View style={styles.pillBadge}>
            <BoltIcon size={12} color="#FFFFFF" />
            <Text style={styles.pillBadgeText}>AeroCourt Training</Text>
          </View>

          {/* Heading */}
          <Text style={styles.headline}>
            Train smarter.{'\n'}Smash stronger.
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtitle} numberOfLines={3}>
            Build swift footwork, razor court recovery, and explosive rhythm through guided shadow drills.
          </Text>
        </View>

        {/* CTA Button: Start Practice */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleStartPractice}
          style={styles.ctaButton}
          accessibilityRole="button"
          accessibilityLabel="Start Practice">
          <Text style={styles.ctaButtonText}>Start Practice</Text>
          <ArrowForwardIcon size={15} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    minHeight: 216,
    borderRadius: 24,
    backgroundColor: '#08090D',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 24,
    shadowColor: '#08090D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 4,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '56%',
    height: '100%',
  },
  webGradientOverlay: {
    // @ts-ignore: Web CSS gradient
    backgroundImage:
      'linear-gradient(90deg, #08090D 0%, #08090D 48%, rgba(8, 9, 13, 0.85) 68%, rgba(8, 9, 13, 0) 100%)',
    zIndex: 1,
  },
  nativeDarkBase: {
    backgroundColor: 'rgba(8, 9, 13, 0.35)',
    zIndex: 1,
  },
  nativeGradientSliceLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '54%',
    backgroundColor: '#08090D',
    zIndex: 2,
  },
  nativeGradientSliceMid: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '52%',
    width: '24%',
    backgroundColor: 'rgba(8, 9, 13, 0.85)',
    zIndex: 2,
  },
  contentColumn: {
    position: 'relative',
    zIndex: 10,
    width: '68%',
    padding: 20,
    minHeight: 216,
    justifyContent: 'space-between',
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginBottom: 10,
    gap: 5,
  },
  pillBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  headline: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 6,
    marginBottom: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: '#2353C6', // primary
    gap: 8,
    shadowColor: '#2353C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  ctaButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
});

