import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favoritesStorage, watchlistStorage } from '../../utils/storageUtils';
import { moviesApi } from '../../services/moviesApi';
import { musicApi } from '../../services/musicApi';
import { podcastsApi } from '../../services/podcastsApi';

// Async thunks for API calls
export const fetchTrendingMovies = createAsyncThunk(
  'media/fetchTrendingMovies',
  async () => {
    try {
      const response = await moviesApi.getTrendingMovies();
      return response.data.results;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      // Fallback to enhanced test data if API fails
      return [
        {
          id: 901,
          title: "Avatar: The Way of Water",
          overview: "Set more than a decade after the events of the first film, learn the story of the Sully family.",
          poster_path: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
          vote_average: 8.5,
          release_date: "2023-01-01"
        },
        {
          id: 902,
          title: "Black Panther: Wakanda Forever",
          overview: "Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje fight to protect their nation.",
          poster_path: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
          vote_average: 7.8,
          release_date: "2023-02-01"
        },
      ];
    }
  }
);

export const fetchTrendingMusic = createAsyncThunk(
  'media/fetchTrendingMusic',
  async () => {
    try {
      const response = await musicApi.getTrendingTracks();
      return response.data.results;
    } catch (error) {
      console.error('Error fetching trending music:', error);
      // Fallback to enhanced test data if API fails
      return [
        {
          trackId: 801,
          trackName: "Anti-Hero",
          artistName: "Taylor Swift",
          artworkUrl100: "https://picsum.photos/300/300?random=11",
          trackTimeMillis: 200560,
          trackPrice: 1.29
        },
        {
          trackId: 802,
          trackName: "Flowers",
          artistName: "Miley Cyrus",
          artworkUrl100: "https://picsum.photos/300/300?random=12",
          trackTimeMillis: 200000,
          trackPrice: 1.29
        },
      ];
    }
  }
);

export const fetchTrendingPodcasts = createAsyncThunk(
  'media/fetchTrendingPodcasts',
  async () => {
    try {
      const response = await podcastsApi.getTrendingPodcasts();
      return response.data.podcasts;
    } catch (error) {
      console.error('Error fetching trending podcasts:', error);
      // Fallback to enhanced test data if API fails
      return [
        {
          id: 701,
          title: "The Joe Rogan Experience",
          description: "The official podcast of comedian Joe Rogan featuring conversations with fascinating guests.",
          image: "https://picsum.photos/300/300?random=13",
          publisher: "Joe Rogan",
          total_episodes: 2000,
          explicit: false
        },
        {
          id: 702,
          title: "Crime Junkie",
          description: "If you can never get enough true crime... Congratulations, you've found your people.",
          image: "https://picsum.photos/300/300?random=14",
          publisher: "audiochuck",
          total_episodes: 400,
          explicit: false
        },
      ];
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

export const clearPersistentSampleData = createAsyncThunk(
  'media/clearPersistentSampleData',
  async () => {
    // Load current data
    const favoritesData = await favoritesStorage.load();
    const watchlistData = await watchlistStorage.load();
    
    // Filter out sample data
    const cleanFavorites = favoritesData.filter(fav => {
      const id = fav.id || fav.trackId;
      const isSampleData = id <= 10 || 
        (fav.title && fav.title.includes('Sample')) ||
        (fav.trackName && fav.trackName.includes('Sample'));
      return !isSampleData;
    });
    
    const cleanWatchlist = watchlistData.filter(item => {
      const id = item.id || item.trackId;
      const isSampleData = id <= 10 || 
        (item.title && item.title.includes('Sample')) ||
        (item.trackName && item.trackName.includes('Sample'));
      return !isSampleData;
    });
    
    // Save cleaned data back
    await favoritesStorage.save(cleanFavorites);
    await watchlistStorage.save(cleanWatchlist);
    
    return { favorites: cleanFavorites, watchlist: cleanWatchlist };
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
    setTrendingMovies: (state, action) => {
      state.trendingMovies = action.payload;
    },
    setTrendingMusic: (state, action) => {
      state.trendingMusic = action.payload;
    },
    setTrendingPodcasts: (state, action) => {
      state.trendingPodcasts = action.payload;
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
    clearSampleData: (state, action) => {
      // Remove any sample data from favorites (IDs 1-10 are considered sample data)
      state.favorites = state.favorites.filter(fav => {
        const id = fav.id || fav.trackId;
        const isSampleData = id <= 10 || 
          (fav.title && fav.title.includes('Sample')) ||
          (fav.trackName && fav.trackName.includes('Sample'));
        return !isSampleData;
      });
      // Also clear from watchlist
      state.watchlist = state.watchlist.filter(item => {
        const id = item.id || item.trackId;
        const isSampleData = id <= 10 || 
          (item.title && item.title.includes('Sample')) ||
          (item.trackName && item.trackName.includes('Sample'));
        return !isSampleData;
      });
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

    // Clear Persistent Sample Data
    builder.addCase(clearPersistentSampleData.fulfilled, (state, action) => {
      state.favorites = action.payload.favorites;
      state.watchlist = action.payload.watchlist;
    });
  },
});

export const {
  setFeaturedContent,
  setTrendingMovies,
  setTrendingMusic,
  setTrendingPodcasts,
  addToFavorites,
  removeFromFavorites,
  clearSampleData,
  addToWatchlist,
  removeFromWatchlist,
  setSearchResults,
  clearSearchResults,
  setSearchLoading,
  clearError,
} = mediaSlice.actions;

export default mediaSlice.reducer;