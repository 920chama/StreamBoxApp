import axios from 'axios';
import { API_CONFIG } from '../constants/api';

// Create axios instance
const api = axios.create({
  timeout: 10000,
});

// Sample movie data for demo (since TMDB requires API key)
const sampleMovies = [
  {
    id: 1,
    title: "Avatar: The Way of Water",
    overview: "Set more than a decade after the events of the first film, learn the story of the Sully family.",
    poster_path: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    release_date: "2022-12-14",
    vote_average: 7.7,
    genre_ids: [878, 12, 28]
  },
  {
    id: 2,
    title: "Black Panther: Wakanda Forever",
    overview: "Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje fight to protect their nation.",
    poster_path: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg",
    release_date: "2022-11-09",
    vote_average: 7.3,
    genre_ids: [28, 12, 18]
  },
  {
    id: 3,
    title: "Top Gun: Maverick",
    overview: "After thirty years, Maverick is still pushing the envelope as a top naval aviator.",
    poster_path: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
    release_date: "2022-05-24",
    vote_average: 8.3,
    genre_ids: [28, 18]
  },
  {
    id: 4,
    title: "Spider-Man: No Way Home",
    overview: "Peter Parker seeks help from Doctor Strange to make the world forget he is Spider-Man.",
    poster_path: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/14QbnygCuTO0vl7CAFmtEeSD9Wh.jpg",
    release_date: "2021-12-15",
    vote_average: 8.1,
    genre_ids: [28, 12, 878]
  },
  {
    id: 5,
    title: "The Batman",
    overview: "When the Riddler strikes at elite Gotham citizens, Batman must uncover corruption.",
    poster_path: "https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/xtmw7V3rKkv8JFf3y5y9v3qf2y0.jpg",
    release_date: "2022-03-01",
    vote_average: 7.7,
    genre_ids: [80, 9648, 53]
  },
  {
    id: 6,
    title: "Dune",
    overview: "Feature adaptation of Frank Herbert's science fiction novel about the son of a noble family.",
    poster_path: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/xt9JNDS9T7F7XNO5HGMAC3M0iHb.jpg",
    release_date: "2021-09-15",
    vote_average: 8.0,
    genre_ids: [878, 12]
  }
];

export const moviesApi = {
  getTrendingMovies: async () => {
    try {
      // For demo purposes, return sample data
      // In production, uncomment the line below and use your TMDB API key
      // const response = await api.get(`${API_CONFIG.TMDB_BASE_URL}/trending/movie/week?api_key=${API_CONFIG.TMDB_API_KEY}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        data: {
          results: sampleMovies
        }
      };
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  getPopularMovies: async () => {
    try {
      // Return shuffled sample data for variety
      const shuffled = [...sampleMovies].sort(() => 0.5 - Math.random());
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        data: {
          results: shuffled
        }
      };
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  getTopRatedMovies: async () => {
    try {
      // Return sorted by rating
      const sorted = [...sampleMovies].sort((a, b) => b.vote_average - a.vote_average);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        data: {
          results: sorted
        }
      };
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  }
};