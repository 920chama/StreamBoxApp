# StreamBox - React Native Entertainment Media App

A comprehensive entertainment media application built with React Native and Expo for browsing trending movies, songs, and podcasts with full user authentication.

## 🚀 Features

### 🎬 **Entertainment Content**
- **Movies**: Browse trending films with TMDB integration
- **Music**: Discover popular songs and artists via iTunes Search API
- **Podcasts**: Explore trending podcasts using Listen Notes API
- **Search & Discovery**: Find content across all categories

### 🔐 **User Authentication**
- **Secure Registration & Login**: Complete user authentication flow
- **Form Validation**: Real-time validation with Yup schemas
- **Secure Storage**: Encrypted token storage with Expo SecureStore
- **Session Management**: Persistent login with automatic session restoration
- **User Profile**: Personalized experience with user information display

### 📱 **Modern UI/UX**
- **Bottom Tab Navigation**: Easy switching between content categories
- **Dark Theme**: Consistent dark theme throughout the app
- **Responsive Design**: Optimized for various screen sizes
- **Loading States**: Smooth transitions and feedback
- **Error Handling**: Graceful error management and user feedback

## 🛠 Tech Stack

### **Core Technologies**
- **React Native** with **Expo SDK**
- **React Navigation** for navigation management
- **React Context** for state management
- **Axios** for API requests

### **Authentication & Security**
- **Expo SecureStore** for encrypted token storage
- **AsyncStorage** for user preferences
- **Yup** for form validation
- **React Hook Form** for form management

### **APIs Integrated**
- **The Movie Database (TMDB)** - Movies data
- **iTunes Search API** - Music content
- **Listen Notes API** - Podcast content

### **UI Components**
- **Expo Vector Icons** for iconography
- **Expo Linear Gradient** for visual effects
- **Expo Image** for optimized image handling
- **Expo Blur** for visual effects

## 📦 Installation

