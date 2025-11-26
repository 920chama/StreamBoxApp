import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Screen Size Detection
export const SCREEN_SIZES = {
  isSmallDevice: width < 380,
  isMediumDevice: width >= 380 && width < 768,
  isLargeDevice: width >= 768 && width < 1024,
  isExtraLarge: width >= 1024,
  isTablet: width >= 768,
  isPhone: width < 768,
};

// Responsive Grid Columns
export const getGridColumns = () => {
  if (SCREEN_SIZES.isSmallDevice) return 1;
  if (SCREEN_SIZES.isMediumDevice) return 2;
  if (SCREEN_SIZES.isLargeDevice) return 3;
  return 4; // Extra large devices
};

// Dynamic spacing based on screen size
export const getResponsivePadding = () => {
  if (SCREEN_SIZES.isSmallDevice) return 12;
  if (SCREEN_SIZES.isMediumDevice) return 16;
  if (SCREEN_SIZES.isLargeDevice) return 20;
  return 24; // Extra large devices
};

// Theme Colors
export const THEME_COLORS = {
  dark: {
    // Primary Colors
    primary: '#FF6B6B',
    primaryLight: '#FF8E8E',
    primaryDark: '#E55555',
    
    // Background Colors
    background: '#0A0A0A',
    surface: '#1A1A1A',
    surfaceLight: '#2A2A2A',
    
    // Text Colors
    textPrimary: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textTertiary: '#888888',
    textMuted: '#666666',
    
    // Status Colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Accent Colors
    accent: '#9C27B0',
    gold: '#FFD700',
    
    // Border Colors
    border: '#333333',
    borderLight: '#444444',
    
    // Overlay Colors
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.5)',
  },
  light: {
    // Primary Colors
    primary: '#FF6B6B',
    primaryLight: '#FF8E8E',
    primaryDark: '#E55555',
    
    // Background Colors
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceLight: '#FAFAFA',
    
    // Text Colors
    textPrimary: '#000000',
    textSecondary: '#333333',
    textTertiary: '#666666',
    textMuted: '#999999',
    
    // Status Colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Accent Colors
    accent: '#9C27B0',
    gold: '#FFD700',
    
    // Border Colors
    border: '#E0E0E0',
    borderLight: '#F0F0F0',
    
    // Overlay Colors
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
  },
};

// Function to get current theme colors
export const getThemeColors = (isDarkMode = true) => {
  return THEME_COLORS[isDarkMode ? 'dark' : 'light'];
};

// Default to dark theme for backward compatibility
export const COLORS = THEME_COLORS.dark;

export const TYPOGRAPHY = {
  // Font Families
  fontRegular: Platform.OS === 'ios' ? 'System' : 'Roboto',
  fontMedium: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  fontBold: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold',
  
  // Font Sizes
  xs: 10,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
  '6xl': 36,
  
  // Line Heights
  lineHeight: {
    xs: 14,
    sm: 16,
    base: 20,
    lg: 24,
    xl: 28,
    '2xl': 32,
    '3xl': 36,
    '4xl': 40,
    '5xl': 44,
    '6xl': 48,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
};

export const LAYOUT = {
  // Screen Dimensions
  screenWidth: width,
  screenHeight: height,
  
  // Safe Area
  headerHeight: Platform.OS === 'ios' ? 88 : 64,
  tabBarHeight: Platform.OS === 'ios' ? 83 : 60,
  statusBarHeight: Platform.OS === 'ios' ? 44 : 24,
  
  // Responsive Content Padding
  contentPadding: getResponsivePadding(),
  sectionPadding: SPACING['2xl'],
  
  // Card Dimensions
  cardBorderRadius: BORDER_RADIUS.md,
  imageAspectRatio: 16 / 9,
  posterAspectRatio: 2 / 3,
  
  // Responsive Grid
  gridGutter: SCREEN_SIZES.isSmallDevice ? SPACING.sm : SPACING.md,
  gridColumns: getGridColumns(),
  
  // Breakpoints (for responsive design)
  breakpoints: {
    xs: 320,
    sm: 380,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1440,
  },
  
  // Responsive Item Dimensions
  movieCardWidth: SCREEN_SIZES.isSmallDevice ? width - 40 : 
                  SCREEN_SIZES.isMediumDevice ? (width - 60) / 2 : 
                  SCREEN_SIZES.isLargeDevice ? (width - 80) / 3 : 
                  (width - 100) / 4,
};

// Common Style Components
export const COMMON_STYLES = {
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  contentContainer: {
    flexGrow: 1,
    padding: LAYOUT.contentPadding,
  },
  
  // Card Styles
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.cardBorderRadius,
    ...SHADOWS.md,
  },
  
  cardContent: {
    padding: SPACING.lg,
  },
  
  // Button Styles
  button: {
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  // Text Styles
  title: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.lineHeight['3xl'],
  },
  
  subtitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: '600',
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.xl,
  },
  
  body: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  
  caption: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textTertiary,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
  },
  
  // Input Styles
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
  },
  
  inputFocused: {
    borderColor: COLORS.primary,
  },
  
  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  
  // Empty State Styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING['3xl'],
  },
  
  emptyStateText: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
  
  // Header Styles
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  
  headerTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  
  // Tab Styles
  tabContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  
  tab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  
  tabText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  
  tabTextActive: {
    color: COLORS.textPrimary,
  },
};

