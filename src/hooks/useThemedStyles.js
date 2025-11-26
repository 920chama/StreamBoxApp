import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, LAYOUT, COMMON_STYLES } from '../styles/globalStyles';

export const useThemedStyles = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  return {
    colors,
    typography: TYPOGRAPHY,
    spacing: SPACING,
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
    layout: LAYOUT,
    commonStyles: COMMON_STYLES,
    isDarkMode,
  };
};

export default useThemedStyles;