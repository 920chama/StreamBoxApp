import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { FlatGrid } from 'react-native-super-grid';
import { useSelector, useDispatch } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../store/slices/mediaSlice';

import { moviesApi } from '../services/moviesApi';
import { API_CONFIG } from '../constants/api';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors, getCardDimensions, getResponsivePadding, SCREEN_SIZES } from '../styles/globalStyles';

const MoviesScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.media.favorites);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('trending');

  const categories = [
    { id: 'trending', name: 'Trending', icon: 'trending-up' },
    { id: 'popular', name: 'Popular', icon: 'flame' },
    { id: 'top_rated', name: 'Top Rated', icon: 'star' },
  ];

  useEffect(() => {
    loadMovies();
  }, [selectedCategory]);

  const isMovieFavorite = (movie) => {
    return favorites.some(fav => fav.type === 'movie' && fav.id === movie.id);
  };

  const toggleFavorite = (movie) => {
    const favoriteData = {
      ...movie,
      type: 'movie',
      title: movie.title,
      artist: new Date(movie.release_date).getFullYear().toString(),
      image: `${API_CONFIG.TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    };

    if (isMovieFavorite(movie)) {
      dispatch(removeFromFavorites({ type: 'movie', id: movie.id }));
    } else {
      dispatch(addToFavorites(favoriteData));
    }
  };

  const loadMovies = async () => {
    try {
      setLoading(true);
      let response;
      
      switch (selectedCategory) {
        case 'popular':
          response = await moviesApi.getPopularMovies();
          break;
        case 'top_rated':
          response = await moviesApi.getTopRatedMovies();
          break;
        default:
          response = await moviesApi.getTrendingMovies();
      }
      
      setMovies(response.data.results);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMovies();
  };

  const renderMovieCard = ({ item }) => (
    <TouchableOpacity style={[styles.movieCard, { backgroundColor: themeColors.surface }]}>
      <Image
        source={{ uri: `${API_CONFIG.TMDB_IMAGE_BASE_URL}${item.poster_path}` }}
        style={styles.moviePoster}
        placeholder="Loading..."
        transition={200}
        contentFit="cover"
      />
      <View style={styles.movieInfo}>
        <Text style={[styles.movieTitle, { color: themeColors.textPrimary }]} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.movieMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{item.vote_average.toFixed(1)}</Text>
          </View>
          <Text style={[styles.releaseDate, { color: themeColors.textSecondary }]}>
            {new Date(item.release_date).getFullYear()}
          </Text>
        </View>
        <Text style={[styles.movieOverview, { color: themeColors.textSecondary }]} numberOfLines={2}>
          {item.overview}
        </Text>
      </View>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item)}
        >
          <Ionicons 
            name={isMovieFavorite(item) ? "heart" : "heart-outline"} 
            size={20} 
            color={isMovieFavorite(item) ? "#FF6B6B" : "#fff"} 
          />
        </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        { backgroundColor: selectedCategory === category.id ? themeColors.primary : themeColors.surface },
        selectedCategory === category.id && styles.selectedCategoryButton,
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons
        name={category.icon}
        size={20}
        color={selectedCategory === category.id ? (isDarkMode ? '#000' : '#fff') : themeColors.textPrimary}
      />
      <Text
        style={[
          styles.categoryButtonText,
          { color: selectedCategory === category.id ? (isDarkMode ? '#000' : '#fff') : themeColors.textPrimary },
          selectedCategory === category.id && styles.selectedCategoryButtonText,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Movies</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        <View style={styles.categories}>
          {categories.map(renderCategoryButton)}
        </View>
      </ScrollView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.primary} />
          <Text style={[styles.loadingText, { color: themeColors.textPrimary }]}>Loading movies...</Text>
        </View>
      ) : (
        <FlatGrid
          itemDimension={getCardDimensions('movie').width}
          data={movies}
          style={[styles.moviesList, { paddingHorizontal: getResponsivePadding() }]}
          spacing={SCREEN_SIZES.isSmallDevice ? 12 : 15}
          staticDimension={undefined}
          fixed={false}
          maxItemsPerRow={getCardDimensions('movie').columns}
          additionalRowStyle={styles.gridRow}
          renderItem={renderMovieCard}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={themeColors.primary}
            />
          }
        />
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
  categoriesContainer: {
    maxHeight: 60,
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 15,
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    gap: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#FF6B6B',
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedCategoryButtonText: {
    color: '#000',
  },
  moviesList: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  gridRow: {
    justifyContent: 'center',
  },
  movieCard: {
    flex: 1,
    minHeight: 340,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 15,
  },
  moviePoster: {
    width: '100%',
    flex: 1,
    backgroundColor: '#333',
  },
  movieInfo: {
    padding: 12,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    lineHeight: 18,
    height: 36,
  },
  movieMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    height: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  releaseDate: {
    fontSize: 13,
  },
  movieOverview: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 18,
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default MoviesScreen;