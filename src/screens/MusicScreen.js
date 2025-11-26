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

import { musicApi } from '../services/musicApi';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../styles/globalStyles';

const MusicScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadTrendingTracks();
  }, []);

  const loadTrendingTracks = async () => {
    try {
      setLoading(true);
      const response = await musicApi.getTrendingTracks();
      setTracks(response.data.results);
    } catch (error) {
      console.error('Error loading tracks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const searchTracks = async (query) => {
    if (!query.trim()) {
      loadTrendingTracks();
      return;
    }

    try {
      setIsSearching(true);
      const response = await musicApi.searchMusic(query);
      setTracks(response.data.results);
    } catch (error) {
      console.error('Error searching tracks:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setSearchQuery('');
    loadTrendingTracks();
  };

  const formatDuration = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderTrackCard = (item, index) => (
    <TouchableOpacity key={item.trackId || index} style={styles.trackCard}>
      <View style={styles.trackNumber}>
        <Text style={styles.trackNumberText}>{index + 1}</Text>
      </View>
      
      <Image
        source={{ uri: item.artworkUrl100 }}
        style={styles.albumArt}
        placeholder="Loading..."
        transition={200}
      />
      
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.trackName}
        </Text>
        <Text style={styles.artistName} numberOfLines={1}>
          {item.artistName}
        </Text>
        <Text style={styles.albumName} numberOfLines={1}>
          {item.collectionName}
        </Text>
      </View>
      
      <View style={styles.trackMeta}>
        <Text style={styles.duration}>
          {formatDuration(item.trackTimeMillis)}
        </Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#888" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Music</Text>
        <TouchableOpacity>
          <Ionicons name="library" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: themeColors.background }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
          <Ionicons name="search" size={20} color={themeColors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.textPrimary }]}
            placeholder="Search songs, artists..."
            placeholderTextColor={themeColors.textTertiary}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              searchTracks(text);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                loadTrendingTracks();
              }}
            >
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? `Search Results` : 'Trending Now'}
        </Text>
        <Text style={styles.trackCount}>
          {tracks.length} track{tracks.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {loading || isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>
            {isSearching ? 'Searching...' : 'Loading music...'}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.tracksList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FF6B6B"
            />
          }
        >
          {tracks.map(renderTrackCard)}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  trackCount: {
    color: '#888',
    fontSize: 14,
  },
  tracksList: {
    flex: 1,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 15,
  },
  trackNumber: {
    width: 20,
    alignItems: 'center',
  },
  trackNumberText: {
    color: '#888',
    fontSize: 14,
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  trackInfo: {
    flex: 1,
    gap: 2,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  artistName: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  albumName: {
    color: '#888',
    fontSize: 12,
  },
  trackMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  duration: {
    color: '#888',
    fontSize: 12,
  },
  moreButton: {
    padding: 4,
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

export default MusicScreen;