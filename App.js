import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ActivityIndicator, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
// import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT, COMMON_STYLES, BORDER_RADIUS, getThemeColors } from './src/styles/globalStyles';
import { Provider } from 'react-redux';
import store from './src/store';
import ThemeToggle from './src/components/ThemeToggle';

// Import contexts
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

// Import screens
import MoviesScreen from './src/screens/MoviesScreen';
import MusicScreen from './src/screens/MusicScreen';
import PodcastsScreen from './src/screens/PodcastsScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SearchScreen from './src/screens/SearchScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator(); // Temporarily disabled for Expo Go compatibility

// Loading screen component
const LoadingScreen = () => {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  const loadingStyles = StyleSheet.create({
    loadingContainer: {
      ...COMMON_STYLES.loadingContainer,
      backgroundColor: themeColors.background,
    },
    loadingText: {
      color: themeColors.primary,
      fontSize: TYPOGRAPHY.xl,
      fontWeight: 'bold',
      marginTop: SPACING.lg,
    },
    loadingSubtext: {
      color: themeColors.textSecondary,
      fontSize: TYPOGRAPHY.sm,
      marginTop: SPACING.xs,
    },
  });

  return (
    <View style={loadingStyles.loadingContainer}>
      <ActivityIndicator size="large" color={themeColors.primary} />
      <Text style={loadingStyles.loadingText}>StreamBox</Text>
      <Text style={loadingStyles.loadingSubtext}>Loading your entertainment...</Text>
    </View>
  );
};

// Custom Drawer Content - Removed for stack navigation compatibility
// This component has been commented out because it depends on @react-navigation/drawer
// which requires react-native-reanimated that causes worklets errors on iOS
// Profile and Settings are now accessible via bottom tabs instead

// Home Stack Navigator (includes search functionality)
const HomeStackNavigator = () => {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.surface,
        },
        headerTintColor: themeColors.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Movies Stack Navigator
const MoviesStackNavigator = () => {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.surface,
        },
        headerTintColor: themeColors.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="MoviesMain" 
        component={MoviesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Music Stack Navigator
const MusicStackNavigator = () => {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.surface,
        },
        headerTintColor: themeColors.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="MusicMain" 
        component={MusicScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Podcasts Stack Navigator
const PodcastsStackNavigator = () => {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.surface,
        },
        headerTintColor: themeColors.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="PodcastsMain" 
        component={PodcastsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Favorites Stack Navigator
const FavoritesStackNavigator = () => {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.surface,
        },
        headerTintColor: themeColors.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="FavoritesList" 
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Main app tabs (authenticated users)
const MainTabNavigator = () => {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Movies') {
            iconName = 'film';
          } else if (route.name === 'Music') {
            iconName = 'music';
          } else if (route.name === 'Podcasts') {
            iconName = 'radio';
          } else if (route.name === 'Favorites') {
            iconName = 'heart';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.textTertiary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: themeColors.surface,
          borderTopColor: themeColors.border,
          height: LAYOUT.tabBarHeight,
          paddingBottom: SPACING.sm,
          paddingTop: SPACING.sm,
        },
        tabBarLabelStyle: {
          fontSize: TYPOGRAPHY.xs,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Movies" component={MoviesStackNavigator} />
      <Tab.Screen name="Music" component={MusicStackNavigator} />
      <Tab.Screen name="Podcasts" component={PodcastsStackNavigator} />
      <Tab.Screen name="Favorites" component={FavoritesStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

// Main Navigator (temporarily using stack instead of drawer for Expo Go compatibility)
const MainNavigator = () => {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: themeColors.surface,
          borderBottomWidth: 1,
          borderBottomColor: themeColors.border,
        },
        headerTintColor: themeColors.textPrimary,
        headerTitleStyle: {
          fontSize: TYPOGRAPHY.xl,
          fontWeight: 'bold',
          color: themeColors.textPrimary,
        },
        cardStyle: { backgroundColor: themeColors.background },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabNavigator}
        options={{
          title: 'StreamBox',
          headerRight: () => <ThemeToggle />,
        }}
      />
    </Stack.Navigator>
  );
};

// Authentication stack (unauthenticated users)
const AuthStackNavigator = () => {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: themeColors.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Main navigation component
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthStackNavigator />}
      <StatusBar 
        style={isDarkMode ? "light" : "dark"} 
        backgroundColor={themeColors.background} 
        translucent 
      />
    </NavigationContainer>
  );
};

// Main App component
export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    ...COMMON_STYLES.loadingContainer,
  },
  loadingText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.xl,
    fontWeight: 'bold',
    marginTop: SPACING.lg,
  },
  loadingSubtext: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sm,
    marginTop: SPACING.xs,
  },
  drawerContainer: {
    backgroundColor: COLORS.surface,
  },
  /* Drawer styles commented out for stack navigation
  drawerHeader: {
    padding: SPACING['2xl'],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.xl,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  userEmail: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sm,
  },
  drawerItems: {
    flex: 1,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SPACING['2xl'],
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
  },
  signOutText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.lg,
    fontWeight: '500',
    marginLeft: SPACING.md,
  },
  */
});
