import axios from 'axios';
import { API_CONFIG } from '../constants/api';

// Sample music data for demo
const sampleTracks = [
  {
    trackId: 1,
    trackName: "Anti-Hero",
    artistName: "Taylor Swift",
    artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/4a/8c/5c/4a8c5c15-9e74-7cb7-95c8-7e35a982c96a/22UMGIM86796.rgb.jpg/200x200bb.jpg",
    collectionName: "Midnights",
    primaryGenreName: "Pop",
    releaseDate: "2022-10-21T00:00:00Z",
    trackTimeMillis: 200560,
    country: "USA"
  },
  {
    trackId: 2,
    trackName: "Flowers",
    artistName: "Miley Cyrus",
    artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/93/8a/8c/938a8c24-2e69-8b55-5c0a-dd50bec8c0a8/196589305374.jpg/200x200bb.jpg",
    collectionName: "Endless Summer Vacation",
    primaryGenreName: "Pop",
    releaseDate: "2023-01-13T00:00:00Z",
    trackTimeMillis: 200000,
    country: "USA"
  },
  {
    trackId: 3,
    trackName: "As It Was",
    artistName: "Harry Styles",
    artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/89/15/fa/8915fab0-fc5a-5bba-9c27-1bd7b84bb8f7/22UMGIM29389.rgb.jpg/200x200bb.jpg",
    collectionName: "Harry's House",
    primaryGenreName: "Pop",
    releaseDate: "2022-04-01T00:00:00Z",
    trackTimeMillis: 167000,
    country: "USA"
  },
  {
    trackId: 4,
    trackName: "Bad Habit",
    artistName: "Steve Lacy",
    artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c7/77/98/c777985d-b8a3-c16f-3299-06de00e21b5b/22UMGIM59901.rgb.jpg/200x200bb.jpg",
    collectionName: "Gemini Rights",
    primaryGenreName: "R&B/Soul",
    releaseDate: "2022-06-29T00:00:00Z",
    trackTimeMillis: 233000,
    country: "USA"
  },
  {
    trackId: 5,
    trackName: "Unholy",
    artistName: "Sam Smith ft. Kim Petras",
    artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/3b/23/93/3b2393c7-9a5c-7e16-2f5a-ef2e0dd7ea3a/22UMGIM78142.rgb.jpg/200x200bb.jpg",
    collectionName: "Gloria",
    primaryGenreName: "Pop",
    releaseDate: "2022-09-22T00:00:00Z",
    trackTimeMillis: 156000,
    country: "USA"
  },
  {
    trackId: 6,
    trackName: "Shivers",
    artistName: "Ed Sheeran",
    artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/85/c2/84/85c28420-a5fc-5a7a-3ec8-83b2b8c4a8c5/21UMGIM33878.rgb.jpg/200x200bb.jpg",
    collectionName: "=",
    primaryGenreName: "Pop",
    releaseDate: "2021-09-10T00:00:00Z",
    trackTimeMillis: 207000,
    country: "USA"
  }
];

export const musicApi = {
  getTrendingTracks: async () => {
    try {
      // For demo purposes, return sample data
      // In production, you could use iTunes Search API:
      // const response = await axios.get(`${API_CONFIG.ITUNES_BASE_URL}?term=trending&media=music&limit=50`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        data: {
          results: sampleTracks
        }
      };
    } catch (error) {
      console.error('Error fetching trending tracks:', error);
      throw error;
    }
  },

  searchMusic: async (query) => {
    try {
      // Use iTunes Search API for real search
      const response = await axios.get(`${API_CONFIG.ITUNES_BASE_URL}?term=${encodeURIComponent(query)}&media=music&limit=25`);
      return response;
    } catch (error) {
      console.error('Error searching music:', error);
      // Fallback to sample data if API fails
      const filtered = sampleTracks.filter(track => 
        track.trackName.toLowerCase().includes(query.toLowerCase()) ||
        track.artistName.toLowerCase().includes(query.toLowerCase())
      );
      return {
        data: {
          results: filtered
        }
      };
    }
  },

  getPopularTracks: async () => {
    try {
      // Return shuffled sample data
      const shuffled = [...sampleTracks].sort(() => 0.5 - Math.random());
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        data: {
          results: shuffled
        }
      };
    } catch (error) {
      console.error('Error fetching popular tracks:', error);
      throw error;
    }
  }
};