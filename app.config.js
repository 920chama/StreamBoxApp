export default {
  expo: {
    name: "StreamBox",
    slug: "StreamBox", 
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      // API Configuration from environment variables
      TMDB_BASE_URL: process.env.EXPO_PUBLIC_TMDB_BASE_URL,
      TMDB_IMAGE_BASE_URL: process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE_URL,
      TMDB_API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY,
      DEMO_BASE_URL: process.env.EXPO_PUBLIC_DEMO_BASE_URL,
      ITUNES_BASE_URL: process.env.EXPO_PUBLIC_ITUNES_BASE_URL,
      LISTEN_NOTES_BASE_URL: process.env.EXPO_PUBLIC_LISTEN_NOTES_BASE_URL,
      LISTEN_NOTES_API_KEY: process.env.EXPO_PUBLIC_LISTEN_NOTES_API_KEY,
    },
  },
};