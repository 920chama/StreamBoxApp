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

import { moviesApi } from '../services/moviesApi';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../styles/globalStyles';

const MoviesScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);
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
    <TouchableOpacity style={styles.movieCard}>
      <Image
        source={{ uri: item.poster_path }}
        style={styles.moviePoster}
        placeholder="Loading..."
        transition={200}
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.movieMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.vote_average.toFixed(1)}</Text>
          </View>
          <Text style={styles.releaseDate}>
            {new Date(item.release_date).getFullYear()}
          </Text>
        </View>
        <Text style={styles.movieOverview} numberOfLines={3}>
          {item.overview}
        </Text>
      </View>
      <TouchableOpacity style={styles.favoriteButton}>
        <Ionicons name="heart-outline" size={24} color="#fff" />
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
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading movies...</Text>
        </View>
      ) : (
        <FlatGrid
          itemDimension={160}
          data={movies}
          style={styles.moviesList}
          spacing={15}
          renderItem={renderMovieCard}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FF6B6B"
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
    paddingHorizontal: 20,
  },
  movieCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  moviePoster: {
    width: '100%',
    height: 240,
    backgroundColor: '#333',
  },
  movieInfo: {
    padding: 15,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 22,
  },
  movieMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    color: '#888',
    fontSize: 14,
  },
  movieOverview: {
    color: '#ccc',
    fontSize: 12,
    lineHeight: 16,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 8,
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
});

export default MoviesScreen;