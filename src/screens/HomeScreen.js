import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT, COMMON_STYLES, getResponsiveFontSize, getResponsiveSpacing, getThemeColors } from '../styles/globalStyles';
import {
  fetchTrendingMovies,
  fetchTrendingMusic,
  fetchTrendingPodcasts,
  setFeaturedContent,
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist,
  persistFavoriteItem,
  removePersistentFavorite,
  persistWatchlistItem,
  removePersistentWatchlistItem,
  loadPersistedFavorites,
  loadPersistedWatchlist,
} from '../store/slices/mediaSlice';
import { addToWatchHistory } from '../store/slices/userSlice';

import { moviesApi } from '../services/moviesApi';
import { musicApi } from '../services/musicApi';
import { podcastsApi } from '../services/podcastsApi';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { createShadow } from '../constants/theme';
import { getImageUri, getBackdropUri, getImageProps } from '../utils/imageUtils';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);
  const dispatch = useDispatch();
  
  // Redux selectors using correct state structure
  const trendingMovies = useSelector(state => state.media.trendingMovies);
  const trendingMusic = useSelector(state => state.media.trendingMusic);
  const trendingPodcasts = useSelector(state => state.media.trendingPodcasts);
  const featured = useSelector(state => state.media.featuredContent);
  const loading = useSelector(state => state.media.loading);
  const favorites = useSelector(state => state.media.favorites);
  const watchlist = useSelector(state => state.media.watchlist);
  
  // Local state for UI
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Loading state is a boolean in our mediaSlice
  const isLoading = loading;

  useEffect(() => {
    loadTrendingContent();
    loadPersistedData();
  }, [dispatch]);

  const loadPersistedData = async () => {
    try {
      // Load favorites and watchlist from AsyncStorage
      await Promise.all([
        dispatch(loadPersistedFavorites()),
        dispatch(loadPersistedWatchlist()),
      ]);
    } catch (error) {
      console.error('Error loading persisted data:', error);
    }
  };

  const loadTrendingContent = async () => {
    try {
      // Dispatch Redux actions to fetch content
      await Promise.all([
        dispatch(fetchTrendingMovies()),
        dispatch(fetchTrendingMusic()),
        dispatch(fetchTrendingPodcasts()),
      ]);
    } catch (error) {
      console.error('Error loading trending content:', error);
    }
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSignOut = () => {
    setShowUserMenu(false);
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of StreamBox?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  const renderMediaCard = (item, type) => {
    let title, subtitle, status, statusColor;
    
    switch (type) {
      case 'movie':
        title = item.title || 'Unknown Movie';
        subtitle = item.overview ? item.overview.substring(0, 80) + '...' : 'No description available';
        status = item.vote_average >= 8 ? 'Popular' : item.vote_average >= 6 ? 'Good' : 'Active';
        statusColor = item.vote_average >= 8 ? '#4CAF50' : item.vote_average >= 6 ? '#FF9800' : '#2196F3';
        break;
      case 'music':
        title = item.trackName || 'Unknown Track';
        subtitle = `by ${item.artistName || 'Unknown Artist'}`;
        status = item.trackPrice === 0 ? 'Free' : item.trackTimeMillis > 240000 ? 'Extended' : 'Popular';
        statusColor = item.trackPrice === 0 ? '#4CAF50' : '#FF6B6B';
        break;
      case 'podcast':
        title = item.title || 'Unknown Podcast';
        subtitle = item.description ? item.description.substring(0, 80) + '...' : `by ${item.publisher || 'Unknown Publisher'}`;
        status = item.explicit ? 'Explicit' : item.total_episodes > 50 ? 'Active' : 'Upcoming';
        statusColor = item.explicit ? '#F44336' : item.total_episodes > 50 ? '#4CAF50' : '#FF9800';
        break;
    }

    const handleItemPress = () => {
      // Add to watch history for tracking user interaction
      dispatch(addToWatchHistory({ ...item, type, accessedAt: new Date().toISOString() }));
      
      // Navigate to details screen with complete item data
      navigation.navigate('Details', {
        item,
        type,
        id: item.id || item.trackId,
        title: title,
        imageUri: imageUri,
      });
    };

    const handleFavoritePress = async (e) => {
      e.stopPropagation(); // Prevent item press when tapping favorite
      const itemId = item.id || item.trackId;
      const isFavorited = favorites.some(fav => (fav.id || fav.trackId) === itemId);
      
      try {
        if (isFavorited) {
          // Update local state immediately for responsive UI
          dispatch(removeFromFavorites(itemId));
          // Persist to storage
          await dispatch(removePersistentFavorite(itemId));
        } else {
          const favoriteItem = { ...item, type, favoritedAt: new Date().toISOString() };
          // Update local state immediately for responsive UI
          dispatch(addToFavorites(favoriteItem));
          // Persist to storage
          await dispatch(persistFavoriteItem(favoriteItem));
        }
      } catch (error) {
        console.error('Error updating favorites:', error);
        // Optionally show user feedback
        Alert.alert('Error', 'Failed to update favorites. Please try again.');
      }
    };

    const imageUri = getImageUri(item, type, title);

    return (
      <TouchableOpacity 
        key={item.id || item.trackId || Math.random()} 
        style={styles.enhancedMediaCard}
        onPress={handleItemPress}
        activeOpacity={0.8}
      >
        <View style={styles.cardImageContainer}>
          <Image
            {...getImageProps(imageUri, 'Loading...')}
            style={styles.cardImage}
          />
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={handleFavoritePress}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={favorites.some(fav => (fav.id || fav.trackId) === (item.id || item.trackId)) ? "heart" : "heart-outline"} 
              size={20} 
              color={favorites.some(fav => (fav.id || fav.trackId) === (item.id || item.trackId)) ? "#FF6B6B" : "#fff"} 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.cardSubtitle} numberOfLines={2}>
            {subtitle}
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.ratingContainer}>
              {type === 'movie' && (
                <>
                  <Feather name="star" size={14} color={COLORS.gold} />
                  <Text style={styles.ratingText}>{item.vote_average?.toFixed(1) || 'N/A'}</Text>
                </>
              )}
              {type === 'music' && (
                <>
                  <Feather name="music" size={14} color={COLORS.primary} />
                  <Text style={styles.ratingText}>{Math.floor((item.trackTimeMillis || 0) / 60000)}m</Text>
                </>
              )}
              {type === 'podcast' && (
                <>
                  <Feather name="headphones" size={14} color={COLORS.accent} />
                  <Text style={styles.ratingText}>{item.total_episodes || 0} eps</Text>
                </>
              )}
            </View>
            <TouchableOpacity style={styles.playButton}>
              <Feather name="play" size={16} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFeaturedCard = () => {
    if (!featured) return null;

    const handleFeaturedPress = () => {
      // Add to watch history when featured item is accessed
      dispatch(addToWatchHistory({ ...featured, type: 'movie', accessedAt: new Date().toISOString() }));
      
      // Navigate to details screen
      navigation.navigate('Details', {
        item: featured,
        type: 'movie', // Featured is typically a movie
        id: featured.id,
        title: featured.title,
        imageUri: getBackdropUri(featured, 'Featured Content'),
      });
    };

    const handlePlayNow = (e) => {
      e.stopPropagation();
      // Add to watch history and simulate play action
      dispatch(addToWatchHistory({ ...featured, type: 'movie', playedAt: new Date().toISOString() }));
      Alert.alert(
        'Playing Content',
        `Now playing: ${featured.title}`,
        [{ text: 'OK' }]
      );
    };

    const handleAddToList = async (e) => {
      e.stopPropagation();
      const isInWatchlist = watchlist.some(item => item.id === featured.id);
      
      try {
        if (isInWatchlist) {
          // Update local state immediately for responsive UI
          dispatch(removeFromWatchlist(featured.id));
          // Persist to storage
          await dispatch(removePersistentWatchlistItem(featured.id));
          Alert.alert('Removed', 'Removed from your watchlist');
        } else {
          const watchlistItem = { ...featured, type: 'movie', addedAt: new Date().toISOString() };
          // Update local state immediately for responsive UI
          dispatch(addToWatchlist(watchlistItem));
          // Persist to storage
          await dispatch(persistWatchlistItem(watchlistItem));
          Alert.alert('Added', 'Added to your watchlist');
        }
      } catch (error) {
        console.error('Error updating watchlist:', error);
        Alert.alert('Error', 'Failed to update watchlist. Please try again.');
      }
    };

    const backdropUri = getBackdropUri(featured, 'Featured Content');
    const isInWatchlist = watchlist.some(item => item.id === featured.id);

    return (
      <View style={styles.featuredSection}>
        <Text style={[styles.featuredSectionTitle, { color: themeColors.textPrimary }]}>Featured Today</Text>
        <TouchableOpacity 
          style={styles.featuredCard}
          onPress={handleFeaturedPress}
          activeOpacity={0.9}
        >
          <ImageBackground
            source={{ uri: backdropUri }}
            style={styles.featuredBackground}
            imageStyle={styles.featuredBackgroundImage}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
              style={styles.featuredGradient}
            >
              <View style={styles.featuredContent}>
                <View style={styles.featuredBadge}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.featuredBadgeText}>Featured</Text>
                </View>
                <Text style={styles.featuredTitle} numberOfLines={2}>
                  {featured.title || featured.trackName || 'Featured Content'}
                </Text>
                <Text style={styles.featuredDescription} numberOfLines={3}>
                  {featured.overview || featured.description || 'Discover amazing content'}
                </Text>
                <View style={styles.featuredActions}>
                  <TouchableOpacity 
                    style={styles.playNowButton}
                    onPress={handlePlayNow}
                    activeOpacity={0.8}
                  >
                    <Feather name="play" size={20} color={COLORS.background} />
                    <Text style={styles.playNowText}>Play Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.addToListButton,
                      isInWatchlist && styles.addToListButtonActive
                    ]}
                    onPress={handleAddToList}
                    activeOpacity={0.8}
                  >
                    <Ionicons 
                      name={isInWatchlist ? "checkmark" : "add"} 
                      size={20} 
                      color="#fff" 
                    />
                    <Text style={styles.addToListText}>
                      {isInWatchlist ? "In List" : "My List"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSection = (title, data, type, icon) => {
    const handleSeeAll = () => {
      // Navigate to category-specific screen or a generic list screen
      switch (type) {
        case 'movie':
          navigation.navigate('Movies');
          break;
        case 'music':
          navigation.navigate('Music');
          break;
        case 'podcast':
          navigation.navigate('Podcasts');
          break;
        default:
          // Navigate to search with pre-filled category
          navigation.navigate('Search', { category: type });
      }
    };

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionIconContainer}>
              <Feather name={icon} size={24} color={themeColors.primary} />
            </View>
            <View>
              <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>{title}</Text>
              <Text style={[styles.sectionSubtitle, { color: themeColors.textSecondary }]}>{data.length} items available</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={handleSeeAll}
            activeOpacity={0.7}
          >
            <Text style={[styles.seeAll, { color: themeColors.primary }]}>See All</Text>
            <Feather name="chevron-right" size={16} color={themeColors.primary} />
          </TouchableOpacity>
        </View>
      
      {data.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContainer}
          decelerationRate="fast"
          snapToInterval={180}
        >
          {data.map((item) => renderMediaCard(item, type))}
        </ScrollView>
      ) : (
        <View style={styles.emptySection}>
          <Ionicons name="folder-open-outline" size={48} color="#666" />
          <Text style={styles.emptySectionText}>No {title.toLowerCase()} available</Text>
          <TouchableOpacity style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading trending content...</Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading amazing content...</Text>
          <Text style={styles.loadingSubtext}>Preparing your entertainment experience</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with User Info */}
        <View style={[styles.header, { backgroundColor: themeColors.background }]}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.openDrawer()}
          >
            <Ionicons name="menu" size={24} color={themeColors.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={[styles.greeting, { color: themeColors.textSecondary }]}>{getTimeBasedGreeting()}</Text>
            <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>
              {user?.name || user?.username || 'StreamBox User'}
            </Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Ionicons name="search" size={24} color={themeColors.textPrimary} />
            </TouchableOpacity>
            
            <ThemeToggle style={styles.themeToggle} size={20} />
            
            <TouchableOpacity
              style={styles.userProfileButton}
              onPress={() => setShowUserMenu(!showUserMenu)}
            >
              {user?.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.userAvatar}
                />
              ) : (
                <View style={[styles.userAvatarPlaceholder, { backgroundColor: themeColors.surfaceLight }]}>
                  <Ionicons name="person" size={20} color={themeColors.primary} />
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          {/* User Menu Backdrop - Tap to close */}
          {showUserMenu && (
            <TouchableOpacity 
              style={[styles.menuBackdrop, { backgroundColor: themeColors.overlay }]} 
              activeOpacity={1}
              onPress={() => setShowUserMenu(false)}
            />
          )}
          
          {/* User Menu Dropdown */}
          {showUserMenu && (
            <View style={[styles.userMenu, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
              <View style={styles.userMenuHeader}>
                <View style={[styles.userMenuAvatar, { backgroundColor: themeColors.surfaceLight }]}>
                  <Ionicons name="person" size={24} color={themeColors.primary} />
                </View>
                <View style={styles.userMenuInfo}>
                  <Text style={[styles.userMenuName, { color: themeColors.textPrimary }]}>
                    {user?.name || user?.username}
                  </Text>
                  <Text style={[styles.userMenuEmail, { color: themeColors.textSecondary }]}>{user?.email}</Text>
                </View>
              </View>
              
              <View style={[styles.userMenuDivider, { backgroundColor: themeColors.border }]} />
              
              <TouchableOpacity 
                style={styles.userMenuItem}
                onPress={() => {
                  setShowUserMenu(false);
                  navigation.navigate('Profile');
                }}
              >
                <Ionicons name="person-outline" size={20} color={themeColors.textPrimary} />
                <Text style={[styles.userMenuItemText, { color: themeColors.textPrimary }]}>Edit Profile</Text>
                <Ionicons name="chevron-forward" size={16} color={themeColors.textTertiary} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.userMenuItem}
                onPress={() => {
                  setShowUserMenu(false);
                  navigation.navigate('Settings');
                }}
              >
                <Ionicons name="settings-outline" size={20} color={themeColors.textPrimary} />
                <Text style={[styles.userMenuItemText, { color: themeColors.textPrimary }]}>Settings</Text>
                <Ionicons name="chevron-forward" size={16} color={themeColors.textTertiary} />
              </TouchableOpacity>
              
              <View style={[styles.userMenuDivider, { backgroundColor: themeColors.border }]} />
              
              <TouchableOpacity style={[styles.userMenuItem, styles.signOutMenuItem]} onPress={handleSignOut}>
                <Ionicons name="log-out-outline" size={20} color={themeColors.error} />
                <Text style={[styles.userMenuItemText, styles.signOutText, { color: themeColors.error }]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeText, { color: themeColors.textPrimary }]}>What do you want to watch today?</Text>
        </View>

        {/* Featured Content */}
        {renderFeaturedCard()}

        {/* Trending Sections */}
        {renderSection('Trending Movies', trendingMovies, 'movie', 'film-outline')}
        {renderSection('Popular Music', trendingMusic, 'music', 'musical-notes-outline')}
        {renderSection('Top Podcasts', trendingPodcasts, 'podcast', 'radio-outline')}

        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Backdrop for closing menu */}
      {showUserMenu && (
        <TouchableOpacity
          style={styles.menuBackdrop}
          onPress={() => setShowUserMenu(false)}
          activeOpacity={1}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 40,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    position: 'relative',
  },
  menuButton: {
    padding: 4,
    marginRight: 12,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    padding: 4,
    marginRight: 12,
  },
  themeToggle: {
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  userProfileButton: {
    marginLeft: 15,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  userAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  userMenu: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    minWidth: 200,
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }),
    zIndex: 1000,
  },
  userMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 8,
  },
  userMenuAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  userMenuInfo: {
    flex: 1,
  },
  userMenuName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userMenuEmail: {
    color: '#888',
    fontSize: 13,
  },
  userMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  userMenuItemText: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
    marginLeft: 12,
    fontWeight: '500',
  },
  userMenuDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 8,
  },
  signOutMenuItem: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  signOutText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  welcomeContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  featuredContainer: {
    height: 250,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  featuredBackground: {
    flex: 1,
  },
  featuredImage: {
    borderRadius: 15,
  },
  featuredGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  featuredContent: {
    padding: 20,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featuredOverview: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  featuredButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  playButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 8,
  },
  playButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  // Enhanced Card Styles
  enhancedMediaCard: {
    width: 160,
    marginRight: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardImageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#333',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    padding: 6,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  cardSubtitle: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#aaa',
    fontSize: 11,
    fontWeight: '500',
  },
  playButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 15,
    padding: 6,
  },

  // Featured Card Styles
  featuredSection: {
    marginBottom: 25,
  },
  featuredSectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  featuredCard: {
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
    height: 300,
  },
  featuredBackground: {
    width: '100%',
    height: '100%',
  },
  featuredBackgroundImage: {
    borderRadius: 15,
  },
  featuredGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  featuredContent: {
    padding: 20,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
    gap: 5,
  },
  featuredBadgeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 28,
  },
  featuredDescription: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  featuredActions: {
    flexDirection: 'row',
    gap: 12,
  },
  playNowButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  playNowText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addToListButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  addToListText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addToListButtonActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },

  // Enhanced Section Styles
  sectionIconContainer: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 8,
    padding: 6,
    marginRight: 4,
  },
  sectionSubtitle: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 20,
  },
  emptySection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptySectionText: {
    color: '#888',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 15,
  },
  refreshButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Legacy styles (keeping for compatibility)
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  mediaList: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
  },
  mediaCard: {
    width: 120,
  },
  mediaImage: {
    width: 120,
    height: 180,
    borderRadius: 10,
    backgroundColor: '#333',
  },
  mediaTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  mediaSubtitle: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  bottomPadding: {
    height: getResponsiveSpacing(SPACING.lg),
  },

  // Updated styles with design system
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getResponsiveSpacing(SPACING.lg),
    paddingVertical: getResponsiveSpacing(SPACING.lg),
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: getResponsiveFontSize(TYPOGRAPHY.sm),
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  userNameText: {
    fontSize: getResponsiveFontSize(TYPOGRAPHY.xl),
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
});

export default HomeScreen;