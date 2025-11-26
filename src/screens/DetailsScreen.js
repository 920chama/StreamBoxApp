import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Alert,
  Share,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector, useFavorites, useWatchlist } from '../store/hooks';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT, COMMON_STYLES, getResponsiveFontSize, getThemeColors } from '../styles/globalStyles';
import { 
  addToFavorites, 
  removeFromFavorites, 
  addToWatchlist, 
  removeFromWatchlist,
  persistFavoriteItem,
  removePersistentFavorite,
  persistWatchlistItem,
  removePersistentWatchlistItem,
} from '../store/slices/mediaSlice';
import { addToWatchHistory } from '../store/slices/userSlice';

const { width, height } = Dimensions.get('window');

const DetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const favorites = useFavorites();
  const watchlist = useWatchlist();
  
  const { item, type } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    if (item) {
      setIsFavorite(favorites.some(fav => fav.id === item.id));
      setIsInWatchlist(watchlist.some(watch => watch.id === item.id));
    }
  }, [item, favorites, watchlist]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePlay = () => {
    if (item) {
      // Add to watch history
      dispatch(addToWatchHistory(item));
      
      // Show play functionality (placeholder)
      Alert.alert(
        'Play Content',
        `Playing ${item.title || item.trackName || 'content'}...`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleToggleFavorite = async () => {
    if (item) {
      try {
        const itemId = item.id || item.trackId;
        if (isFavorite) {
          // Update local state immediately for responsive UI
          dispatch(removeFromFavorites(itemId));
          setIsFavorite(false);
          // Persist to storage
          await dispatch(removePersistentFavorite(itemId));
        } else {
          const favoriteItem = { ...item, type, favoritedAt: new Date().toISOString() };
          // Update local state immediately for responsive UI
          dispatch(addToFavorites(favoriteItem));
          setIsFavorite(true);
          // Persist to storage
          await dispatch(persistFavoriteItem(favoriteItem));
        }
      } catch (error) {
        console.error('Error updating favorites:', error);
        // Revert local state on error
        setIsFavorite(!isFavorite);
        Alert.alert('Error', 'Failed to update favorites. Please try again.');
      }
    }
  };

  const handleToggleWatchlist = async () => {
    if (item) {
      try {
        const itemId = item.id || item.trackId;
        if (isInWatchlist) {
          // Update local state immediately for responsive UI
          dispatch(removeFromWatchlist(itemId));
          setIsInWatchlist(false);
          // Persist to storage
          await dispatch(removePersistentWatchlistItem(itemId));
        } else {
          const watchlistItem = { ...item, type, addedAt: new Date().toISOString() };
          // Update local state immediately for responsive UI
          dispatch(addToWatchlist(watchlistItem));
          setIsInWatchlist(true);
          // Persist to storage
          await dispatch(persistWatchlistItem(watchlistItem));
        }
      } catch (error) {
        console.error('Error updating watchlist:', error);
        // Revert local state on error
        setIsInWatchlist(!isInWatchlist);
        Alert.alert('Error', 'Failed to update watchlist. Please try again.');
      }
    }
  };

  const handleShare = async () => {
    if (item) {
      try {
        await Share.share({
          message: `Check out "${item.title || item.trackName}" on StreamBox!`,
          title: 'Share from StreamBox',
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const getItemDetails = () => {
    if (!item || !type) {
      return {
        title: 'Unknown',
        subtitle: 'No information available',
        description: 'No description available',
        image: 'https://via.placeholder.com/300x450/333/fff?text=No+Image',
        backdrop: 'https://via.placeholder.com/800x400/333/fff?text=No+Backdrop',
        rating: 'N/A',
        year: 'N/A',
        duration: 'N/A',
        genre: 'Unknown',
      };
    }

    switch (type) {
      case 'movie':
        return {
          title: item.title || 'Unknown Movie',
          subtitle: `Movie • ${item.release_date ? new Date(item.release_date).getFullYear() : 'Unknown Year'}`,
          description: item.overview || 'No description available',
          image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/300x450/333/fff?text=Movie',
          backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : null,
          rating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
          year: item.release_date ? new Date(item.release_date).getFullYear() : 'N/A',
          duration: item.runtime ? `${item.runtime} min` : 'N/A',
          genre: item.genre_ids ? 'Drama' : 'Unknown', // Simplified
        };
      
      case 'music':
        return {
          title: item.trackName || 'Unknown Track',
          subtitle: `Music • ${item.artistName || 'Unknown Artist'}`,
          description: `Album: ${item.collectionName || 'Unknown Album'}`,
          image: item.artworkUrl100 ? item.artworkUrl100.replace('100x100', '600x600') : 'https://via.placeholder.com/300x300/333/fff?text=Music',
          backdrop: null,
          rating: 'N/A',
          year: item.releaseDate ? new Date(item.releaseDate).getFullYear() : 'N/A',
          duration: item.trackTimeMillis ? `${Math.floor(item.trackTimeMillis / 60000)}:${String(Math.floor((item.trackTimeMillis % 60000) / 1000)).padStart(2, '0')}` : 'N/A',
          genre: item.primaryGenreName || 'Unknown',
        };
      
      case 'podcast':
        return {
          title: item.title || 'Unknown Podcast',
          subtitle: `Podcast • ${item.publisher || 'Unknown Publisher'}`,
          description: item.description || 'No description available',
          image: item.image || 'https://via.placeholder.com/300x300/333/fff?text=Podcast',
          backdrop: null,
          rating: 'N/A',
          year: 'N/A',
          duration: `${item.total_episodes || 0} episodes`,
          genre: item.genre || 'Podcast',
        };
      
      default:
        return {
          title: 'Unknown',
          subtitle: 'Unknown Type',
          description: 'No description available',
          image: 'https://via.placeholder.com/300x450/333/fff?text=Unknown',
          backdrop: null,
          rating: 'N/A',
          year: 'N/A',
          duration: 'N/A',
          genre: 'Unknown',
        };
    }
  };

  const details = getItemDetails();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={{ uri: details.backdrop || details.image }}
            style={styles.heroBackground}
            imageStyle={styles.heroBackgroundImage}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
              style={styles.heroGradient}
            >
              {/* Header Controls */}
              <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <BlurView intensity={20} style={styles.blurButton}>
                    <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
                  </BlurView>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                  <BlurView intensity={20} style={styles.blurButton}>
                    <Feather name="share" size={22} color={COLORS.textPrimary} />
                  </BlurView>
                </TouchableOpacity>
              </View>

              {/* Content Info */}
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle} numberOfLines={2}>
                  {details.title}
                </Text>
                <Text style={styles.heroSubtitle}>
                  {details.subtitle}
                </Text>
                
                {/* Rating and Info */}
                <View style={styles.infoRow}>
                  {details.rating !== 'N/A' && (
                    <View style={styles.ratingBadge}>
                      <Feather name="star" size={14} color={COLORS.gold} />
                      <Text style={styles.ratingText}>{details.rating}</Text>
                    </View>
                  )}
                  <Text style={styles.infoText}>{details.year}</Text>
                  <Text style={styles.infoText}>{details.duration}</Text>
                  <Text style={styles.infoText}>{details.genre}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
                    <Feather name="play" size={20} color={COLORS.background} />
                    <Text style={styles.playButtonText}>Play</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.secondaryButton, isFavorite && styles.activeButton]} 
                    onPress={handleToggleFavorite}
                  >
                    <Ionicons 
                      name={isFavorite ? "heart" : "heart-outline"} 
                      size={18} 
                      color={isFavorite ? "#FF6B6B" : "#fff"} 
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.secondaryButton, isInWatchlist && styles.activeButton]} 
                    onPress={handleToggleWatchlist}
                  >
                    <Ionicons 
                      name={isInWatchlist ? "bookmark" : "bookmark-outline"} 
                      size={18} 
                      color={isInWatchlist ? "#FF6B6B" : "#fff"} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          {/* Poster and Info */}
          <View style={styles.posterSection}>
            <Image
              source={{ uri: details.image }}
              style={styles.posterImage}
              placeholder="Loading..."
              transition={200}
              contentFit="cover"
            />
            
            <View style={styles.posterInfo}>
              <Text style={styles.detailTitle}>{details.title}</Text>
              <Text style={styles.detailSubtitle}>{details.subtitle}</Text>
              
              {/* Quick Stats */}
              <View style={styles.quickStats}>
                <View style={styles.statItem}>
                  <Feather name="clock" size={16} color={COLORS.textTertiary} />
                  <Text style={styles.statText}>{details.duration}</Text>
                </View>
                <View style={styles.statItem}>
                  <Feather name="calendar" size={16} color={COLORS.textTertiary} />
                  <Text style={styles.statText}>{details.year}</Text>
                </View>
                {details.rating !== 'N/A' && (
                  <View style={styles.statItem}>
                    <Feather name="star" size={16} color={COLORS.gold} />
                    <Text style={styles.statText}>{details.rating}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{details.description}</Text>
          </View>

          {/* Additional Info */}
          <View style={styles.additionalInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Genre</Text>
              <Text style={styles.infoValue}>{details.genre}</Text>
            </View>
            {type === 'movie' && details.year !== 'N/A' && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Release Year</Text>
                <Text style={styles.infoValue}>{details.year}</Text>
              </View>
            )}
            {type === 'music' && item?.artistName && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Artist</Text>
                <Text style={styles.infoValue}>{item.artistName}</Text>
              </View>
            )}
            {type === 'podcast' && item?.publisher && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Publisher</Text>
                <Text style={styles.infoValue}>{item.publisher}</Text>
              </View>
            )}
          </View>
        </View>
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
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  heroSection: {
    height: height * 0.6,
  },
  heroBackground: {
    width: '100%',
    height: '100%',
  },
  heroBackgroundImage: {
    resizeMode: 'cover',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  shareButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurButton: {
    padding: 10,
  },
  heroContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 34,
  },
  heroSubtitle: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  infoText: {
    color: '#aaa',
    fontSize: 14,
    marginRight: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  playButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 25,
  },
  activeButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.3)',
  },
  detailsSection: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  posterSection: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: 12,
    backgroundColor: '#333',
  },
  posterInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  detailTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailSubtitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 15,
  },
  quickStats: {
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#aaa',
    fontSize: 13,
  },
  descriptionSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  additionalInfo: {
    paddingBottom: 30,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  infoLabel: {
    color: '#888',
    fontSize: 14,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default DetailsScreen;