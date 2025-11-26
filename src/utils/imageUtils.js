/**
 * Image utility functions for handling different media types and image URLs
 */

// Base URLs for different image sources
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

/**
 * Get the appropriate image URI for different media types
 * @param {Object} item - The media item (movie, music, podcast)
 * @param {string} type - The media type ('movie', 'music', 'podcast')
 * @param {string} fallbackText - Fallback text for placeholder image
 * @returns {string} - The image URI
 */
export const getImageUri = (item, type, fallbackText = 'Media') => {
  if (!item) {
    return `https://via.placeholder.com/300x450/333/fff?text=${encodeURIComponent(fallbackText)}`;
  }

  switch (type) {
    case 'movie':
      if (item.poster_path) {
        // Handle both full URLs and path-only strings
        if (item.poster_path.startsWith('http')) {
          return item.poster_path;
        }
        return `${TMDB_IMAGE_BASE_URL}${item.poster_path}`;
      }
      return `https://via.placeholder.com/300x450/333/fff?text=${encodeURIComponent(fallbackText || 'Movie')}`;

    case 'music':
      if (item.artworkUrl100) {
        // Scale up iTunes artwork for better quality
        return item.artworkUrl100.replace('100x100', '600x600');
      }
      if (item.artworkUrl60) {
        return item.artworkUrl60.replace('60x60', '600x600');
      }
      return `https://via.placeholder.com/300x300/333/fff?text=${encodeURIComponent(fallbackText || 'Music')}`;

    case 'podcast':
      if (item.image) {
        return item.image;
      }
      if (item.thumbnail) {
        return item.thumbnail;
      }
      return `https://via.placeholder.com/300x300/333/fff?text=${encodeURIComponent(fallbackText || 'Podcast')}`;

    default:
      return `https://via.placeholder.com/300x450/333/fff?text=${encodeURIComponent(fallbackText || 'Unknown')}`;
  }
};

/**
 * Get the backdrop image URI (primarily for movies)
 * @param {Object} item - The media item
 * @param {string} fallbackText - Fallback text for placeholder image
 * @returns {string} - The backdrop image URI
 */
export const getBackdropUri = (item, fallbackText = 'Backdrop') => {
  if (!item) {
    return `https://via.placeholder.com/1280x720/333/fff?text=${encodeURIComponent(fallbackText)}`;
  }

  // Try backdrop path first
  if (item.backdrop_path) {
    if (item.backdrop_path.startsWith('http')) {
      return item.backdrop_path;
    }
    return `${TMDB_BACKDROP_BASE_URL}${item.backdrop_path}`;
  }

  // Fall back to poster path for movies
  if (item.poster_path) {
    if (item.poster_path.startsWith('http')) {
      return item.poster_path;
    }
    return `${TMDB_IMAGE_BASE_URL}${item.poster_path}`;
  }

  // Fall back to artwork for music
  if (item.artworkUrl100) {
    return item.artworkUrl100.replace('100x100', '1200x1200');
  }

  // Fall back to image for podcasts
  if (item.image) {
    return item.image;
  }

  // Default placeholder
  return `https://via.placeholder.com/1280x720/333/fff?text=${encodeURIComponent(fallbackText)}`;
};

/**
 * Get image properties for Expo Image component
 * @param {string} uri - The image URI
 * @param {string} placeholder - Placeholder text
 * @param {number} transition - Transition duration in ms
 * @returns {Object} - Props object for Image component
 */
export const getImageProps = (uri, placeholder = 'Loading...', transition = 200) => {
  return {
    source: { uri },
    placeholder,
    transition,
    contentFit: 'cover',
    style: { backgroundColor: '#333' }, // Fallback background while loading
  };
};

/**
 * Get thumbnail URI for smaller images (like in lists)
 * @param {Object} item - The media item
 * @param {string} type - The media type
 * @param {string} fallbackText - Fallback text
 * @returns {string} - The thumbnail URI
 */
export const getThumbnailUri = (item, type, fallbackText = 'Thumbnail') => {
  if (!item) {
    return `https://via.placeholder.com/150x150/333/fff?text=${encodeURIComponent(fallbackText)}`;
  }

  switch (type) {
    case 'movie':
      if (item.poster_path) {
        if (item.poster_path.startsWith('http')) {
          return item.poster_path;
        }
        return `https://image.tmdb.org/t/p/w300${item.poster_path}`;
      }
      return `https://via.placeholder.com/150x225/333/fff?text=${encodeURIComponent(fallbackText)}`;

    case 'music':
      if (item.artworkUrl100) {
        return item.artworkUrl100;
      }
      if (item.artworkUrl60) {
        return item.artworkUrl60;
      }
      return `https://via.placeholder.com/150x150/333/fff?text=${encodeURIComponent(fallbackText)}`;

    case 'podcast':
      if (item.image) {
        return item.image;
      }
      if (item.thumbnail) {
        return item.thumbnail;
      }
      return `https://via.placeholder.com/150x150/333/fff?text=${encodeURIComponent(fallbackText)}`;

    default:
      return `https://via.placeholder.com/150x150/333/fff?text=${encodeURIComponent(fallbackText)}`;
  }
};

/**
 * Validate if an image URI is valid
 * @param {string} uri - The image URI to validate
 * @returns {boolean} - Whether the URI is valid
 */
export const isValidImageUri = (uri) => {
  if (!uri || typeof uri !== 'string') return false;
  
  // Check if it's a valid URL or placeholder
  return uri.startsWith('http') || uri.startsWith('https') || uri.includes('placeholder');
};

/**
 * Get fallback image for failed loads
 * @param {string} type - The media type
 * @param {string} text - Fallback text
 * @returns {string} - Fallback image URI
 */
export const getFallbackImage = (type = 'media', text = 'No Image') => {
  const dimensions = type === 'movie' ? '300x450' : '300x300';
  return `https://via.placeholder.com/${dimensions}/333/fff?text=${encodeURIComponent(text)}`;
};

/**
 * Process image URI with error handling
 * @param {string} uri - Original image URI
 * @param {string} type - Media type for fallback
 * @param {string} fallbackText - Text for fallback image
 * @returns {string} - Processed image URI
 */
export const processImageUri = (uri, type = 'media', fallbackText = 'Image') => {
  if (isValidImageUri(uri)) {
    return uri;
  }
  return getFallbackImage(type, fallbackText);
};