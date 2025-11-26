import { Platform } from 'react-native';

// Platform-specific shadow utility
export const createShadow = (shadowConfig) => {
  const { shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation } = shadowConfig;
  
  if (Platform.OS === 'web') {
    return {
      boxShadow: `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px rgba(0, 0, 0, ${shadowOpacity})`,
    };
  }
  
  return {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation,
  };
};

export const COLORS = {
  // Primary Colors
  primary: '#FF6B6B',
  primaryDark: '#FF5252',
  
  // Background Colors
  background: '#0a0a0a',
  surface: '#1a1a1a',
  card: '#222222',
  
  // Text Colors
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textMuted: '#888888',
  
  // Accent Colors
  accent: '#4ECDC4',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  
  // Rating/Star Color
  star: '#FFD700',
  
  // Transparent Colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  transparentWhite: 'rgba(255, 255, 255, 0.1)',
  transparentPrimary: 'rgba(255, 107, 107, 0.1)',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  base: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
};

export const BORDER_RADIUS = {
  sm: 6,
  base: 8,
  md: 10,
  lg: 12,
  xl: 15,
  '2xl': 20,
  full: 9999,
};

const shadowConfigs = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const SHADOWS = {
  small: createShadow(shadowConfigs.small),
  medium: createShadow(shadowConfigs.medium),
  large: createShadow(shadowConfigs.large),
};

export default {
  COLORS,
  FONTS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
};