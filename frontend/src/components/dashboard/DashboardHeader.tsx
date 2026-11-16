import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BellIcon } from './DashboardIcons';

const AVATAR_ONLINE_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDhSKzwaHgA6elXx5SBjAF5NTsu3C07V_gh0txgJovjR89h-MDhFGVxR1sGbtUXpMKMN6R6T4S5e_j2-x-N_embRQgvGzIPWpBEbTtcsm0M77Kp7fgAfBilRdu7i5p269Gv8XbkvmQ4f0V-Hae2qzs-dvPdCLJRwoaMz-rpXHuZGMcL7MWtF68oO09fVNHIH65gPAaZyRIEsdZKXmMb6FCJ3mE2iQTAHlDbNEA2amc5';

export function DashboardHeader() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Left: User Avatar & Name */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.navigate('/profile')}
        style={styles.profileRow}
        accessibilityRole="button"
        accessibilityLabel="Go to Profile">
        {/* Avatar with Ring & Status Badge */}
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: AVATAR_ONLINE_URI }}
            defaultSource={require('../../../assets/images/dashboard-avatar.jpg')}
            style={styles.avatarImage}
            resizeMode="cover"
          />
          {/* Online Active Indicator Dot */}
          <View style={styles.onlineBadge} />
        </View>

        {/* User Info */}
        <View style={styles.nameColumn}>
          <Text style={styles.greetingText}>Hello,</Text>
          <Text style={styles.userNameText}>Alex Chen</Text>
        </View>
      </TouchableOpacity>

      {/* Right: Notification Bell Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {}}
        style={styles.notificationButton}
        accessibilityRole="button"
        accessibilityLabel="Notifications">
        <BellIcon size={21} color="#191B25" />
        {/* Notification Alert Dot */}
        <View style={styles.notificationDot} />
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
    marginTop: 4,
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 2,
    backgroundColor: 'rgba(210, 175, 253, 0.4)', // secondary-container/40
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2353C6', // primary
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameColumn: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 12,
    color: '#434653', // on-surface-variant
    lineHeight: 14,
    marginBottom: 2,
    fontWeight: '400',
  },
  userNameText: {
    fontSize: 18,
    color: '#191B25', // on-surface
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF', // surface-container-lowest
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#191B25',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2353C6', // primary
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});

