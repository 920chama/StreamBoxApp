# Dark/Light Mode Toggle Feature

## Overview
StreamBox now includes a comprehensive dark/light mode toggle feature that allows users to switch between dark and light themes throughout the application.

## Features

### 🎨 **Theme System**
- **Dark Mode**: Deep blacks and dark grays with high contrast
- **Light Mode**: Clean whites and light grays for better daylight usage
- **Consistent**: All screens and components automatically adapt to the selected theme
- **Persistent**: Theme preference is saved and restored between app sessions

### 🎯 **Theme Toggle Locations**
1. **Drawer Menu**: Main toggle with label in the navigation drawer
2. **Home Screen Header**: Quick access toggle in the top navigation bar
3. **Settings Screen**: Traditional settings location (can be added if SettingsScreen exists)

### 📱 **Responsive Design**
- Icons change based on theme (sun for dark mode, moon for light mode)
- Status bar automatically adapts to the theme
- All navigation elements (tabs, drawer) use themed colors
- Loading screens and overlays respect the theme

## Implementation Details

### 🏗️ **Architecture**
```
src/
├── contexts/ThemeContext.js     # Theme state management
├── hooks/useThemedStyles.js     # Theme utilities hook
├── components/ThemeToggle.js    # Reusable toggle component
└── styles/globalStyles.js       # Updated with theme support
```

### 🔧 **Key Components**

#### **ThemeContext**
- Manages global theme state
- Persists theme preference using AsyncStorage
- Provides `isDarkMode`, `toggleTheme`, and `theme` values

#### **ThemeToggle Component**
- Reusable component that can be placed anywhere
- Supports different sizes and label options
- Uses Feather icons for consistent styling

#### **Updated GlobalStyles**
- `THEME_COLORS`: Contains both dark and light color schemes
- `getThemeColors(isDarkMode)`: Returns appropriate colors for current theme
- Backward compatibility with existing `COLORS` export

### 💡 **Usage Examples**

#### **Using ThemeToggle Component**
```jsx
import ThemeToggle from '../components/ThemeToggle';

// Basic toggle
<ThemeToggle />

// With label and custom size
<ThemeToggle showLabel size={28} style={{ margin: 10 }} />
```

#### **Using Themed Colors in Components**
```jsx
import { useThemedStyles } from '../hooks/useThemedStyles';

const MyComponent = () => {
  const { colors, isDarkMode } = useThemedStyles();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    text: {
      color: colors.textPrimary,
    },
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Themed content</Text>
    </View>
  );
};
```

#### **Direct Theme Access**
```jsx
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../styles/globalStyles';

const MyComponent = () => {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);
  
  // Use themeColors.primary, themeColors.background, etc.
};
```

## Color Schemes

### 🌙 **Dark Mode Colors**
- Background: `#0A0A0A` (Deep black)
- Surface: `#1A1A1A` (Dark gray)
- Text Primary: `#FFFFFF` (Pure white)
- Text Secondary: `#CCCCCC` (Light gray)
- Primary: `#FF6B6B` (Coral red)

### ☀️ **Light Mode Colors**
- Background: `#FFFFFF` (Pure white)
- Surface: `#F5F5F5` (Light gray)
- Text Primary: `#000000` (Pure black)
- Text Secondary: `#333333` (Dark gray)
- Primary: `#FF6B6B` (Coral red)

## Integration Points

### 📱 **Updated Components**
- `App.js`: Main navigation with themed StatusBar
- `HomeScreen.js`: Header with theme toggle
- `CustomDrawerContent`: Themed drawer with toggle
- `MainTabNavigator`: Themed tab bar
- `MainDrawerNavigator`: Themed drawer navigation

### 🔄 **Automatic Features**
- Theme preference persistence
- StatusBar automatic adjustment
- Navigation component theming
- Loading screen theming

## Benefits

### 👥 **User Experience**
- **Accessibility**: Better contrast options for different lighting conditions
- **Eye Comfort**: Dark mode reduces eye strain in low-light environments
- **Personalization**: Users can choose their preferred viewing experience
- **Modern UX**: Follows current design trends and user expectations

### 🔧 **Developer Experience**
- **Consistent**: Centralized theme management
- **Scalable**: Easy to add new themed components
- **Maintainable**: Single source of truth for colors
- **Flexible**: Can easily add more themes (e.g., blue, green variants)

## Future Enhancements
- System theme detection (follow device settings)
- Additional theme variants (blue, green, purple)
- Automatic theme switching based on time of day
- Theme animations and transitions
- Custom theme creation

---

**Note**: The theme system is designed to be backward compatible. Existing components using the old `COLORS` export will continue to work in dark mode, while new components can take advantage of the full theming capabilities.