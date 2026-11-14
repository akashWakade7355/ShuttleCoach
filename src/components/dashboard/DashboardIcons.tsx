import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
  fill?: boolean;
}

/**
 * 1. AeroCourt Winged Feather Brand Icon
 */
export function WingedLogoIcon({ size = 22, color = '#FFFFFF' }: IconProps) {
  return (
    <View style={[styles.center, { width: size, height: size * 0.7 }]}>
      <View style={[styles.wingFeather, { backgroundColor: color }]} />
      <View style={[styles.wingFeatherMid, { backgroundColor: color }]} />
      <View style={[styles.wingFeatherLow, { backgroundColor: color }]} />
    </View>
  );
}

/**
 * 2. Notification Bell Icon
 */
export function BellIcon({ size = 20, color = '#FFFFFF' }: IconProps) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[styles.bellHanger, { backgroundColor: color }]} />
      <View style={[styles.bellDome, { borderColor: color }]} />
      <View style={[styles.bellRim, { backgroundColor: color }]} />
      <View style={[styles.bellClapper, { backgroundColor: color }]} />
    </View>
  );
}

/**
 * 3. 4-Corner Court Grid Icon
 */
export function CourtGridIcon({ size = 20, color = '#38BDF8' }: IconProps) {
  return (
    <View style={[styles.gridBox, { width: size, height: size }]}>
      <View style={styles.gridRow}>
        <View style={[styles.gridCell, { borderColor: color }]} />
        <View style={[styles.gridCell, { borderColor: color }]} />
      </View>
      <View style={styles.gridRow}>
        <View style={[styles.gridCell, { borderColor: color }]} />
        <View style={[styles.gridCell, { borderColor: color }]} />
      </View>
    </View>
  );
}

/**
 * 4. Agility Speed Diamond Icon
 */
export function AgilityIcon({ size = 20, color = '#A855F7' }: IconProps) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[styles.diamondTop, { backgroundColor: color }]} />
      <View style={[styles.diamondBottom, { backgroundColor: color }]} />
    </View>
  );
}

/**
 * 5. Star Icon (Interactive Rating)
 */
export function StarIcon({ size = 22, color = '#FBBF24', fill = false }: IconProps) {
  return (
    <Text style={{ fontSize: size, color: fill ? '#FBBF24' : 'rgba(255, 255, 255, 0.45)' }}>
      {fill ? '★' : '☆'}
    </Text>
  );
}

/**
 * 6. Play Triangle Icon
 */
export function PlayIcon({ size = 16, color = '#FFFFFF' }: IconProps) {
  return (
    <View style={styles.center}>
      <View
        style={[
          styles.triangleRight,
          {
            borderLeftWidth: size,
            borderTopWidth: size * 0.6,
            borderBottomWidth: size * 0.6,
            borderLeftColor: color,
          },
        ]}
      />
    </View>
  );
}

/**
 * 7. Navigation Bar Icons
 */
export function NavHomeIcon({ size = 20, color = '#102321' }: IconProps) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[styles.homeRoof, { borderBottomColor: color }]} />
      <View style={[styles.homeBody, { backgroundColor: color }]} />
    </View>
  );
}

export function NavPracticeIcon({ size = 20, color = '#7E8B9B' }: IconProps) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[styles.shuttleMiniCone, { borderColor: color }]} />
      <View style={[styles.shuttleMiniBase, { backgroundColor: color }]} />
    </View>
  );
}

export function NavTrainingIcon({ size = 20, color = '#7E8B9B' }: IconProps) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={styles.chartBarsRow}>
        <View style={[styles.chartBar1, { backgroundColor: color }]} />
        <View style={[styles.chartBar2, { backgroundColor: color }]} />
        <View style={[styles.chartBar3, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

export function NavProfileIcon({ size = 20, color = '#7E8B9B' }: IconProps) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[styles.personHead, { backgroundColor: color }]} />
      <View style={[styles.personBody, { backgroundColor: color }]} />
    </View>
  );
}

