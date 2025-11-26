import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favoritesStorage, watchlistStorage } from '../../utils/storageUtils';

// Async thunks for API calls
export const fetchTrendingMovies = createAsyncThunk(
  'media/fetchTrendingMovies',
  async () => {
    try {
      // For now, return mock data until API services are properly integrated
      return [
        {
          id: 1,
          title: 'Sample Movie 1',
          poster_path: '/sample1.jpg',
          backdrop_path: '/backdrop1.jpg',
          overview: 'A great action movie',
          vote_average: 8.5,
          release_date: '2023-01-01',
        },
        {
          id: 2,
          title: 'Sample Movie 2',
          poster_path: '/sample2.jpg',
          backdrop_path: '/backdrop2.jpg',
          overview: 'An amazing thriller',
          vote_average: 7.8,
          release_date: '2023-02-01',
        },
      ];
    } catch (error) {
      throw error;
    }
  }
);

export const fetchTrendingMusic = createAsyncThunk(
  'media/fetchTrendingMusic',
  async () => {
    try {
      // For now, return mock data until API services are properly integrated
      return [
        {
          trackId: 1,
          trackName: 'Sample Song 1',
          artistName: 'Sample Artist 1',
          artworkUrl100: 'https://via.placeholder.com/100x100',
          trackTimeMillis: 180000,
        },
        {
          trackId: 2,
          trackName: 'Sample Song 2',
          artistName: 'Sample Artist 2',
          artworkUrl100: 'https://via.placeholder.com/100x100',
          trackTimeMillis: 210000,
        },
      ];
    } catch (error) {
      throw error;
    }
  }
);

export const fetchTrendingPodcasts = createAsyncThunk(
  'media/fetchTrendingPodcasts',
  async () => {
    try {
      // For now, return mock data until API services are properly integrated
      return [
        {
          id: 1,
          title: 'Sample Podcast 1',
          image: 'https://via.placeholder.com/300x300',
          description: 'A fascinating tech podcast',
          publisher: 'Tech Publisher',
          total_episodes: 25,
        },
        {
          id: 2,
          title: 'Sample Podcast 2',
          image: 'https://via.placeholder.com/300x300',
          description: 'An interesting business podcast',
          publisher: 'Business Publisher',
          total_episodes: 40,
        },
      ];
    } catch (error) {
      throw error;
    }
  }
);

// Async thunks for persistence
export const loadPersistedFavorites = createAsyncThunk(
  'media/loadPersistedFavorites',
  async () => {
    return await favoritesStorage.load();
  }
);

export const loadPersistedWatchlist = createAsyncThunk(
  'media/loadPersistedWatchlist',
  async () => {
    return await watchlistStorage.load();
  }
);

export const persistFavoriteItem = createAsyncThunk(
  'media/persistFavoriteItem',
  async (item) => {
    const currentData = await favoritesStorage.load();
    const itemId = item.id || item.trackId;
    const exists = currentData.find(fav => (fav.id || fav.trackId) === itemId);
    
    if (!exists) {
      const newData = [{
        ...item,
        favoritedAt: new Date().toISOString(),
      }, ...currentData];
      await favoritesStorage.save(newData);
      return newData;
    }
    return currentData;
  }
);

export const removePersistentFavorite = createAsyncThunk(
  'media/removePersistentFavorite',
  async (itemId) => {
    const currentData = await favoritesStorage.load();
    const newData = currentData.filter(fav => (fav.id || fav.trackId) !== itemId);
    await favoritesStorage.save(newData);
    return newData;
  }
);

export const persistWatchlistItem = createAsyncThunk(
  'media/persistWatchlistItem',
  async (item) => {
    const currentData = await watchlistStorage.load();
    const itemId = item.id || item.trackId;
    const exists = currentData.find(w => (w.id || w.trackId) === itemId);
    
    if (!exists) {
      const newData = [{
        ...item,
        addedAt: new Date().toISOString(),
      }, ...currentData];
      await watchlistStorage.save(newData);
      return newData;
    }
    return currentData;
  }
);

export const removePersistentWatchlistItem = createAsyncThunk(
  'media/removePersistentWatchlistItem',
  async (itemId) => {
    const currentData = await watchlistStorage.load();
    const newData = currentData.filter(w => (w.id || w.trackId) !== itemId);
    await watchlistStorage.save(newData);
    return newData;
  }
);

const initialState = {
  trendingMovies: [],
  trendingMusic: [],
  trendingPodcasts: [],
  featuredContent: null,
  loading: false,
  error: null,
  favorites: [],
  watchlist: [],
  searchResults: [],
  searchLoading: false,
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setFeaturedContent: (state, action) => {
      state.featuredContent = action.payload;
    },
    addToFavorites: (state, action) => {
      const item = action.payload;
      const itemId = item.id || item.trackId;
      const exists = state.favorites.find(fav => (fav.id || fav.trackId) === itemId);
      if (!exists) {
        state.favorites.unshift({
          ...item,
          favoritedAt: new Date().toISOString(),
        });
      }
    },
    removeFromFavorites: (state, action) => {
      const itemId = action.payload;
      state.favorites = state.favorites.filter(fav => (fav.id || fav.trackId) !== itemId);
    },
    addToWatchlist: (state, action) => {
      const item = action.payload;
      const itemId = item.id || item.trackId;
      const exists = state.watchlist.find(watch => (watch.id || watch.trackId) === itemId);
      if (!exists) {
        state.watchlist.unshift({
          ...item,
          addedAt: new Date().toISOString(),
        });
      }
    },
    removeFromWatchlist: (state, action) => {
      const itemId = action.payload;
      state.watchlist = state.watchlist.filter(watch => (watch.id || watch.trackId) !== itemId);
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setSearchLoading: (state, action) => {
      state.searchLoading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Trending Movies
    builder.addCase(fetchTrendingMovies.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTrendingMovies.fulfilled, (state, action) => {
      state.loading = false;
      state.trendingMovies = action.payload;
    });
    builder.addCase(fetchTrendingMovies.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Trending Music
    builder.addCase(fetchTrendingMusic.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTrendingMusic.fulfilled, (state, action) => {
      state.loading = false;
      state.trendingMusic = action.payload;
    });
    builder.addCase(fetchTrendingMusic.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Trending Podcasts
    builder.addCase(fetchTrendingPodcasts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTrendingPodcasts.fulfilled, (state, action) => {
      state.loading = false;
      state.trendingPodcasts = action.payload;
    });
    builder.addCase(fetchTrendingPodcasts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Load Persisted Data
    builder.addCase(loadPersistedFavorites.fulfilled, (state, action) => {
      state.favorites = action.payload;
    });
    builder.addCase(loadPersistedWatchlist.fulfilled, (state, action) => {
      state.watchlist = action.payload;
    });

    // Persist Favorites
    builder.addCase(persistFavoriteItem.fulfilled, (state, action) => {
      state.favorites = action.payload;
    });
    builder.addCase(removePersistentFavorite.fulfilled, (state, action) => {
      state.favorites = action.payload;
    });

    // Persist Watchlist
    builder.addCase(persistWatchlistItem.fulfilled, (state, action) => {
      state.watchlist = action.payload;
    });
    builder.addCase(removePersistentWatchlistItem.fulfilled, (state, action) => {
      state.watchlist = action.payload;
    });
  },
});

export const {
  setFeaturedContent,
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist,
  setSearchResults,
  clearSearchResults,
  setSearchLoading,
  clearError,
} = mediaSlice.actions;

export default mediaSlice.reducer;