import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { ElevatedBadmintonCourt, WelcomeCourtState } from './ElevatedBadmintonCourt';

interface StoryboardCard {
  id: string;
  stepNumber: string;
  title: string;
  state: WelcomeCourtState;
  hint: string;
  description: string;
  highlights: string[];
}

const STORYBOARD_STEPS: StoryboardCard[] = [
  {
    id: 'ready',
    stepNumber: '1',
    title: 'Ready Stance',
    state: 'ready',
    hint: '“Tap a corner”',
    description:
      'The player stands on the centre Base 0 marker with knees slightly bent and racket raised. Both front corners are active, and the front-right marker pulses gently.',
    highlights: ['Base 0 centre position', 'Gentle mint pulse on Net R', 'Racket in ready position'],
  },
  {
    id: 'lunge',
    stepNumber: '2',
    title: 'Corner Lunge',
    state: 'lunge-right',
    hint: '“Front-right lunge”',
    description:
      'After the user taps the front-right marker, that corner lights up and the athlete lunges forward with bent front knee, extended trailing leg, and racket reaching toward the net.',
    highlights: ['Bright mint marker glow', 'Deep lead knee bend', 'Subtle dual motion trails'],
  },
  {
    id: 'recover',
    stepNumber: '3',
    title: 'Recover to Centre',
    state: 'ready',
    hint: '“Try the other corner.”',
    description:
      'The player pushes off and returns smoothly to the centre ready stance. The Base 0 marker pulses once with a mint wave, resetting footwork for the next corner.',
    highlights: ['Smooth return to Base 0', 'Centre marker expands once', 'Dynamic hint update'],
  },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 48, 320);

export function CourtStoryboard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<React.ElementRef<typeof ScrollView> | null>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + 16));
    if (index !== activeIndex && index >= 0 && index < STORYBOARD_STEPS.length) {
      setActiveIndex(index);
    }
  };

  const scrollToIndex = (index: number) => {
    scrollRef.current?.scrollTo({
      x: index * (CARD_WIDTH + 16),
      animated: true,
    });
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Step Indicators */}
      <View style={styles.tabRow}>
        {STORYBOARD_STEPS.map((step, idx) => {
          const isActive = activeIndex === idx;
          return (
            <TouchableOpacity
              key={step.id}
              activeOpacity={0.8}
              onPress={() => scrollToIndex(idx)}
              style={[styles.stepTab, isActive && styles.stepTabActive]}>
              <View style={[styles.stepBadge, isActive && styles.stepBadgeActive]}>
                <Text style={[styles.stepBadgeText, isActive && styles.stepBadgeTextActive]}>
                  {step.stepNumber}
                </Text>
              </View>
              <Text style={[styles.stepTabTitle, isActive && styles.stepTabTitleActive]}>
                {step.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Horizontal Storyboard Cards */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {STORYBOARD_STEPS.map((step, idx) => {
          const isActive = activeIndex === idx;
          return (
            <View key={step.id} style={[styles.card, isActive && styles.cardActive]}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.stepTag}>
                  <Text style={styles.stepTagText}>STATE {step.stepNumber} OF 3</Text>
                </View>
                <Text style={styles.cardTitle}>{step.title}</Text>
              </View>

              {/* Court Visual Frozen at Target State */}
              <View style={styles.courtFrame}>
                <View style={styles.courtScaler}>
                  <ElevatedBadmintonCourt
                    forcedState={step.state}
                    interactive={false}
                  />
                </View>
              </View>

              {/* Interaction Hint Display */}
              <View style={styles.hintContainer}>
                <Text style={styles.hintLabel}>INTERACTION HINT</Text>
                <Text style={styles.hintQuote}>{step.hint}</Text>
              </View>

              {/* Description & Highlighting Points */}
              <Text style={styles.cardDescription}>{step.description}</Text>

              <View style={styles.highlightsContainer}>
                {step.highlights.map((item, hIdx) => (
                  <View key={`hl-${hIdx}`} style={styles.highlightRow}>
                    <View style={styles.highlightBullet} />
                    <Text style={styles.highlightText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {STORYBOARD_STEPS.map((_, i) => (
          <TouchableOpacity
            key={`dot-${i}`}
            onPress={() => scrollToIndex(i)}
            style={[styles.dot, activeIndex === i && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  stepTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(188, 234, 255, 0.15)',
  },
  stepTabActive: {
    backgroundColor: 'rgba(169, 245, 182, 0.18)',
    borderColor: '#A9F5B6',
  },
  stepBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(188, 234, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  stepBadgeActive: {
    backgroundColor: '#A9F5B6',
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#BCEAFF',
  },
  stepBadgeTextActive: {
    color: '#075A61',
  },
  stepTabTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(188, 234, 255, 0.75)',
  },
  stepTabTitleActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    backgroundColor: 'rgba(7, 90, 97, 0.55)',
    borderWidth: 1.5,
    borderColor: 'rgba(188, 234, 255, 0.25)',
    padding: 16,
    alignItems: 'center',
  },
  cardActive: {
    borderColor: '#A9F5B6',
    backgroundColor: 'rgba(7, 90, 97, 0.75)',
  },
  cardHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepTag: {
    backgroundColor: 'rgba(169, 245, 182, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  stepTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A9F5B6',
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  courtFrame: {
    width: 280,
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18, 59, 58, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(188, 234, 255, 0.2)',
    marginVertical: 4,
  },
  courtScaler: {
    transform: [{ scale: 0.82 }],
  },
  hintContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(22, 73, 205, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(188, 234, 255, 0.2)',
  },
  hintLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(188, 234, 255, 0.75)',
    letterSpacing: 0.6,
  },
  hintQuote: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A9F5B6',
  },
  cardDescription: {
    fontSize: 12,
    color: '#E0F0EA',
    lineHeight: 17,
    marginTop: 4,
    marginBottom: 8,
  },
  highlightsContainer: {
    width: '100%',
    gap: 4,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#A9F5B6',
    marginRight: 8,
  },
  highlightText: {
    fontSize: 11,
    color: '#BCEAFF',
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(188, 234, 255, 0.3)',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#A9F5B6',
  },
});
