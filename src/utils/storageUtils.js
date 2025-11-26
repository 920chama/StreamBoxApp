import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  FAVORITES: '@streambox_favorites',
  WATCHLIST: '@streambox_watchlist',
  WATCH_HISTORY: '@streambox_watch_history',
  USER_PREFERENCES: '@streambox_user_preferences',
  LAST_SYNC: '@streambox_last_sync',
};

/**
 * Favorites Storage Functions
 */
export const favoritesStorage = {
  // Save favorites to storage
  save: async (favorites) => {
    try {
      const favoritesData = {
        items: favorites,
        lastUpdated: new Date().toISOString(),
        count: favorites.length,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoritesData));
      console.log(`Saved ${favorites.length} favorites to storage`);
      return true;
    } catch (error) {
      console.error('Error saving favorites:', error);
      return false;
    }
  },

  // Load favorites from storage
  load: async () => {
    try {
      const favoritesData = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (!favoritesData) return [];
      
      const parsed = JSON.parse(favoritesData);
      console.log(`Loaded ${parsed.count || 0} favorites from storage`);
      return parsed.items || [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  },

  // Add single item to favorites
  addItem: async (item) => {
    try {
      const currentFavorites = await favoritesStorage.load();
      const itemId = item.id || item.trackId;
      
      // Check if already exists
      const exists = currentFavorites.find(fav => (fav.id || fav.trackId) === itemId);
      if (exists) return currentFavorites;
      
      // Add with timestamp
      const newItem = {
        ...item,
        favoritedAt: new Date().toISOString(),
      };
      
      const updatedFavorites = [newItem, ...currentFavorites];
      await favoritesStorage.save(updatedFavorites);
      return updatedFavorites;
    } catch (error) {
      console.error('Error adding favorite item:', error);
      return [];
    }
  },

  // Remove single item from favorites
  removeItem: async (itemId) => {
    try {
      const currentFavorites = await favoritesStorage.load();
      const updatedFavorites = currentFavorites.filter(
        fav => (fav.id || fav.trackId) !== itemId
      );
      
      await favoritesStorage.save(updatedFavorites);
      console.log(`Removed item ${itemId} from favorites`);
      return updatedFavorites;
    } catch (error) {
      console.error('Error removing favorite item:', error);
      return [];
    }
  },

  // Clear all favorites
  clear: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.FAVORITES);
      console.log('Cleared all favorites');
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return false;
    }
  },

  // Get favorites count
  getCount: async () => {
    try {
      const favorites = await favoritesStorage.load();
      return favorites.length;
    } catch (error) {
      console.error('Error getting favorites count:', error);
      return 0;
    }
  },

  // Check if item is favorited
  isFavorited: async (itemId) => {
    try {
      const favorites = await favoritesStorage.load();
      return favorites.some(fav => (fav.id || fav.trackId) === itemId);
    } catch (error) {
      console.error('Error checking if item is favorited:', error);
      return false;
    }
  },
};

/**
 * Watchlist Storage Functions
 */
export const watchlistStorage = {
  save: async (watchlist) => {
    try {
      const watchlistData = {
        items: watchlist,
        lastUpdated: new Date().toISOString(),
        count: watchlist.length,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlistData));
      return true;
    } catch (error) {
      console.error('Error saving watchlist:', error);
      return false;
    }
  },

  load: async () => {
    try {
      const watchlistData = await AsyncStorage.getItem(STORAGE_KEYS.WATCHLIST);
      if (!watchlistData) return [];
      
      const parsed = JSON.parse(watchlistData);
      return parsed.items || [];
    } catch (error) {
      console.error('Error loading watchlist:', error);
      return [];
    }
  },

  addItem: async (item) => {
    try {
      const currentWatchlist = await watchlistStorage.load();
      const itemId = item.id || item.trackId;
      
      const exists = currentWatchlist.find(watch => (watch.id || watch.trackId) === itemId);
      if (exists) return currentWatchlist;
      
      const newItem = {
        ...item,
        addedAt: new Date().toISOString(),
      };
      
      const updatedWatchlist = [newItem, ...currentWatchlist];
      await watchlistStorage.save(updatedWatchlist);
      return updatedWatchlist;
    } catch (error) {
      console.error('Error adding watchlist item:', error);
      return [];
    }
  },

  removeItem: async (itemId) => {
    try {
      const currentWatchlist = await watchlistStorage.load();
      const updatedWatchlist = currentWatchlist.filter(
        watch => (watch.id || watch.trackId) !== itemId
      );
      
      await watchlistStorage.save(updatedWatchlist);
      return updatedWatchlist;
    } catch (error) {
      console.error('Error removing watchlist item:', error);
      return [];
    }
  },

  clear: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.WATCHLIST);
      return true;
    } catch (error) {
      console.error('Error clearing watchlist:', error);
      return false;
    }
  },
};

