import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';

export function TrainingTargetsSlider() {
  const [trackWidth, setTrackWidth] = useState(300);
  // Default 71% progress (32 of 45 mins)
  const [progressPercent, setProgressPercent] = useState(71);

  const thumbScale = useRef(new Animated.Value(1)).current;

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 50) {
      setTrackWidth(width);
    }
  };

  const completedMins = Math.round((progressPercent / 100) * 45);
  const remainingMins = Math.max(0, 45 - completedMins);

  const handlePressIn = () => {
    Animated.spring(thumbScale, {
      toValue: 1.15,
      tension: 100,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(thumbScale, {
      toValue: 1,
      tension: 80,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Your Training Targets</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.configureLink}>Configure Drills</Text>
        </TouchableOpacity>
      </View>

      {/* Target Progress Slider Bar */}
      <View style={styles.sliderTrack} onLayout={handleLayout}>
        {/* Filled Electric Lime Track */}
        <View
          style={[
            styles.filledTrack,
            { width: `${progressPercent}%` },
          ]}>
          {/* Thumb Handle with 3 vertical dots */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.thumbTouch}>
            <Animated.View
              style={[
                styles.thumbHandle,
                { transform: [{ scale: thumbScale }] },
              ]}>
              <View style={styles.dotsCol}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Hatched Hazard Striped Empty Track */}
        <View style={styles.hatchedTrack}>
          {[...Array(12)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.hatchStripe,
                { left: i * 16 - 10 },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Readout below Slider */}
      <View style={styles.readoutRow}>
        <View style={styles.goalTitleRow}>
          <Text style={styles.stopwatchIcon}>⏱️</Text>
          <Text style={styles.goalTitleText}>45 Min Daily Goal</Text>
        </View>
        <Text style={styles.goalDetailText}>
          {completedMins} of 45 mins completed today ·{' '}
          <Text style={styles.goalRemainingHighlight}>{remainingMins} mins left</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#CBD5E1', // Slate-300
    letterSpacing: 0.3,
  },
  configureLink: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#D4FF00', // Electric Lime
  },

  /* SLIDER TRACK */
  sliderTrack: {
    width: '100%',
    height: 44,
    borderRadius: 22,
    backgroundColor: '#151B23', // Dark Card
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
  },
  filledTrack: {
    height: '100%',
    backgroundColor: '#D4FF00', // Electric Lime
    borderRadius: 19,
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 2,
  },
  thumbTouch: {
    position: 'absolute',
    right: -18,
    top: -2,
    zIndex: 10,
  },
  thumbHandle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1A232F',
    borderWidth: 2.5,
    borderColor: '#D4FF00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D4FF00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 6,
  },
  dotsCol: {
    alignItems: 'center',
    gap: 2.5,
  },
  dot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75,
    backgroundColor: '#D4FF00',
  },
  hatchedTrack: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    left: '50%',
    overflow: 'hidden',
  },
  hatchStripe: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    width: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    transform: [{ rotate: '45deg' }],
  },

  /* READOUT */
  readoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 2,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stopwatchIcon: {
    fontSize: 14,
  },
  goalTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  goalDetailText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  goalRemainingHighlight: {
    color: '#D4FF00',
    fontWeight: '700',
  },
});

