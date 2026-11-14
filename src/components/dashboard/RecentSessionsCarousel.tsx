import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

interface SessionItem {
  id: string;
  title: string;
  status: 'paused' | 'finished';
  duration: string;
  progressText: string;
  category: string;
}

const SESSIONS: SessionItem[] = [
  {
    id: 's1',
    title: 'Full Court 4-Corner',
    status: 'paused',
    duration: '18 min',
    progressText: '14 of 20 min done',
    category: 'Footwork',
  },
  {
    id: 's2',
    title: 'Front Net Agility & Kill',
    status: 'finished',
    duration: '10 min',
    progressText: '10 min completed · 100%',
    category: 'Net Play',
  },
  {
    id: 's3',
    title: 'Rear Court Smash & Recovery',
    status: 'finished',
    duration: '8 min',
    progressText: '8 min completed · 100%',
    category: 'Attack',
  },
  {
    id: 's4',
    title: 'Multi-Shuttle Rapid Defense',
    status: 'paused',
    duration: '4 min',
    progressText: '4 of 15 min elapsed',
    category: 'Defense',
  },
];

export function RecentSessionsCarousel() {
  const router = useRouter();

  const handleAction = (session: SessionItem) => {
    if (session.status === 'paused') {
      router.navigate('/practice');
    } else {
      Alert.alert('Replay Session', `Restarting ${session.title}...`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithBadge}>
          <Text style={styles.sectionTitle}>RECENT SESSIONS</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>4</Text>
          </View>
        </View>

        <View style={styles.swipeHintRow}>
          <Text style={styles.swipeHintText}>Swipe</Text>
          <Text style={styles.swipeArrow}>→</Text>
        </View>
      </View>

      {/* Horizontal Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}>
        {SESSIONS.map((session) => {
          const isPaused = session.status === 'paused';

          return (
            <View key={session.id} style={styles.sessionCard}>
              {/* Card Header: Status & Duration */}
              <View style={styles.cardTopRow}>
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      isPaused ? styles.dotLime : styles.dotEmerald,
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      isPaused ? styles.textLime : styles.textEmerald,
                    ]}>
                    {isPaused ? 'PAUSED' : 'FINISHED'}
                  </Text>
                </View>

                <Text style={styles.durationText}>{session.duration}</Text>
              </View>

              {/* Title & Progress */}
              <View style={styles.titleBlock}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {session.title}
                </Text>
                <Text style={styles.progressDesc}>{session.progressText}</Text>
              </View>

              {/* Card Footer: Category & Action CTA */}
              <View style={styles.cardFooter}>
                <Text style={styles.categoryTag}>{session.category}</Text>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleAction(session)}
                  style={[
                    styles.actionBtn,
                    isPaused ? styles.btnLime : styles.btnTranslucent,
                  ]}>
                  <Text
                    style={[
                      styles.actionBtnText,
                      isPaused ? styles.btnTextDark : styles.btnTextLight,
                    ]}>
                    {isPaused ? 'Resume ▶' : 'Replay ↺'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#CBD5E1', // Slate-300
    letterSpacing: 0.6,
  },
  countBadge: {
    backgroundColor: 'rgba(212, 255, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 0, 0.3)',
    borderRadius: 9999,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D4FF00',
  },
  swipeHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  swipeHintText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  swipeArrow: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700',
  },

  /* CAROUSEL */
  scrollList: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 4,
  },
  sessionCard: {
    width: 215,
    minHeight: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 14,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotLime: {
    backgroundColor: '#D4FF00',
  },
  dotEmerald: {
    backgroundColor: '#34D399',
  },
  statusText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  textLime: {
    color: '#D4FF00',
  },
  textEmerald: {
    color: '#34D399',
  },
  durationText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  titleBlock: {
    marginVertical: 4,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  progressDesc: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 3,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 10,
    marginTop: 8,
  },
  categoryTag: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  btnLime: {
    backgroundColor: '#D4FF00',
    shadowColor: '#D4FF00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  btnTranslucent: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  actionBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  btnTextDark: {
    color: '#0F172A',
  },
  btnTextLight: {
    color: '#E2E8F0',
  },
});

