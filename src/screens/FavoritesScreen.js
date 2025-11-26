import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromFavorites, clearSearchResults } from '../store/slices/mediaSlice';
import { getImageUri, getThumbnailUri } from '../utils/imageUtils';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT, COMMON_STYLES, getResponsiveFontSize, getThemeColors } from '../styles/globalStyles';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 2; // 2 columns with margins

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.media.favorites);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    // Clear any existing search results when entering favorites
    dispatch(clearSearchResults());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh - in real app, you might re-sync favorites from server
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleRemoveFavorite = (item) => {
    Alert.alert(
      'Remove Favorite',
      `Remove "${item.title || item.trackName}" from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const itemId = item.id || item.trackId;
            dispatch(removeFromFavorites(itemId));
          },
        },
      ]
    );
  };

  const handleItemPress = (item) => {
    navigation.navigate('Details', {
      item,
      type: item.type,
      id: item.id || item.trackId,
      fromFavorites: true,
    });
  };

  const getFilteredFavorites = () => {
    if (selectedType === 'all') return favorites;
    return favorites.filter(item => item.type === selectedType);
  };

  const getTypeCount = (type) => {
    return favorites.filter(item => item.type === type).length;
  };

  const renderFilterTabs = () => {
    const tabs = [
      { key: 'all', label: 'All', icon: 'apps', count: favorites.length },
      { key: 'movie', label: 'Movies', icon: 'film', count: getTypeCount('movie') },
      { key: 'music', label: 'Music', icon: 'musical-notes', count: getTypeCount('music') },
      { key: 'podcast', label: 'Podcasts', icon: 'radio', count: getTypeCount('podcast') },
    ];

    return (
      <View style={styles.filterTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.filterTab,
                { backgroundColor: selectedType === tab.key ? themeColors.primary : themeColors.surface },
                selectedType === tab.key && styles.filterTabActive,
              ]}
              onPress={() => setSelectedType(tab.key)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={tab.icon} 
                size={20} 
                color={selectedType === tab.key ? '#fff' : themeColors.textSecondary} 
              />
              <Text style={[
                styles.filterTabText,
                { color: selectedType === tab.key ? '#fff' : themeColors.textPrimary },
                selectedType === tab.key && styles.filterTabTextActive,
              ]}>
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{tab.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="heart" size={80} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        {selectedType === 'all' 
          ? 'Start exploring and tap the heart icon to save your favorite content'
          : `No ${selectedType === 'movie' ? 'movies' : selectedType === 'music' ? 'songs' : 'podcasts'} in your favorites`
        }
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Feather name="compass" size={20} color={COLORS.textPrimary} />
        <Text style={styles.exploreButtonText}>Start Exploring</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFavoriteItem = (item, index) => {
    const title = item.title || item.trackName || 'Unknown';
    const subtitle = item.type === 'movie' 
      ? `Movie • ${item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}`
      : item.type === 'music'
      ? `Music • ${item.artistName || 'Unknown Artist'}`
      : `Podcast • ${item.publisher || 'Unknown Publisher'}`;
    
    const imageUri = getThumbnailUri(item, item.type, title);
    const addedDate = item.favoritedAt ? new Date(item.favoritedAt) : new Date();

    return (
      <TouchableOpacity
        key={`${item.id || item.trackId}-${index}`}
        style={styles.favoriteItem}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.itemImageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.itemImage}
            placeholder="Loading..."
            transition={200}
            contentFit="cover"
          />
          <TouchableOpacity
            style={styles.removeFavoriteButton}
            onPress={() => handleRemoveFavorite(item)}
            activeOpacity={0.7}
          >
            <Feather name="heart" size={18} color={COLORS.primary} />
          </TouchableOpacity>
          
          {/* Type Badge */}
          <View style={[styles.typeBadge, { backgroundColor: getTypeBadgeColor(item.type) }]}>
            <Ionicons 
              name={getTypeIcon(item.type)} 
              size={12} 
              color="#fff" 
            />
          </View>
        </View>

        <View style={styles.itemContent}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
          <Text style={styles.itemDate}>
            Added {formatDate(addedDate)}
          </Text>
          
          {/* Rating/Duration Info */}
          <View style={styles.itemInfo}>
            {item.type === 'movie' && item.vote_average && (
              <View style={styles.infoItem}>
                <Feather name="star" size={12} color={COLORS.gold} />
                <Text style={styles.infoText}>{item.vote_average.toFixed(1)}</Text>
              </View>
            )}
            {item.type === 'music' && item.trackTimeMillis && (
              <View style={styles.infoItem}>
                <Feather name="clock" size={12} color={COLORS.textTertiary} />
                <Text style={styles.infoText}>
                  {Math.floor(item.trackTimeMillis / 60000)}:{String(Math.floor((item.trackTimeMillis % 60000) / 1000)).padStart(2, '0')}
                </Text>
              </View>
            )}
            {item.type === 'podcast' && item.total_episodes && (
              <View style={styles.infoItem}>
                <Feather name="headphones" size={12} color={COLORS.textTertiary} />
                <Text style={styles.infoText}>{item.total_episodes} eps</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'movie': return 'film';
      case 'music': return 'musical-note';
      case 'podcast': return 'radio';
      default: return 'help';
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'movie': return '#2196F3';
      case 'music': return '#FF6B6B';
      case 'podcast': return '#9C27B0';
      default: return '#666';
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'today';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const filteredFavorites = getFilteredFavorites();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.background }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>My Favorites</Text>
          <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Feather name="search" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      {favorites.length > 0 && renderFilterTabs()}

      {/* Content */}
      <ScrollView
        style={[styles.content, { backgroundColor: themeColors.background }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={themeColors.primary}
            colors={[themeColors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredFavorites.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.favoritesGrid}>
            {filteredFavorites.map((item, index) => renderFavoriteItem(item, index))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    padding: 5,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  searchButton: {
    padding: 5,
  },
  filterTabs: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    gap: 8,
  },
  filterTabActive: {
    backgroundColor: '#FF6B6B',
  },
  filterTabText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  countText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  favoritesGrid: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  favoriteItem: {
    width: ITEM_WIDTH,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  itemImageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: ITEM_WIDTH * 1.2,
    backgroundColor: '#333',
  },
  removeFavoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    padding: 6,
  },
  typeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 10,
    padding: 4,
  },
  itemContent: {
    padding: 12,
  },
  itemTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitle: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  itemDate: {
    color: '#666',
    fontSize: 11,
    marginBottom: 8,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    color: '#aaa',
    fontSize: 11,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FavoritesScreen;