import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { WingedLogoIcon, BellIcon } from './DashboardIcons';

export interface DashboardTopBarProps {
  onLayout?: (e: LayoutChangeEvent) => void;
}

export function DashboardTopBar({ onLayout }: DashboardTopBarProps) {
  const router = useRouter();

  // Bell Jiggle Animation
  const bellRotate = useRef(new Animated.Value(0)).current;

  // Profile Scale Animation
  const profileScale = useRef(new Animated.Value(1)).current;

  const handleBellPress = () => {
    Animated.sequence([
      Animated.timing(bellRotate, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(bellRotate, { toValue: -1, duration: 80, useNativeDriver: true }),
      Animated.timing(bellRotate, { toValue: 0.8, duration: 70, useNativeDriver: true }),
      Animated.timing(bellRotate, { toValue: -0.8, duration: 70, useNativeDriver: true }),
      Animated.timing(bellRotate, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleProfilePress = () => {
    Animated.sequence([
      Animated.timing(profileScale, { toValue: 0.9, duration: 90, useNativeDriver: true }),
      Animated.timing(profileScale, { toValue: 1, duration: 110, useNativeDriver: true }),
    ]).start(() => {
      router.navigate('/profile');
    });
  };

  const bellSpin = bellRotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-18deg', '18deg'],
  });

  return (
    <View style={styles.container} onLayout={onLayout}>
      {/* 1. Left: AeroCourt Branding */}
      <View style={styles.brandGroup}>
        <WingedLogoIcon size={24} color="#FFFFFF" />
        <Text style={styles.brandTitle}>AeroCourt</Text>
      </View>

      {/* 2. Center: User Profile Avatar */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleProfilePress}
        style={styles.profileContainer}
        accessibilityRole="button"
        accessibilityLabel="Go to Profile">
        <Animated.View style={[styles.avatarRing, { transform: [{ scale: profileScale }] }]}>
          <Image
            source={require('../../../assets/images/dashboard-user-avatar.png')}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </Animated.View>
        <Text style={styles.profileLabel}>Your profile</Text>
      </TouchableOpacity>

      {/* 3. Right: Notification Bell Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleBellPress}
        style={styles.bellButton}
        accessibilityRole="button"
        accessibilityLabel="Notifications">
        <Animated.View style={{ transform: [{ rotate: bellSpin }] }}>
          <BellIcon size={20} color="#FFFFFF" />
        </Animated.View>
        {/* Active Notification Badge */}
        <View style={styles.badgeDot} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
    zIndex: 30,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    fontStyle: 'italic',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#E5A93C', // Warm gold ring from screenshot
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#381C08',
    shadowColor: '#E5A93C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 3,
    letterSpacing: 0.1,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flex: 1,
    alignSelf: 'flex-end',
    maxWidth: 38,
  },
  badgeDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#38BDF8', // Cyan/sky blue alert dot
    borderWidth: 1.2,
    borderColor: '#080C14',
  },
});
