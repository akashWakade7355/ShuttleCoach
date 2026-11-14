import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

const GRADIENT_STOPS = [
  '#1649CD',
  '#144BC0',
  '#124DB2',
  '#104FA4',
  '#0F5196',
  '#0D5389',
  '#0B557B',
  '#0A576E',
  '#075A61',
];

interface CobaltTealBackgroundProps {
  children?: React.ReactNode;
}

export function CobaltTealBackground({ children }: CobaltTealBackgroundProps) {
  return (
    <View style={styles.container}>
      {/* Platform-Specific Gradient Rendering */}
      {Platform.OS === 'web' ? (
        <View style={[StyleSheet.absoluteFill, styles.webGradient]} />
      ) : (
        <View style={StyleSheet.absoluteFill}>
          {GRADIENT_STOPS.map((color, index) => (
            <View
              key={`gradient-slice-${index}`}
              style={[
                styles.gradientSlice,
                {
                  backgroundColor: color,
                  flex: 1,
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* Atmospheric Soft Court Glow (Center-Top) */}
      <View style={styles.ambientGlow} />

      {/* Foreground Content */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1649CD',
    position: 'relative',
    overflow: 'hidden',
  },
  webGradient: {
    // @ts-ignore: Web specific CSS linear-gradient
    backgroundImage: 'linear-gradient(180deg, #1649CD 0%, #104FA4 35%, #0B557B 70%, #075A61 100%)',
  },
  gradientSlice: {
    width: '100%',
  },
  ambientGlow: {
    position: 'absolute',
    top: '18%',
    left: '10%',
    right: '10%',
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(101, 201, 184, 0.09)',
    transform: [{ scaleX: 1.4 }],
  },
});

