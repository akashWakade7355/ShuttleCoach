import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  NavHomeIcon,
  NavPracticeIcon,
  NavTrainingIcon,
  NavProfileIcon,
} from '@/components/dashboard/DashboardIcons';

export interface TabItemConfig {
  key: string;
  name: string;
  href: string;
  label: string;
  icon: 'home' | 'practice' | 'training' | 'profile';
}

export const NAV_TABS: TabItemConfig[] = [
  { key: 'index', name: 'index', href: '/', label: 'Home', icon: 'home' },
  { key: 'practice', name: 'practice', href: '/practice', label: 'Practice', icon: 'practice' },
  { key: 'training-hub', name: 'training-hub', href: '/training-hub', label: 'Training', icon: 'training' },
  { key: 'profile', name: 'profile', href: '/profile', label: 'Profile', icon: 'profile' },
];

interface CurvedScoopNavBarProps {
  currentPath?: string;
  children?: React.ReactNode;
}

const BAR_HEIGHT = 68;
const CIRCLE_SIZE = 52;
const BOWL_WIDTH = 70;
const BOWL_DEPTH = 23;
const FILLET_SIZE = 14;
const TOTAL_SCOOP_WIDTH = BOWL_WIDTH + FILLET_SIZE * 2; // 98px

export function CurvedScoopNavBar({
  currentPath = '/',
  children,
}: CurvedScoopNavBarProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 10);

  // Derive active index
  const getActiveIndex = (path: string): number => {
    if (path === '/' || path === '' || path === '/index') return 0;
    if (path.startsWith('/practice')) return 1;
    if (path.startsWith('/training-hub') || path.startsWith('/training')) return 2;
    if (path.startsWith('/profile')) return 3;
    return 0;
  };

  const activeIndex = getActiveIndex(currentPath);
  const [containerWidth, setContainerWidth] = useState<number>(
    Math.min(Dimensions.get('window').width, 430)
  );

  const tabWidth = containerWidth / NAV_TABS.length;

  // Animation values
  const translateXAnim = useRef(new Animated.Value(activeIndex * tabWidth + tabWidth / 2)).current;
  const bubbleScaleX = useRef(new Animated.Value(1)).current;
  const bubbleScaleY = useRef(new Animated.Value(1)).current;
  const iconScale = useRef(new Animated.Value(1)).current;
  const iconOpacity = useRef(new Animated.Value(1)).current;
  const prevActiveIndexRef = useRef(activeIndex);

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0 && Math.abs(width - containerWidth) > 1) {
      setContainerWidth(width);
    }
  };

  useEffect(() => {
    const targetCenter = activeIndex * tabWidth + tabWidth / 2;
    const isDifferentTab = prevActiveIndexRef.current !== activeIndex;
    prevActiveIndexRef.current = activeIndex;

    if (isDifferentTab) {
      // 1. Fluid Horizontal Glide
      Animated.parallel([
        Animated.spring(translateXAnim, {
          toValue: targetCenter,
          tension: 68,
          friction: 7,
          useNativeDriver: true,
        }),
        // 2. Squash & Stretch dynamic physics
        Animated.sequence([
          // Take-off: stretch horizontally, compress vertically
          Animated.parallel([
            Animated.timing(bubbleScaleX, {
              toValue: 1.15,
              duration: 90,
              useNativeDriver: true,
            }),
            Animated.timing(bubbleScaleY, {
              toValue: 0.88,
              duration: 90,
              useNativeDriver: true,
            }),
          ]),
          // Landing: spring bounce overshoot and settle
          Animated.parallel([
            Animated.spring(bubbleScaleX, {
              toValue: 1,
              tension: 80,
              friction: 5.5,
              useNativeDriver: true,
            }),
            Animated.spring(bubbleScaleY, {
              toValue: 1,
              tension: 80,
              friction: 5.5,
              useNativeDriver: true,
            }),
          ]),
        ]),
        // 3. Active Icon Pop & Scale Sequence
        Animated.sequence([
          Animated.parallel([
            Animated.timing(iconScale, {
              toValue: 0.4,
              duration: 70,
              useNativeDriver: true,
            }),
            Animated.timing(iconOpacity, {
              toValue: 0.2,
              duration: 70,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.spring(iconScale, {
              toValue: 1.12,
              tension: 90,
              friction: 5,
              useNativeDriver: true,
            }),
            Animated.timing(iconOpacity, {
              toValue: 1,
              duration: 120,
              useNativeDriver: true,
            }),
          ]),
          Animated.spring(iconScale, {
            toValue: 1,
            tension: 70,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      translateXAnim.setValue(targetCenter);
    }
  }, [activeIndex, tabWidth, translateXAnim, bubbleScaleX, bubbleScaleY, iconScale, iconOpacity]);

  const activeTab = NAV_TABS[activeIndex] || NAV_TABS[0];

  return (
    <View style={[styles.outerWrapper, { paddingBottom: bottomInset }]} pointerEvents="box-none">
      <View style={styles.navBarCard} onLayout={handleLayout}>
        {/* ================================================================= */}
        {/* 1. SLIDING SCOOPED NOTCH & FLOATING CIRCULAR INDICATOR             */}
        {/* ================================================================= */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.slidingUnit,
            {
              transform: [{ translateX: translateXAnim }],
            },
          ]}>
          {/* A. Concave Cutout Dish (The Scoop with Tangent Fillets) */}
          <View style={styles.scoopDish}>
            {/* Left Fillet: curves gently down from the flat top line */}
            <View style={styles.filletContainer}>
              <View style={styles.filletBg}>
                <View style={styles.leftFilletArc} />
              </View>
            </View>

            {/* Center Cutout Bowl */}
            <View style={styles.scoopBowl}>
              <View style={styles.scoopBorderRing} />
            </View>

            {/* Right Fillet: curves gently down from the flat top line */}
            <View style={styles.filletContainer}>
              <View style={styles.filletBg}>
                <View style={styles.rightFilletArc} />
              </View>
            </View>
          </View>

          {/* B. Floating Elevated Circular Badge with Lime Glow & Elastic Bounce */}
          <Animated.View
            style={[
              styles.floatingCircle,
              {
                transform: [
                  { scaleX: bubbleScaleX },
                  { scaleY: bubbleScaleY },
                ],
              },
            ]}>
            {/* Ambient Radial Lime Glow */}
            <View style={styles.circleGlow} />

            {/* Active Icon Container with Morphing Scale */}
            <Animated.View
              style={[
                styles.floatingIconWrapper,
                {
                  transform: [{ scale: iconScale }],
                  opacity: iconOpacity,
                },
              ]}>
              {activeTab.icon === 'home' && <NavHomeIcon size={24} color="#080C14" />}
              {activeTab.icon === 'practice' && <NavPracticeIcon size={24} color="#080C14" />}
              {activeTab.icon === 'training' && <NavTrainingIcon size={24} color="#080C14" />}
              {activeTab.icon === 'profile' && <NavProfileIcon size={24} color="#080C14" />}
            </Animated.View>
          </Animated.View>
        </Animated.View>

        {/* ================================================================= */}
        {/* 2. TABS ROW: Renders the TabTriggers                             */}
        {/* ================================================================= */}
        <View style={styles.tabsRow}>
          {children}
        </View>
      </View>
    </View>
  );
}

/**
 * Individual Tab Button component designed to be wrapped by <TabTrigger asChild>
 */
export function NavTabButton({
  tab,
  isFocused,
  ref,
  ...props
}: {
  tab: TabItemConfig;
  isFocused?: boolean;
  ref?: any;
}) {
  return (
    <Pressable
      ref={ref}
      {...props}
      accessibilityRole="tab"
      accessibilityLabel={tab.label}
      accessibilityState={{ selected: isFocused }}
      style={({ pressed }) => [
        styles.tabButton,
        pressed && styles.tabButtonPressed,
      ]}>
      {/* Inactive Icon: Hidden when this tab is the active floating one */}
      <View style={[styles.inactiveIconBox, isFocused && styles.hiddenIcon]}>
        {tab.icon === 'home' && (
          <NavHomeIcon size={20} color="rgba(255, 255, 255, 0.45)" />
        )}
        {tab.icon === 'practice' && (
          <NavPracticeIcon size={20} color="rgba(255, 255, 255, 0.45)" />
        )}
        {tab.icon === 'training' && (
          <NavTrainingIcon size={20} color="rgba(255, 255, 255, 0.45)" />
        )}
        {tab.icon === 'profile' && (
          <NavProfileIcon size={20} color="rgba(255, 255, 255, 0.45)" />
        )}
      </View>

      {/* Tab Label: Aligned nicely below */}
      <Text
        style={[
          styles.tabLabel,
          isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
        ]}>
        {tab.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 99,
  },
  navBarCard: {
    width: '100%',
    maxWidth: 430,
    height: BAR_HEIGHT,
    backgroundColor: '#0C131F', // Deep Midnight Navy
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },

  /* 1. SLIDING UNIT */
  slidingUnit: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  /* SCOOPED NOTCH CUTOUT DISH */
  scoopDish: {
    position: 'absolute',
    top: -1,
    left: -TOTAL_SCOOP_WIDTH / 2,
    width: TOTAL_SCOOP_WIDTH,
    height: BOWL_DEPTH + 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  scoopBowl: {
    width: BOWL_WIDTH,
    height: BOWL_DEPTH + 4,
    backgroundColor: '#080C14', // Screen background cuts out the authentic dip
    borderBottomLeftRadius: BOWL_WIDTH / 2,
    borderBottomRightRadius: BOWL_WIDTH / 2,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  scoopBorderRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomLeftRadius: BOWL_WIDTH / 2,
    borderBottomRightRadius: BOWL_WIDTH / 2,
    borderBottomWidth: 1,
    borderColor: 'rgba(212, 255, 0, 0.4)', // Electric Lime highlight on scoop rim
  },

  /* TANGENT FILLET CORNERS */
  filletContainer: {
    width: FILLET_SIZE,
    height: FILLET_SIZE,
    overflow: 'hidden',
  },
  filletBg: {
    width: FILLET_SIZE,
    height: FILLET_SIZE,
    backgroundColor: '#080C14', // Screen background behind fillet
    overflow: 'hidden',
    position: 'relative',
  },
  leftFilletArc: {
    width: FILLET_SIZE * 2,
    height: FILLET_SIZE * 2,
    borderRadius: FILLET_SIZE,
    backgroundColor: '#0C131F', // Navbar card color
    position: 'absolute',
    top: 0,
    left: -FILLET_SIZE,
    borderTopRightRadius: FILLET_SIZE,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  rightFilletArc: {
    width: FILLET_SIZE * 2,
    height: FILLET_SIZE * 2,
    borderRadius: FILLET_SIZE,
    backgroundColor: '#0C131F', // Navbar card color
    position: 'absolute',
    top: 0,
    right: -FILLET_SIZE,
    borderTopLeftRadius: FILLET_SIZE,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  /* FLOATING CIRCULAR INDICATOR */
  floatingCircle: {
    position: 'absolute',
    top: -CIRCLE_SIZE / 2 - 4, // Sits ~30px above the top border!
    left: -CIRCLE_SIZE / 2,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#D4FF00', // AeroCourt Electric Lime
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3.5,
    borderColor: '#0C131F', // Dark boundary ring around the circle
    shadowColor: '#D4FF00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 10,
  },
  circleGlow: {
    position: 'absolute',
    width: CIRCLE_SIZE - 4,
    height: CIRCLE_SIZE - 4,
    borderRadius: (CIRCLE_SIZE - 4) / 2,
    backgroundColor: '#D4FF00',
  },
  floatingIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* 2. TABS ROW */
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  tabButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },
  inactiveIconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  hiddenIcon: {
    opacity: 0, // Elevated floating circle is displayed above
  },
  tabLabel: {
    fontSize: 10.5,
    letterSpacing: 0.2,
  },
  tabLabelInactive: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#D4FF00', // Glowing electric lime active label
    fontWeight: '800',
  },
});