### Prerequisites
- Node.js (v16 or later)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StreamBox
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   EXPO_PUBLIC_ITUNES_API_BASE_URL=https://itunes.apple.com/search
   EXPO_PUBLIC_LISTEN_NOTES_API_KEY=your_listen_notes_api_key_here
   EXPO_PUBLIC_LISTEN_NOTES_API_BASE_URL=https://listen-api.listennotes.com/api/v2
   ```

4. **Get API Keys**
   - **TMDB API Key**: Sign up at [The Movie Database](https://www.themoviedb.org/settings/api)
   - **Listen Notes API Key**: Get free tier at [Listen Notes](https://www.listennotes.com/api/)
   - **iTunes API**: No key required (public API)

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on device**
   - Download Expo Go from App Store/Play Store
   - Scan the QR code displayed in terminal
   - Or press `w` to open in web browser

## 🏗 Project Structure

```
StreamBox/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── UserMenu.js      # User profile dropdown menu
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.js   # Authentication context
│   ├── screens/             # App screens
│   │   ├── HomeScreen.js    # Main dashboard with user profile
│   │   ├── MoviesScreen.js  # Movies browsing
│   │   ├── MusicScreen.js   # Music discovery
│   │   ├── PodcastsScreen.js# Podcast exploration
│   │   ├── LoginScreen.js   # User login
│   │   └── RegisterScreen.js# User registration
│   ├── services/            # API services
│   │   ├── api.js          # API configuration
│   │   ├── movieService.js  # TMDB API calls
│   │   ├── musicService.js  # iTunes API calls
│   │   └── podcastService.js# Listen Notes API calls
│   ├── hooks/               # Custom React hooks
│   │   └── useFormValidation.js # Form validation hooks
│   ├── utils/               # Utility functions
│   │   └── authStorage.js   # Secure storage utilities
│   └── constants/           # App constants
│       └── Colors.js        # Color definitions
├── app.config.js           # Expo configuration with env vars
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables
├── AUTHENTICATION.md       # Authentication system documentation
└── README.md              # This file
```

## 🔐 Authentication System

### **Registration Requirements**
- **Full Name**: 2-50 characters
- **Username**: 3-20 characters (alphanumeric + underscores)
- **Email**: Valid email format
- **Password**: 8+ characters with uppercase, lowercase, and number
- **Confirm Password**: Must match password

### **Security Features**
- Encrypted token storage using Expo SecureStore
- Session persistence across app restarts
- Automatic logout on token expiration
- Secure password requirements
- Form validation and error handling

## 📱 App Screens

### **Authentication Flow**
- **Login Screen**: Secure sign-in with demo account option
- **Register Screen**: Complete signup with validation

### **Main Application**
- **Home**: Dashboard with personalized user greeting and quick access
- **Movies**: Browse trending movies with detailed information
- **Music**: Discover popular songs and artists
- **Podcasts**: Explore trending podcast content

### **User Experience**
- **User Profile**: Displayed in header with dropdown menu
- **Navigation**: Bottom tab navigation for easy content switching
- **Loading States**: Smooth transitions during API calls
- **Error Handling**: User-friendly error messages

## 🔧 Configuration

### **Environment Variables**
All API keys are stored securely in `.env` file:
- `EXPO_PUBLIC_TMDB_API_KEY` - The Movie Database API key
- `EXPO_PUBLIC_LISTEN_NOTES_API_KEY` - Listen Notes API key
- Base URLs for iTunes and Listen Notes APIs

### **API Configuration**
- **Movies**: TMDB API for trending movies and details
- **Music**: iTunes Search API for songs and artists
- **Podcasts**: Listen Notes API for podcast discovery
- **Authentication**: Mock authentication service (ready for backend integration)

## 🧪 Testing

### **Manual Testing**
1. **Registration**: Create new account with valid data
2. **Login**: Sign in with created account
3. **Navigation**: Switch between different content tabs
4. **Content Loading**: Verify API data loads correctly
5. **User Profile**: Check user information display
6. **Session Persistence**: Close and reopen app to verify login persistence
7. **Logout**: Sign out and verify session clearing

### **API Testing**
- Test network connectivity
- Verify API key functionality
- Check error handling for failed requests
- Validate data parsing and display

## 🚀 Deployment

### **Development**
```bash
npm start          # Start Expo development server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run in web browser
```

### **Production Build**
```bash
expo build:android  # Build Android APK/AAB
expo build:ios      # Build iOS IPA
```

### **Publishing**
```bash
expo publish       # Publish to Expo servers
```

## 🔮 Future Enhancements

### **Planned Features**
- [ ] **Advanced Search**: Filter and sort content
- [ ] **Favorites**: Save favorite movies, songs, podcasts
- [ ] **Recommendations**: Personalized content suggestions
- [ ] **Social Features**: Share content with friends
- [ ] **Offline Mode**: Download content for offline viewing
- [ ] **Push Notifications**: Alert for new trending content

### **Authentication Enhancements**
- [ ] **Email Verification**: Verify email addresses on signup
- [ ] **Password Reset**: Forgot password functionality
- [ ] **Social Login**: Google/Apple/Facebook authentication
- [ ] **Two-Factor Authentication**: Enhanced security
- [ ] **Biometric Login**: Fingerprint/Face ID support

### **Technical Improvements**
- [ ] **Real Backend**: Replace mock authentication with real API
- [ ] **State Management**: Implement Redux or Zustand
- [ ] **Caching**: Add content caching for offline access
- [ ] **Analytics**: User behavior tracking
- [ ] **Error Reporting**: Crash reporting and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **The Movie Database (TMDB)** for movie data
- **Apple iTunes** for music search API
- **Listen Notes** for podcast content
- **Expo Team** for the amazing development platform
- **React Native Community** for excellent documentation and support

---

**StreamBox - Your gateway to trending entertainment content! 🎬🎵🎙️**