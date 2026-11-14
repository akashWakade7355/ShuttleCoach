import '@/global.css';

import { Platform } from 'react-native';

/**
 * AeroCourt Core Color Palette
 * Approved brand tokens for high-performance badminton shadow practice.
 */
export const AeroColors = {
  // Core Brand Tokens
  deepTeal: '#123B3A',
  seafoam: '#65C9B8',
  warmCream: '#F5F0E6',
  pureWhite: '#FFFFFF',
  darkSlate: '#263331',
  mutedSage: '#879B94',
  softTealTint: '#E0F0EA',
  darkTrainingBackground: '#102321',
  trainingText: '#F7F8F3',

  // Semantic & Contextual Tokens
  primary: '#002524',
  secondary: '#006B5E',
  surface: '#EEFDF9',
  surfaceCard: '#FFFFFF',
  primaryContainer: '#123B3A',
  secondaryContainer: '#8EF1DF',
  tertiaryContainer: '#273934',
  outline: '#717978',
  outlineVariant: '#C0C8C7',
  error: '#BA1A1A',
  warning: '#E6A23C',
} as const;

/**
 * Theme-aware colors supporting light and dark modes
 */
export const Colors = {
  light: {
    ...AeroColors,
    text: AeroColors.darkSlate,
    textSecondary: AeroColors.mutedSage,
    background: AeroColors.warmCream,
    backgroundElement: AeroColors.softTealTint,
    backgroundSelected: AeroColors.seafoam,
    card: AeroColors.pureWhite,
    cardBorder: 'rgba(18, 59, 58, 0.08)',
  },
  dark: {
    ...AeroColors,
    text: AeroColors.trainingText,
    textSecondary: AeroColors.mutedSage,
    background: AeroColors.darkTrainingBackground,
    backgroundElement: AeroColors.darkSlate,
    backgroundSelected: AeroColors.deepTeal,
    card: '#152E2B',
    cardBorder: 'rgba(101, 201, 184, 0.15)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Spacing scale (multiples of 4/8 with ergonomic touch targets)
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  gutter: 16,
  margin: 20,

  // Backwards compatibility for existing template components
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/**
 * Border radius tokens
 */
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

/**
 * Elevation and depth tokens
 */
export const Shadows = {
  level0: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  level1: {
    shadowColor: AeroColors.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  level2: {
    shadowColor: AeroColors.deepTeal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;

/**
 * Typography scale
 */
export const Typography = {
  displayLg: {
    fontSize: 36,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
    lineHeight: 44,
  },
  headlineLg: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    lineHeight: 36,
  },
  headlineMd: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
    lineHeight: 28,
  },
  headlineSm: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
    lineHeight: 24,
  },
  bodyLg: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMd: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodySm: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  labelLg: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  labelMd: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
    lineHeight: 16,
  },
  labelSm: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    lineHeight: 14,
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
    serif: 'var(--font-serif, serif)',
    rounded: 'var(--font-rounded, sans-serif)',
    mono: 'var(--font-mono, monospace)',
  },
});

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
