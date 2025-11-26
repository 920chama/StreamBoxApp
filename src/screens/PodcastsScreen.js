import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../store/slices/mediaSlice';

import { podcastsApi } from '../services/podcastsApi';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors, getResponsivePadding, SCREEN_SIZES } from '../styles/globalStyles';

const PodcastsScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.media.favorites);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadTrendingPodcasts();
  }, []);

  const isPodcastFavorite = (podcast) => {
    return favorites.some(fav => fav.type === 'podcast' && fav.id === podcast.id);
  };

  const toggleFavorite = (podcast) => {
    const favoriteData = {
      ...podcast,
      type: 'podcast',
      title: podcast.title,
      artist: podcast.publisher,
      image: podcast.image
    };

    if (isPodcastFavorite(podcast)) {
      dispatch(removeFromFavorites({ type: 'podcast', id: podcast.id }));
    } else {
      dispatch(addToFavorites(favoriteData));
    }
  };

  const loadTrendingPodcasts = async () => {
    try {
      setLoading(true);
      const response = await podcastsApi.getTrendingPodcasts();
      setPodcasts(response.data.podcasts);
    } catch (error) {
      console.error('Error loading podcasts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const searchPodcasts = async (query) => {
    if (!query.trim()) {
      loadTrendingPodcasts();
      return;
    }

    try {
      setIsSearching(true);
      const response = await podcastsApi.searchPodcasts(query);
      setPodcasts(response.data.podcasts);
    } catch (error) {
      console.error('Error searching podcasts:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setSearchQuery('');
    loadTrendingPodcasts();
  };

  const formatEpisodeCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const getGenreColor = (genreIds) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    return colors[genreIds?.[0] % colors.length] || '#FF6B6B';
  };

  const renderPodcastCard = (item) => (
    <TouchableOpacity key={item.id} style={[styles.podcastCard, { backgroundColor: themeColors.surface }]}>
      <Image
        source={{ uri: item.image }}
        style={styles.podcastImage}
        placeholder="Loading..."
        transition={200}
      />
      
      <View style={styles.podcastInfo}>
        <Text style={[styles.podcastTitle, { color: themeColors.textPrimary }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.publisher, { color: themeColors.textSecondary }]} numberOfLines={1}>
          {item.publisher}
        </Text>
        <Text style={[styles.description, { color: themeColors.textTertiary }]} numberOfLines={3}>
          {item.description}
        </Text>
        
        <View style={styles.podcastMeta}>
          <View style={styles.episodeInfo}>
            <Ionicons name="play-circle" size={16} color={themeColors.textSecondary} />
            <Text style={[styles.episodeCount, { color: themeColors.textSecondary }]}>
              {formatEpisodeCount(item.total_episodes)} episodes
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.podcastFavoriteButton}
            onPress={() => toggleFavorite(item)}
          >
            <Ionicons 
              name={isPodcastFavorite(item) ? "heart" : "heart-outline"} 
              size={20} 
              color={isPodcastFavorite(item) ? "#FF6B6B" : themeColors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
        
        <View 
          style={[
            styles.genreBadge, 
            { backgroundColor: getGenreColor(item.genre_ids) }
          ]}
        >
          <Text style={styles.genreText}>{item.language}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.subscribeButton}>
        <Ionicons name="add-circle-outline" size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderFeaturedPodcast = () => {
    if (podcasts.length === 0) return null;
    
    const featured = podcasts[0];
    return (
      <View style={styles.featuredContainer}>
        <View style={styles.featuredHeader}>
          <Text style={styles.featuredLabel}>Featured Podcast</Text>
        </View>
        
        <View style={styles.featuredContent}>
          <Image
            source={{ uri: featured.image }}
            style={styles.featuredImage}
            placeholder="Loading..."
            transition={200}
          />
          
          <View style={styles.featuredInfo}>
            <Text style={styles.featuredTitle} numberOfLines={2}>
              {featured.title}
            </Text>
            <Text style={styles.featuredPublisher}>
              by {featured.publisher}
            </Text>
            <Text style={styles.featuredDescription} numberOfLines={4}>
              {featured.description}
            </Text>
            
            <View style={styles.featuredActions}>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={16} color="#000" />
                <Text style={styles.playButtonText}>Play Latest</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.followButton}>
                <Ionicons name="add" size={16} color="#FF6B6B" />
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Podcasts</Text>
        <TouchableOpacity>
          <Ionicons name="library" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: themeColors.background }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
          <Ionicons name="search" size={20} color={themeColors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.textPrimary }]}
            placeholder="Search podcasts..."
            placeholderTextColor={themeColors.textTertiary}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              searchPodcasts(text);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                loadTrendingPodcasts();
              }}
            >
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading || isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>
            {isSearching ? 'Searching...' : 'Loading podcasts...'}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FF6B6B"
            />
          }
        >
          {!searchQuery && renderFeaturedPodcast()}
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? 'Search Results' : 'Trending Podcasts'}
            </Text>
          </View>

          {podcasts.map(renderPodcastCard)}
          
          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  featuredContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  featuredHeader: {
    marginBottom: 15,
  },
  featuredLabel: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  featuredContent: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    gap: 15,
  },
  featuredImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#333',
  },
  featuredInfo: {
    flex: 1,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featuredPublisher: {
    color: '#FF6B6B',
    fontSize: 14,
    marginBottom: 10,
  },
  featuredDescription: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 15,
  },
  featuredActions: {
    flexDirection: 'row',
    gap: 10,
  },
  playButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  playButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 12,
  },
  followButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  followButtonText: {
    color: '#FF6B6B',
    fontWeight: '600',
    fontSize: 12,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  podcastCard: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  podcastImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#333',
  },
  podcastInfo: {
    flex: 1,
    gap: 5,
  },
  podcastTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  publisher: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  description: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 17,
  },
  podcastMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  episodeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  podcastFavoriteButton: {
    padding: 5,
    marginLeft: 10,
  },
  episodeCount: {
    color: '#888',
    fontSize: 12,
  },
  genreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  genreText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
  },
  subscribeButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  bottomPadding: {
    height: 20,
  },
});

export default PodcastsScreen;