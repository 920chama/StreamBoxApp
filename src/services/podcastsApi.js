import axios from 'axios';
import { API_CONFIG } from '../constants/api';

// Enhanced sample podcast data for demo with better images
const samplePodcasts = [
  {
    id: 1,
    title: "The Joe Rogan Experience",
    description: "The official podcast of comedian Joe Rogan featuring conversations with fascinating guests.",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts126/v4/9b/6b/95/9b6b95b8-b9c7-3c91-8b1c-cb5e2ae42c10/mza_9583267189253983140.jpg/300x300bb.jpg",
    thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts126/v4/9b/6b/95/9b6b95b8-b9c7-3c91-8b1c-cb5e2ae42c10/mza_9583267189253983140.jpg/300x300bb.jpg",
    publisher: "Joe Rogan",
    language: "English",
    genre_ids: [67, 68],
    total_episodes: 2000,
    latest_episode_publish_time_ms: Date.now(),
    explicit: false
  },
  {
    id: 2,
    title: "Crime Junkie",
    description: "If you can never get enough true crime... Congratulations, you've found your people.",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/8e/4a/c6/8e4ac6a8-7c5a-3e2f-1abc-80dd5438b83e/mza_3157052564897388092.jpg/300x300bb.jpg",
    thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/8e/4a/c6/8e4ac6a8-7c5a-3e2f-1abc-80dd5438b83e/mza_3157052564897388092.jpg/300x300bb.jpg",
    publisher: "audiochuck",
    language: "English", 
    genre_ids: [68],
    total_episodes: 400,
    latest_episode_publish_time_ms: Date.now(),
    explicit: false
  },
  {
    id: 3,
    title: "Call Her Daddy",
    description: "Alex Cooper brings you candid conversations with personalities you've never heard before.",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts126/v4/bd/3e/8d/bd3e8d7e-0e6f-3828-b8e6-b9c4f2c5d3e4/mza_1234567890123456789.jpg/300x300bb.jpg",
    thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts126/v4/bd/3e/8d/bd3e8d7e-0e6f-3828-b8e6-b9c4f2c5d3e4/mza_1234567890123456789.jpg/300x300bb.jpg",
    publisher: "Spotify Studios",
    language: "English",
    genre_ids: [67, 133],
    total_episodes: 300,
    latest_episode_publish_time_ms: Date.now(),
    explicit: true
  },
  {
    id: 4,
    title: "Serial",
    description: "Serial is a podcast from the creators of This American Life, hosted by Sarah Koenig.",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts124/v4/d5/65/fd/d565fdd2-d7a8-5e56-6c97-3f2f4c6c9a8a/mza_8765432109876543210.jpg/200x200bb.jpg",
    publisher: "Serial Productions",
    language: "English",
    genre_ids: [68, 122],
    total_episodes: 50,
    latest_episode_publish_time_ms: Date.now()
  },
  {
    id: 5,
    title: "The Daily",
    description: "This is what the news should sound like. The biggest stories of our time, told by the best journalists.",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts126/v4/a8/9e/7c/a89e7c85-7b4d-3f67-4a8e-9c7d5a6b8e9f/mza_5432109876543210987.jpg/200x200bb.jpg",
    publisher: "The New York Times",
    language: "English",
    genre_ids: [99, 100],
    total_episodes: 1500,
    latest_episode_publish_time_ms: Date.now()
  },
  {
    id: 6,
    title: "Conan O'Brien Needs a Friend",
    description: "After 25 years at the Late Night desk, Conan realized that the only people at his job that he actually liked were his assistants.",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts114/v4/b6/4c/7e/b64c7e9a-8b5d-3f67-4c8e-9d7f5a6b8e9f/mza_6543210987654321098.jpg/200x200bb.jpg",
    publisher: "Team Coco & Earwolf",
    language: "English",
    genre_ids: [67, 133],
    total_episodes: 250,
    latest_episode_publish_time_ms: Date.now()
  }
];

export const podcastsApi = {
  getTrendingPodcasts: async () => {
    try {
      // Try using iTunes Search API for podcasts (free alternative)
      const response = await axios.get(`${API_CONFIG.ITUNES_BASE_URL}?term=popular&media=podcast&limit=50&country=US`);
      
      if (response.data && response.data.results && response.data.results.length > 0) {
        // Transform iTunes podcast data to match our format
        const transformedPodcasts = response.data.results.map(podcast => ({
          id: podcast.collectionId,
          title: podcast.collectionName,
          description: podcast.description || 'No description available',
          image: podcast.artworkUrl600 || podcast.artworkUrl100,
          publisher: podcast.artistName,
          language: 'English',
          genre_ids: [67], // Default to general category
          total_episodes: podcast.trackCount || 0,
          latest_episode_publish_time_ms: new Date(podcast.releaseDate).getTime()
        }));
        
        return {
          data: {
            podcasts: transformedPodcasts
          }
        };
      }
      
      // Fallback to sample data if iTunes doesn't return podcasts
      return {
        data: {
          podcasts: samplePodcasts
        }
      };
    } catch (error) {
      console.error('Error fetching trending podcasts:', error);
      // Fallback to sample data if API fails
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        data: {
          podcasts: samplePodcasts
        }
      };
    }
  },

  searchPodcasts: async (query) => {
    try {
      // For demo purposes, filter sample data
      const filtered = samplePodcasts.filter(podcast => 
        podcast.title.toLowerCase().includes(query.toLowerCase()) ||
        podcast.description.toLowerCase().includes(query.toLowerCase()) ||
        podcast.publisher.toLowerCase().includes(query.toLowerCase())
      );
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        data: {
          podcasts: filtered
        }
      };
    } catch (error) {
      console.error('Error searching podcasts:', error);
      throw error;
    }
  },

  getPopularPodcasts: async () => {
    try {
      // Try using iTunes Search API for popular podcasts
      const response = await axios.get(`${API_CONFIG.ITUNES_BASE_URL}?term=top&media=podcast&limit=50&country=US`);
      
      if (response.data && response.data.results && response.data.results.length > 0) {
        // Transform iTunes podcast data to match our format
        const transformedPodcasts = response.data.results.map(podcast => ({
          id: podcast.collectionId,
          title: podcast.collectionName,
          description: podcast.description || 'No description available',
          image: podcast.artworkUrl600 || podcast.artworkUrl100,
          publisher: podcast.artistName,
          language: 'English',
          genre_ids: [67], // Default to general category
          total_episodes: podcast.trackCount || 0,
          latest_episode_publish_time_ms: new Date(podcast.releaseDate).getTime()
        }));
        
        return {
          data: {
            podcasts: transformedPodcasts
          }
        };
      }
      
      // Fallback to sample data
      const shuffled = [...samplePodcasts].sort(() => 0.5 - Math.random());
      return {
        data: {
          podcasts: shuffled
        }
      };
    } catch (error) {
      console.error('Error fetching popular podcasts:', error);
      // Fallback to sample data if API fails
      const shuffled = [...samplePodcasts].sort(() => 0.5 - Math.random());
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        data: {
          podcasts: shuffled
        }
      };
    }
  }
};