// Utility Functions
export const getResponsiveFontSize = (baseSize, scale = 1) => {
  const { screenWidth } = LAYOUT;
  const { sm, md, lg } = LAYOUT.breakpoints;
  
  if (screenWidth < sm) {
    return baseSize * 0.9 * scale;
  } else if (screenWidth < md) {
    return baseSize * scale;
  } else if (screenWidth < lg) {
    return baseSize * 1.1 * scale;
  } else {
    return baseSize * 1.2 * scale;
  }
};

export const getResponsiveSpacing = (baseSpacing, scale = 1) => {
  const { screenWidth } = LAYOUT;
  const { sm, md } = LAYOUT.breakpoints;
  
  if (screenWidth < sm) {
    return baseSpacing * 0.8 * scale;
  } else if (screenWidth < md) {
    return baseSpacing * scale;
  } else {
    return baseSpacing * 1.2 * scale;
  }
};

export const getGridItemWidth = (columns = 2, spacing = SPACING.md) => {
  const { screenWidth } = LAYOUT;
  const totalSpacing = spacing * (columns + 1);
  const availableWidth = screenWidth - (getResponsivePadding() * 2) - totalSpacing;
  return availableWidth / columns;
};

// Get responsive card dimensions for different content types
export const getCardDimensions = (type = 'movie') => {
  const columns = getGridColumns();
  const spacing = LAYOUT.gridGutter;
  const width = getGridItemWidth(columns, spacing);
  
  switch (type) {
    case 'movie':
      return {
        width: width,
        height: width * 1.6, // Movie poster aspect ratio
        columns: columns
      };
    case 'music':
      return {
        width: width,
        height: SCREEN_SIZES.isSmallDevice ? 80 : 100,
        columns: 1 // Music tracks are always single column lists
      };
    case 'podcast':
      return {
        width: width,
        height: width * 0.8,
        columns: columns
      };
    default:
      return { width, height: width, columns };
  }
};

// For backward compatibility with existing code
export const FONT_SIZES = {
  xs: TYPOGRAPHY.xs,
  sm: TYPOGRAPHY.sm,
  base: TYPOGRAPHY.base,
  lg: TYPOGRAPHY.lg,
  xl: TYPOGRAPHY.xl,
  '2xl': TYPOGRAPHY['2xl'],
  '3xl': TYPOGRAPHY['3xl'],
  '4xl': TYPOGRAPHY['4xl'],
  '5xl': TYPOGRAPHY['5xl'],
  '6xl': TYPOGRAPHY['6xl'],
};

export default {
  COLORS,
  THEME_COLORS,
  getThemeColors,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  LAYOUT,
  COMMON_STYLES,
  FONT_SIZES,
  SCREEN_SIZES,
  getResponsiveFontSize,
  getResponsiveSpacing,
  getResponsivePadding,
  getGridColumns,
  getGridItemWidth,
  getCardDimensions,
};