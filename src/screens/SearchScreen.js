import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [recentSearches, setRecentSearches] = useState([
    'Avengers',
    'Taylor Swift',
    'Joe Rogan',
    'Breaking Bad',
    'The Weeknd',
  ]);

  const searchTabs = [
    { id: 'all', title: 'All', icon: 'grid-outline' },
    { id: 'movies', title: 'Movies', icon: 'film-outline' },
    { id: 'music', title: 'Music', icon: 'musical-notes-outline' },
    { id: 'podcasts', title: 'Podcasts', icon: 'radio-outline' },
  ];

  const mockSearchResults = [
    {
      id: '1',
      type: 'movie',
      title: 'The Dark Knight',
      subtitle: 'Action, Crime, Drama • 2008',
      image: 'https://via.placeholder.com/60x90/333/fff?text=Movie',
    },
    {
      id: '2',
      type: 'music',
      title: 'Blinding Lights',
      subtitle: 'The Weeknd • After Hours',
      image: 'https://via.placeholder.com/60x60/333/fff?text=Music',
    },
    {
      id: '3',
      type: 'podcast',
      title: 'The Joe Rogan Experience',
      subtitle: 'Comedy, Society & Culture',
      image: 'https://via.placeholder.com/60x60/333/fff?text=Pod',
    },
  ];

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockSearchResults);
      setIsLoading(false);
    }, 800);
  };

  const handleRecentSearch = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const renderSearchResult = ({ item }) => {
    const getTypeIcon = (type) => {
      switch (type) {
        case 'movie':
          return 'film';
        case 'music':
          return 'musical-notes';
        case 'podcast':
          return 'radio';
        default:
          return 'search';
      }
    };

    return (
      <TouchableOpacity style={styles.searchResultItem}>
        <View style={styles.resultImageContainer}>
          <View style={styles.resultImagePlaceholder}>
            <Ionicons name={getTypeIcon(item.type)} size={24} color={COLORS.textMuted} />
          </View>
        </View>
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle}>{item.title}</Text>
          <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
        </View>
        <View style={styles.resultTypeIcon}>
          <Ionicons name={getTypeIcon(item.type)} size={16} color={COLORS.primary} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies, music, podcasts..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              handleSearch(text);
            }}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {searchTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={18}
              color={activeTab === tab.id ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id}
            style={styles.resultsList}
          />
        ) : searchQuery.length > 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Results Found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching for something else
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.recentSearches}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentSearchItem}
                onPress={() => handleRecentSearch(search)}
              >
                <Ionicons name="time-outline" size={20} color={COLORS.textMuted} />
                <Text style={styles.recentSearchText}>{search}</Text>
                <TouchableOpacity style={styles.recentSearchAction}>
                  <Ionicons name="arrow-up-outline" size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            
            <Text style={[styles.sectionTitle, styles.suggestedTitle]}>Trending</Text>
            {['Marvel Movies', 'Pop Music 2024', 'Tech Podcasts'].map((trend, index) => (
              <TouchableOpacity
                key={index}
                style={styles.trendingItem}
                onPress={() => handleRecentSearch(trend)}
              >
                <Ionicons name="trending-up" size={20} color={COLORS.primary} />
                <Text style={styles.trendingText}>{trend}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backButton: {
    marginRight: SPACING.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.base,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
  },
  tabsContainer: {
    maxHeight: 50,
  },
  tabsContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  activeTab: {
    backgroundColor: COLORS.primary + '20',
  },
  tabText: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.textMuted,
  },
  resultsList: {
    flex: 1,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultImageContainer: {
    marginRight: SPACING.md,
  },
  resultImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: SPACING.base,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  resultSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  resultTypeIcon: {
    padding: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  recentSearches: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginVertical: SPACING.md,
  },
  suggestedTitle: {
    marginTop: SPACING.xl,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  recentSearchText: {
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
  },
  recentSearchAction: {
    padding: SPACING.sm,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  trendingText: {
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
    fontWeight: '500',
  },
});

export default SearchScreen;