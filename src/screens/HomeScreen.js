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
  RefreshControl,
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
  setTrendingMovies,
  setTrendingMusic,
  setTrendingPodcasts,
  addToFavorites,
  removeFromFavorites,
  clearSampleData,
  clearPersistentSampleData,
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
  const trendingMovies = useSelector(state => state.media.trendingMovies) || [];
  const trendingMusic = useSelector(state => state.media.trendingMusic) || [];
  const trendingPodcasts = useSelector(state => state.media.trendingPodcasts) || [];
  const featured = useSelector(state => state.media.featuredContent);
  const loading = useSelector(state => state.media.loading);
  const favorites = useSelector(state => state.media.favorites) || [];
  const watchlist = useSelector(state => state.media.watchlist) || [];
  
  // Debug Redux state
  console.log('HomeScreen Redux State:', {
    moviesCount: trendingMovies?.length,
    musicCount: trendingMusic?.length, 
    podcastsCount: trendingPodcasts?.length,
    isLoading: loading
  });
  
  // Local state for UI
  const [refreshing, setRefreshing] = useState(false);
  
  // Loading state is a boolean in our mediaSlice
  const isLoading = loading;

  useEffect(() => {
    // Force reload content immediately
    const initializeData = async () => {
      console.log('HomeScreen: Initializing data...');
      
      // Clear any old sample data from favorites/watchlist first
      dispatch(clearPersistentSampleData());
      
      // Add immediate test data to verify UI works
      const testMovies = [
        {
          id: 1,
          title: "Avatar: The Way of Water",
          overview: "Set more than a decade after the events of the first film, learn the story of the Sully family.",
          poster_path: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
          vote_average: 8.5,
          release_date: "2023-01-01"
        },
        {
          id: 2,
          title: "Black Panther: Wakanda Forever",
          overview: "Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje fight to protect their nation.",
          poster_path: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
          vote_average: 7.8,
          release_date: "2023-02-01"
        }
      ];

      const testMusic = [
        {
          trackId: 1,
          trackName: "Anti-Hero",
          artistName: "Taylor Swift",
          artworkUrl100: "https://picsum.photos/300/300?random=1",
          trackTimeMillis: 200560,
          trackPrice: 1.29
        },
        {
          trackId: 2,
          trackName: "Flowers",
          artistName: "Miley Cyrus", 
          artworkUrl100: "https://picsum.photos/300/300?random=2",
          trackTimeMillis: 200000,
          trackPrice: 1.29
        }
      ];

      const testPodcasts = [
        {
          id: 1,
          title: "The Joe Rogan Experience",
          description: "The official podcast of comedian Joe Rogan featuring conversations with fascinating guests.",
          image: "https://picsum.photos/300/300?random=3",
          publisher: "Joe Rogan",
          total_episodes: 2000,
          explicit: false
        },
        {
          id: 2,
          title: "Crime Junkie",
          description: "If you can never get enough true crime... Congratulations, you've found your people.",
          image: "https://picsum.photos/300/300?random=4",
          publisher: "audiochuck",
          total_episodes: 400,
          explicit: false
        }
      ];
      
      // Set test data immediately 
      console.log('Setting test data...');
      console.log('Test music URLs:', testMusic.map(m => m.artworkUrl100));
      console.log('Test podcast URLs:', testPodcasts.map(p => p.image));
      dispatch(setTrendingMovies(testMovies));
      dispatch(setTrendingMusic(testMusic));
      dispatch(setTrendingPodcasts(testPodcasts));
      
      await loadPersistedData();
      
      // Also try to load real data in the background
      try {
        await loadTrendingContent();
      } catch (error) {
        console.error('Error loading real content:', error);
      }
      
      // Debug current data state
      setTimeout(() => {
        console.log('Post-initialization state:', {
          movies: trendingMovies?.length,
          music: trendingMusic?.length,
          podcasts: trendingPodcasts?.length
        });
      }, 1000);
    };
    
    initializeData();
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

  const loadTrendingContent = async (showLoading = true) => {
    try {
      console.log('Starting to load trending content...');
      
      // Dispatch Redux actions to fetch content with better error tracking
      const results = await Promise.allSettled([
        dispatch(fetchTrendingMovies()),
        dispatch(fetchTrendingMusic()),
        dispatch(fetchTrendingPodcasts()),
      ]);
      
      // Log any failures with more detail
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const types = ['movies', 'music', 'podcasts'];
          console.warn(`Failed to load trending ${types[index]}:`, result.reason);
        } else {
          const types = ['movies', 'music', 'podcasts'];
          console.log(`Successfully loaded trending ${types[index]}`);
        }
      });
      
      // Check if all requests failed
      const allFailed = results.every(result => result.status === 'rejected');
      if (allFailed) {
        console.warn('All content requests failed, using fallback data');
      }
      
      // Force immediate state check
      setTimeout(() => {
        console.log('Post-load Redux state check:', {
          movies: trendingMovies?.length,
          music: trendingMusic?.length,
          podcasts: trendingPodcasts?.length
        });
      }, 500);
      
    } catch (error) {
      console.error('Error loading trending content:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrendingContent(false);
    await loadPersistedData();
    setRefreshing(false);
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSignOut = () => {
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
    let title, subtitle, status, statusColor, imageUri;
    
    switch (type) {
      case 'movie':
        title = item.title || 'Unknown Movie';
        subtitle = item.overview ? item.overview.substring(0, 80) + '...' : 'No description available';
        status = item.vote_average >= 8 ? 'Popular' : item.vote_average >= 6 ? 'Good' : 'New';
        statusColor = item.vote_average >= 8 ? '#4CAF50' : item.vote_average >= 6 ? '#FF9800' : '#2196F3';
        imageUri = getImageUri(item, type, title);
        break;
      case 'music':
        title = item.trackName || 'Unknown Track';
        subtitle = `by ${item.artistName || 'Unknown Artist'}`;
        status = item.trackPrice === 0 ? 'Free' : item.trackTimeMillis > 240000 ? 'Extended' : 'Popular';
        statusColor = item.trackPrice === 0 ? '#4CAF50' : '#FF6B6B';
        // Use direct URL for music artwork with fallbacks
        imageUri = item.artworkUrl100 || item.artworkUrl60 || item.artworkUrl || 'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=♪';
        console.log('Music imageUri:', imageUri, 'for track:', title);
        break;
      case 'podcast':
        title = item.title || 'Unknown Podcast';
        subtitle = item.description ? item.description.substring(0, 80) + '...' : `by ${item.publisher || 'Unknown Publisher'}`;
        status = item.explicit ? 'Explicit' : item.total_episodes > 50 ? 'Active' : 'New';
        statusColor = item.explicit ? '#F44336' : item.total_episodes > 50 ? '#4CAF50' : '#FF9800';
        // Use direct URL for podcast images with fallbacks
        imageUri = item.image || item.thumbnail || item.artworkUrl100 || 'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=🎧';
        console.log('Podcast imageUri:', imageUri, 'for podcast:', title);
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

    const isFavorited = favorites.some(fav => (fav.id || fav.trackId) === (item.id || item.trackId));

    return (
      <TouchableOpacity 
        key={item.id || item.trackId || Math.random()} 
        style={[styles.enhancedMediaCard, { backgroundColor: themeColors.surface }]}
        onPress={handleItemPress}
        activeOpacity={0.8}
      >
        <View style={styles.cardImageContainer}>
          <Image
            source={imageUri}
            style={styles.cardImage}
            placeholder="https://via.placeholder.com/300x300/2a2a2a/ffffff?text=Loading"
            contentFit="cover"
            transition={300}
            onError={(error) => {
              console.log('Image load error for:', title, 'URI:', imageUri, 'Error:', error);
            }}
            onLoad={() => {
              console.log('Image loaded successfully for:', title);
            }}
          />
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.favoriteButton, { 
              backgroundColor: isFavorited ? themeColors.primary : 'rgba(0,0,0,0.6)' 
            }]} 
            onPress={handleFavoritePress}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isFavorited ? "heart" : "heart-outline"} 
              size={20} 
              color={isFavorited ? "#fff" : themeColors.textPrimary} 
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.cardContent, { backgroundColor: themeColors.surface }]}>
          <Text style={[styles.cardTitle, { color: themeColors.textPrimary }]} numberOfLines={2}>
            {title}
          </Text>
          <Text style={[styles.cardSubtitle, { color: themeColors.textSecondary }]} numberOfLines={2}>
            {subtitle}
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.ratingContainer}>
              {type === 'movie' && (
                <>
                  <Feather name="star" size={14} color={themeColors.accent || '#FFD700'} />
                  <Text style={[styles.ratingText, { color: themeColors.textSecondary }]}>{item.vote_average?.toFixed(1) || 'N/A'}</Text>
                </>
              )}
              {type === 'music' && (
                <>
                  <Feather name="music" size={14} color={themeColors.primary} />
                  <Text style={[styles.ratingText, { color: themeColors.textSecondary }]}>{Math.floor((item.trackTimeMillis || 0) / 60000)}m</Text>
                </>
              )}
              {type === 'podcast' && (
                <>
                  <Feather name="headphones" size={14} color={themeColors.accent || '#FF6B6B'} />
                  <Text style={[styles.ratingText, { color: themeColors.textSecondary }]}>{item.total_episodes || 0} eps</Text>
                </>
              )}
            </View>
            <TouchableOpacity style={[styles.playButton, { backgroundColor: themeColors.primary }]}>
              <Feather name="play" size={16} color="#fff" />
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
                    <Feather name="play" size={20} color={themeColors.background} />
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
          <Ionicons name="folder-open-outline" size={48} color={themeColors.textSecondary} />
          <Text style={[styles.emptySectionText, { color: themeColors.textSecondary }]}>No {title.toLowerCase()} available</Text>
          <TouchableOpacity 
            style={[styles.refreshButton, { backgroundColor: themeColors.primary }]}
            onPress={() => {
              loadTrendingContent();
            }}
            activeOpacity={0.8}
          >
            <Feather name="refresh-cw" size={16} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.refreshButtonText}>Retry</Text>
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
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={themeColors.primary}
            colors={[themeColors.primary]}
          />
        }
      >
        {/* Centered Greeting at Top */}
        <View style={styles.greetingTopContainer}>
          <Text style={[styles.greetingTop, { color: themeColors.textSecondary }]}>{getTimeBasedGreeting()}</Text>
        </View>

        {/* Header with User Info */}
        <View style={[styles.header, { backgroundColor: themeColors.background }]}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.openDrawer()}
          >
            <Ionicons name="menu" size={24} color={themeColors.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
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
          </View>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeText, { color: themeColors.textPrimary }]}>What do you want to watch today?</Text>
        </View>

        {/* Featured Content */}
        {renderFeaturedCard()}

        {/* Trending Sections */}
        {renderSection('Trending Movies', trendingMovies, 'movie', 'film')}
        {renderSection('Popular Music', trendingMusic, 'music', 'music')}
        {renderSection('Top Podcasts', trendingPodcasts, 'podcast', 'headphones')}

        <View style={styles.bottomPadding} />
      </ScrollView>
      

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
  headerLeft: {
    flex: 1,
  },
  greeting: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  greetingTopContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 30,
  },
  greetingTop: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
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
    width: 170,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardImageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#333',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
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
    top: 10,
    right: 10,
    borderRadius: 18,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 20,
  },
  cardSubtitle: {
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 18,
    opacity: 0.8,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
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