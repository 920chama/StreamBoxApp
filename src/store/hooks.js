import { useDispatch, useSelector } from 'react-redux';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Custom hooks for common selectors
export const useMediaData = () => {
  return useAppSelector((state) => state.media);
};

export const useUserData = () => {
  return useAppSelector((state) => state.user);
};

export const useFavorites = () => {
  return useAppSelector((state) => state.media.favorites);
};

export const useWatchlist = () => {
  return useAppSelector((state) => state.media.watchlist);
};

export const useSearchResults = () => {
  return useAppSelector((state) => state.media.searchResults);
};

export const useUserPreferences = () => {
  return useAppSelector((state) => state.user.preferences);
};

export const useWatchHistory = () => {
  return useAppSelector((state) => state.user.watchHistory);
};

export const usePlaylists = () => {
  return useAppSelector((state) => state.user.playlists);
};