// Backwards-compatible exports
export function BoltIcon({ size = 14, color = '#FFFFFF' }: IconProps) {
  return <Text style={{ fontSize: size, color, fontWeight: '800' }}>⚡</Text>;
}
export function ArrowForwardIcon({ size = 16, color = '#FFFFFF' }: IconProps) {
  return <Text style={{ fontSize: size, color, fontWeight: '800' }}>→</Text>;
}
export function CalendarMonthIcon({ size = 20, color = '#28064E' }: IconProps) {
  return <CourtGridIcon size={size} color={color} />;
}
export function SportsTennisIcon({ size = 20, color = '#004C6B' }: IconProps) {
  return <NavPracticeIcon size={size} color={color} />;
}
export function Grid4x4Icon({ size = 22, color = '#2353C6' }: IconProps) {
  return <CourtGridIcon size={size} color={color} />;
}
export function SpeedIcon({ size = 22, color = '#6E5096' }: IconProps) {
  return <AgilityIcon size={size} color={color} />;
}
export function LightbulbIcon({ size = 20, color = '#2353C6' }: IconProps) {
  return <Text style={{ fontSize: size, color }}>💡</Text>;
}
export function HomeIcon({ size = 24, color = '#191B25' }: IconProps) {
  return <NavHomeIcon size={size} color={color} />;
}
export function SchoolIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return <NavTrainingIcon size={size} color={color} />;
}
export function PersonIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return <NavProfileIcon size={size} color={color} />;
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Winged Logo
  wingFeather: {
    width: 22,
    height: 3,
    borderRadius: 2,
    transform: [{ rotate: '-12deg' }],
  },
  wingFeatherMid: {
    width: 17,
    height: 2.6,
    borderRadius: 1.5,
    marginTop: 2,
    marginLeft: 3,
    transform: [{ rotate: '-10deg' }],
  },
  wingFeatherLow: {
    width: 12,
    height: 2.2,
    borderRadius: 1,
    marginTop: 2,
    marginLeft: 6,
    transform: [{ rotate: '-8deg' }],
  },

  // Bell
  bellHanger: {
    width: 3,
    height: 2.5,
    borderRadius: 1.5,
    marginBottom: -1,
  },
  bellDome: {
    width: 13,
    height: 10,
    borderTopLeftRadius: 6.5,
    borderTopRightRadius: 6.5,
    borderWidth: 1.6,
    borderBottomWidth: 0,
  },
  bellRim: {
    width: 16,
    height: 1.8,
    borderRadius: 1,
  },
  bellClapper: {
    width: 3.5,
    height: 2,
    borderBottomLeftRadius: 1.7,
    borderBottomRightRadius: 1.7,
    marginTop: 1,
  },

  // Grid
  gridBox: {
    justifyContent: 'space-between',
    padding: 1,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridCell: {
    width: 7.5,
    height: 7.5,
    borderWidth: 1.8,
    borderRadius: 2,
  },

  // Diamond Agility
  diamondTop: {
    width: 8,
    height: 8,
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  diamondBottom: {
    width: 5,
    height: 5,
    transform: [{ rotate: '45deg' }],
    marginTop: 1,
    opacity: 0.7,
  },

  // Play Triangle
  triangleRight: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },

  // Nav Home
  homeRoof: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  homeBody: {
    width: 11,
    height: 7,
    borderBottomLeftRadius: 1.5,
    borderBottomRightRadius: 1.5,
    marginTop: -0.5,
  },

  // Nav Practice Shuttle
  shuttleMiniCone: {
    width: 12,
    height: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1.6,
    borderBottomWidth: 0,
  },
  shuttleMiniBase: {
    width: 6,
    height: 4,
    borderRadius: 2,
    marginTop: 1,
  },

  // Nav Training Chart
  chartBarsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2.5,
    height: 14,
  },
  chartBar1: {
    width: 3.2,
    height: 6,
    borderRadius: 1,
  },
  chartBar2: {
    width: 3.2,
    height: 12,
    borderRadius: 1,
  },
  chartBar3: {
    width: 3.2,
    height: 9,
    borderRadius: 1,
  },

  // Nav Profile
  personHead: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginBottom: 2,
  },
  personBody: {
    width: 13,
    height: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
});
