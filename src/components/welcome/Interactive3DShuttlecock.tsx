import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Image,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SHUTTLE_WIDTH = Math.min(SCREEN_WIDTH * 0.68, 260);
const SHUTTLE_HEIGHT = (SHUTTLE_WIDTH * 400) / 312;

interface Interactive3DShuttlecockProps {
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function Interactive3DShuttlecock({
  onDragStart,
  onDragEnd,
}: Interactive3DShuttlecockProps) {
  // Pan coordinates for user drag
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // Idle floating breathing animation values
  const floatAnim = useRef(new Animated.Value(0)).current;
  const floatLoop = useRef<Animated.CompositeAnimation | null>(null);

  // Is user currently dragging
  const isDragging = useRef(false);

  useEffect(() => {
    // Smooth breathing float loop (simulates floating in air)
    floatLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.current.start();

    return () => {
      floatLoop.current?.stop();
    };
  }, []);

  // PanResponder to handle smooth tilt and drag gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isDragging.current = true;
        onDragStart?.();
        pan.setOffset({
          // @ts-ignore
          x: pan.x._value,
          // @ts-ignore
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        isDragging.current = false;
        pan.flattenOffset();
        onDragEnd?.();
        // Return to center with realistic aerodynamic spring physics
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 6.5,
          tension: 50,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  // Interpolate idle breathing float
  const idleTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 8],
  });

  const idleRotateZ = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-1.8deg', '1.8deg'],
  });

  // Dynamic 3D tilt while dragging: tilts opposite to drag direction like an aerodynamic shuttlecock
  const dragRotateZ = pan.x.interpolate({
    inputRange: [-180, 0, 180],
    outputRange: ['18deg', '0deg', '-18deg'],
    extrapolate: 'clamp',
  });

  const dragRotateX = pan.y.interpolate({
    inputRange: [-180, 0, 180],
    outputRange: ['12deg', '0deg', '-12deg'],
    extrapolate: 'clamp',
  });

  const dragScale = pan.y.interpolate({
    inputRange: [-180, 0, 180],
    outputRange: [1.06, 1.0, 0.94],
    extrapolate: 'clamp',
  });

  // Dynamic shadow scale & translation
  const shadowTranslateX = pan.x.interpolate({
    inputRange: [-180, 180],
    outputRange: [-120, 120],
  });

  const shadowScale = pan.y.interpolate({
    inputRange: [-180, 0, 180],
    outputRange: [0.82, 1.0, 1.15],
    extrapolate: 'clamp',
  });

  const shadowOpacity = pan.y.interpolate({
    inputRange: [-180, 0, 180],
    outputRange: [0.35, 0.65, 0.85],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Center Spotlight */}
      <View style={styles.courtSpotlight} />

      {/* 2. Reactive Drop Shadow on Court Floor */}
      <Animated.View
        style={[
          styles.dropShadow,
          {
            transform: [
              { translateX: shadowTranslateX },
              { scale: shadowScale },
            ],
            opacity: shadowOpacity,
          },
        ]}
      />

      {/* 3. Interactive Floating 3D Shuttlecock */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.shuttleWrapper,
          {
            transform: [
              { translateX: pan.x },
              { translateY: Animated.add(pan.y, idleTranslateY) },
              { rotateZ: dragRotateZ },
              { rotateX: dragRotateX },
              { scale: dragScale },
            ],
          },
        ]}>
        <Image
          source={require('../../../assets/images/shuttlecock-3d-transparent.png')}
          style={styles.shuttleImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 380,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  courtSpotlight: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(188, 237, 228, 0.22)',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
  },
  dropShadow: {
    position: 'absolute',
    bottom: 30,
    width: 140,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(4, 24, 46, 0.55)',
    transform: [{ scaleX: 1.3 }],
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
  },
  shuttleWrapper: {
    width: SHUTTLE_WIDTH,
    height: SHUTTLE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    cursor: 'grab',
  },
  shuttleImage: {
    width: '100%',
    height: '100%',
  },
});

