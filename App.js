import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ActivityIndicator, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
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
const Drawer = createDrawerNavigator();

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

// Custom Drawer Content
const CustomDrawerContent = (props) => {
  const { user, signOut } = useAuth();
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);
  
  const handleSignOut = () => {
    signOut();
  };

  const themedStyles = StyleSheet.create({
    drawerContainer: {
      flex: 1,
      backgroundColor: themeColors.surface,
    },
    drawerHeader: {
      backgroundColor: themeColors.surface,
      padding: SPACING['2xl'],
      alignItems: 'center',
      marginBottom: SPACING['3xl'],
    },
    userAvatar: {
      width: 60,
      height: 60,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: themeColors.surfaceLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.md,
      borderWidth: 2,
      borderColor: themeColors.primary,
    },
    userName: {
      fontSize: TYPOGRAPHY.xl,
      fontWeight: 'bold',
      color: themeColors.textPrimary,
      marginBottom: SPACING.xs,
    },
    userEmail: {
      color: themeColors.textSecondary,
      fontSize: TYPOGRAPHY.sm,
    },
    drawerItems: {
      flex: 1,
    },
    drawerFooter: {
      borderTopWidth: 1,
      borderTopColor: themeColors.border,
      padding: SPACING['2xl'],
    },
    signOutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: themeColors.surfaceLight,
      marginBottom: SPACING.md,
    },
    signOutText: {
      color: themeColors.error,
      fontSize: TYPOGRAPHY.lg,
      fontWeight: '500',
      marginLeft: SPACING.md,
    },
  });

  return (
    <DrawerContentScrollView {...props} style={themedStyles.drawerContainer}>
      {/* User Profile Section */}
      <View style={themedStyles.drawerHeader}>
        <View style={themedStyles.userAvatar}>
          <Feather name="user" size={32} color={themeColors.primary} />
        </View>
        <Text style={themedStyles.userName}>{user?.name || 'User'}</Text>
        <Text style={themedStyles.userEmail}>{user?.email}</Text>
      </View>
      
      {/* Drawer Items */}
      <View style={themedStyles.drawerItems}>
        <DrawerItemList {...props} />
      </View>
      
      {/* Theme Toggle */}
      <View style={themedStyles.drawerFooter}>
        <ThemeToggle showLabel style={{ marginBottom: SPACING.md }} />
        
        {/* Sign Out Button */}
        <TouchableOpacity style={themedStyles.signOutButton} onPress={handleSignOut}>
          <Feather name="log-out" size={20} color={themeColors.error} />
          <Text style={themedStyles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

// Home Stack Navigator (includes search functionality)
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
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
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
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
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
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
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
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
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
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
    </Tab.Navigator>
  );
};

// Main Drawer Navigator (wraps the tab navigator)
const MainDrawerNavigator = () => {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: themeColors.surface,
          width: 280,
        },
        drawerActiveTintColor: themeColors.primary,
        drawerInactiveTintColor: themeColors.textSecondary,
        drawerLabelStyle: {
          fontSize: TYPOGRAPHY.lg,
          fontWeight: '500',
        },
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={MainTabNavigator}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          drawerLabel: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          drawerLabel: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Authentication stack (unauthenticated users)
const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0a0a0a' },
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
      {isAuthenticated ? <MainDrawerNavigator /> : <AuthStackNavigator />}
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
});
