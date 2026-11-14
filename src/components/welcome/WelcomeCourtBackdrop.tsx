import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Animated,
  TouchableWithoutFeedback,
  GestureResponderEvent,
} from 'react-native';

interface Ripple {
  id: number;
  x: number;
  y: number;
  anim: Animated.Value;
}

interface WelcomeCourtBackdropProps {
  children?: React.ReactNode;
}

export function WelcomeCourtBackdrop({ children }: WelcomeCourtBackdropProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handlePress = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    const newRippleId = Date.now();
    const anim = new Animated.Value(0);

    setRipples((prev) => [...prev, { id: newRippleId, x: locationX, y: locationY, anim }]);

    Animated.timing(anim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRippleId));
    });
  };

  return (
    <View style={styles.container}>
      {/* 1. High-Resolution Authentic BWF Court Backdrop Image */}
      <Image
        source={require('../../../assets/images/welcome-court-backdrop.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* 2. Soft Ambient Lighting Vignette */}
      <View style={styles.vignetteOverlay} />

      {/* 3. Interactive Touch Ripples Container */}
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={StyleSheet.absoluteFill}>
          {ripples.map((ripple) => {
            const scale = ripple.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 2.8],
            });
            const opacity = ripple.anim.interpolate({
              inputRange: [0, 0.4, 1],
              outputRange: [0.9, 0.5, 0],
            });

            return (
              <Animated.View
                key={ripple.id}
                style={[
                  styles.touchRipple,
                  {
                    left: ripple.x - 27,
                    top: ripple.y - 27,
                    transform: [{ scale }],
                    opacity,
                  },
                ]}
              />
            );
          })}
        </View>
      </TouchableWithoutFeedback>

      {/* 4. Foreground UI Content */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c438c',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 61, 126, 0.15)',
  },
  touchRipple: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#BCEDE4',
    backgroundColor: 'rgba(188, 237, 228, 0.3)',
    pointerEvents: 'none',
  },
});
