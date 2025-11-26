import Constants from 'expo-constants';

// API Configuration using environment variables
export const API_CONFIG = {
  // TMDB API for movies (get your API key from themoviedb.org)
  TMDB_BASE_URL: Constants.expoConfig?.extra?.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: Constants.expoConfig?.extra?.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500',
  TMDB_API_KEY: Constants.expoConfig?.extra?.TMDB_API_KEY || process.env.EXPO_PUBLIC_TMDB_API_KEY || '542241f55019630a860129590dca5fcd',
  
  // For demo purposes, we'll use JSONPlaceholder and sample data
  DEMO_BASE_URL: Constants.expoConfig?.extra?.DEMO_BASE_URL || 'https://jsonplaceholder.typicode.com',
  
  // iTunes Search API for music (free to use)
  ITUNES_BASE_URL: Constants.expoConfig?.extra?.ITUNES_BASE_URL || 'https://itunes.apple.com/search',
  
  // Listen Notes API for podcasts (free tier available)
  LISTEN_NOTES_BASE_URL: Constants.expoConfig?.extra?.LISTEN_NOTES_BASE_URL || 'https://listen-api.listennotes.com/api/v2',
  LISTEN_NOTES_API_KEY: Constants.expoConfig?.extra?.LISTEN_NOTES_API_KEY || process.env.EXPO_PUBLIC_LISTEN_NOTES_API_KEY || 'your_listen_notes_api_key_here',
};

export const ENDPOINTS = {
  TRENDING_MOVIES: '/trending/movie/week',
  POPULAR_MOVIES: '/movie/popular',
  TOP_RATED_MOVIES: '/movie/top_rated',
  MOVIE_DETAILS: '/movie',
};