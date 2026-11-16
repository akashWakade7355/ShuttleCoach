import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

export function BuiltForAlexRating() {
  const [rating, setRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);

  // Star scale animated values
  const starScales = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];

  // Thank you toast animation
  const toastAnim = useRef(new Animated.Value(0)).current;

  const handleStarPress = (index: number) => {
    const newRating = index + 1;
    setRating(newRating);
    setHasRated(true);

    // Staggered star bounce animation
    starScales.forEach((anim, i) => {
      if (i <= index) {
        Animated.sequence([
          Animated.delay(i * 45),
          Animated.timing(anim, { toValue: 1.4, duration: 110, useNativeDriver: true }),
          Animated.spring(anim, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
        ]).start();
      }
    });

    // Show celebratory toast
    toastAnim.setValue(0);
    Animated.spring(toastAnim, {
      toValue: 1,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const toastTranslateY = toastAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  return (
    <View style={styles.container}>
      {/* 1. Header: "Built for Alex." */}
      <View style={styles.headerGroup}>
        <Text style={styles.builtTitle}>Built for Alex.</Text>
        <Text style={styles.builtSubtitle}>
          Built with <Text style={styles.heartText}>❤️</Text> by AeroCourt team
        </Text>
      </View>

      {/* 2. Interactive Feedback Rating Box */}
      <View style={styles.ratingCard}>
        <Text style={styles.promptText}>
          How&apos;s AeroCourt been for you so far?
        </Text>

        <View style={styles.starsRow}>
          {starScales.map((anim, idx) => {
            const isFilled = rating > idx;
            return (
              <TouchableOpacity
                key={`star-${idx}`}
                activeOpacity={0.7}
                onPress={() => handleStarPress(idx)}
                style={styles.starTouch}
                accessibilityRole="button"
                accessibilityLabel={`Rate ${idx + 1} out of 5 stars`}>
                <Animated.View style={{ transform: [{ scale: anim }] }}>
                  <Text style={[styles.starGlyph, isFilled && styles.starGlyphFilled]}>
                    {isFilled ? '★' : '☆'}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Celebratory Feedback Confirmation */}
        {hasRated && (
          <Animated.View
            style={[
              styles.feedbackToast,
              {
                opacity: toastAnim,
                transform: [{ translateY: toastTranslateY }],
              },
            ]}>
            <Text style={styles.feedbackToastText}>
              Thank you, Alex! 🏸 Your feedback helps us improve.
            </Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 40,
    alignItems: 'center',
  },
  headerGroup: {
    alignItems: 'center',
    marginBottom: 16,
  },
  builtTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  builtSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '500',
  },
  heartText: {
    color: '#EF4444',
  },
  ratingCard: {
    width: '100%',
    backgroundColor: '#121A28', // Dark card from screenshot
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  promptText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 14,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  starTouch: {
    padding: 4,
  },
  starGlyph: {
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.45)',
  },
  starGlyphFilled: {
    color: '#FBBF24', // Luminous gold star
    textShadowColor: 'rgba(251, 191, 36, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  feedbackToast: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 242, 197, 0.15)',
    borderWidth: 1,
    borderColor: '#8BF2C5',
  },
  feedbackToastText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8BF2C5',
    textAlign: 'center',
  },
});

