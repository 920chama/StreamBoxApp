import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  preferences: {
    theme: 'dark',
    autoplay: true,
    notifications: true,
    quality: 'high',
    language: 'en',
  },
  watchHistory: [],
  downloads: [],
  playlists: [],
  settings: {
    parentalControls: false,
    dataUsage: 'auto',
    offlineMode: false,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    addToWatchHistory: (state, action) => {
      const item = action.payload;
      // Remove if already exists to avoid duplicates
      state.watchHistory = state.watchHistory.filter(watch => watch.id !== item.id);
      // Add to beginning of array
      state.watchHistory.unshift(item);
      // Keep only last 50 items
      if (state.watchHistory.length > 50) {
        state.watchHistory = state.watchHistory.slice(0, 50);
      }
    },
    clearWatchHistory: (state) => {
      state.watchHistory = [];
    },
    addToDownloads: (state, action) => {
      const item = action.payload;
      const exists = state.downloads.find(download => download.id === item.id);
      if (!exists) {
        state.downloads.push({
          ...item,
          downloadedAt: new Date().toISOString(),
          status: 'completed',
        });
      }
    },
    removeFromDownloads: (state, action) => {
      const itemId = action.payload;
      state.downloads = state.downloads.filter(download => download.id !== itemId);
    },
    createPlaylist: (state, action) => {
      const { name, description = '' } = action.payload;
      const newPlaylist = {
        id: Date.now().toString(),
        name,
        description,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.playlists.push(newPlaylist);
    },
    deletePlaylist: (state, action) => {
      const playlistId = action.payload;
      state.playlists = state.playlists.filter(playlist => playlist.id !== playlistId);
    },
    addToPlaylist: (state, action) => {
      const { playlistId, item } = action.payload;
      const playlist = state.playlists.find(p => p.id === playlistId);
      if (playlist) {
        const exists = playlist.items.find(i => i.id === item.id);
        if (!exists) {
          playlist.items.push(item);
          playlist.updatedAt = new Date().toISOString();
        }
      }
    },
    removeFromPlaylist: (state, action) => {
      const { playlistId, itemId } = action.payload;
      const playlist = state.playlists.find(p => p.id === playlistId);
      if (playlist) {
        playlist.items = playlist.items.filter(item => item.id !== itemId);
        playlist.updatedAt = new Date().toISOString();
      }
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    resetUserData: (state) => {
      return initialState;
    },
  },
});

export const {
  setProfile,
  updatePreferences,
  addToWatchHistory,
  clearWatchHistory,
  addToDownloads,
  removeFromDownloads,
  createPlaylist,
  deletePlaylist,
  addToPlaylist,
  removeFromPlaylist,
  updateSettings,
  resetUserData,
} = userSlice.actions;

export default userSlice.reducer;