/**
 * Watch History Storage Functions
 */
export const watchHistoryStorage = {
  save: async (history) => {
    try {
      const historyData = {
        items: history.slice(0, 100), // Keep only last 100 items
        lastUpdated: new Date().toISOString(),
        count: history.length,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(historyData));
      return true;
    } catch (error) {
      console.error('Error saving watch history:', error);
      return false;
    }
  },

  load: async () => {
    try {
      const historyData = await AsyncStorage.getItem(STORAGE_KEYS.WATCH_HISTORY);
      if (!historyData) return [];
      
      const parsed = JSON.parse(historyData);
      return parsed.items || [];
    } catch (error) {
      console.error('Error loading watch history:', error);
      return [];
    }
  },

  addItem: async (item) => {
    try {
      const currentHistory = await watchHistoryStorage.load();
      const itemId = item.id || item.trackId;
      
      // Remove existing entry if it exists
      const filteredHistory = currentHistory.filter(
        hist => (hist.id || hist.trackId) !== itemId
      );
      
      const newItem = {
        ...item,
        accessedAt: new Date().toISOString(),
      };
      
      // Add to beginning and limit to 100 items
      const updatedHistory = [newItem, ...filteredHistory].slice(0, 100);
      await watchHistoryStorage.save(updatedHistory);
      return updatedHistory;
    } catch (error) {
      console.error('Error adding to watch history:', error);
      return [];
    }
  },

  clear: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.WATCH_HISTORY);
      return true;
    } catch (error) {
      console.error('Error clearing watch history:', error);
      return false;
    }
  },
};

/**
 * User Preferences Storage Functions
 */
export const userPreferencesStorage = {
  save: async (preferences) => {
    try {
      const preferencesData = {
        ...preferences,
        lastUpdated: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferencesData));
      return true;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      return false;
    }
  },

  load: async () => {
    try {
      const preferencesData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (!preferencesData) return null;
      
      return JSON.parse(preferencesData);
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return null;
    }
  },

  clear: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
      return true;
    } catch (error) {
      console.error('Error clearing user preferences:', error);
      return false;
    }
  },
};

/**
 * Sync Functions
 */
export const syncStorage = {
  // Load all data from storage
  loadAll: async () => {
    try {
      const [favorites, watchlist, history, preferences] = await Promise.all([
        favoritesStorage.load(),
        watchlistStorage.load(),
        watchHistoryStorage.load(),
        userPreferencesStorage.load(),
      ]);

      return {
        favorites,
        watchlist,
        history,
        preferences,
      };
    } catch (error) {
      console.error('Error loading all storage data:', error);
      return {
        favorites: [],
        watchlist: [],
        history: [],
        preferences: null,
      };
    }
  },

  // Clear all data
  clearAll: async () => {
    try {
      await Promise.all([
        favoritesStorage.clear(),
        watchlistStorage.clear(),
        watchHistoryStorage.clear(),
        userPreferencesStorage.clear(),
        AsyncStorage.removeItem(STORAGE_KEYS.LAST_SYNC),
      ]);
      console.log('Cleared all storage data');
      return true;
    } catch (error) {
      console.error('Error clearing all storage data:', error);
      return false;
    }
  },

  // Get storage info
  getStorageInfo: async () => {
    try {
      const [favoritesCount, watchlistCount, historyCount] = await Promise.all([
        favoritesStorage.getCount(),
        (await watchlistStorage.load()).length,
        (await watchHistoryStorage.load()).length,
      ]);

      return {
        favorites: favoritesCount,
        watchlist: watchlistCount,
        history: historyCount,
        lastSync: await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC),
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {
        favorites: 0,
        watchlist: 0,
        history: 0,
        lastSync: null,
      };
    }
  },

  // Update last sync timestamp
  updateLastSync: async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      return true;
    } catch (error) {
      console.error('Error updating last sync:', error);
      return false;
    }
  },
};

export default {
  favoritesStorage,
  watchlistStorage,
  watchHistoryStorage,
  userPreferencesStorage,
  syncStorage,
  STORAGE_KEYS,
};