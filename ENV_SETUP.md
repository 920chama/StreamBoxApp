# StreamBox - Environment Configuration

## 🔐 Setting Up API Keys

### Step 1: Create Environment File
Copy the example environment file:
```bash
cp .env.example .env
```

### Step 2: Get Your API Keys

#### TMDB API Key (Movies)
1. Visit [The Movie Database](https://www.themoviedb.org/)
2. Create an account or sign in
3. Go to Settings > API
4. Request an API key (it's free!)
5. Copy your API key

#### Listen Notes API Key (Podcasts)
1. Visit [Listen Notes API](https://www.listennotes.com/api/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. The free tier includes 10,000 requests per month

### Step 3: Update Your .env File
Open the `.env` file and update with your actual API keys:

```env
# TMDB API Key for movies
EXPO_PUBLIC_TMDB_API_KEY=your_actual_tmdb_key_here

# Listen Notes API Key for podcasts  
EXPO_PUBLIC_LISTEN_NOTES_API_KEY=your_actual_listen_notes_key_here
```

### Step 4: Restart the Development Server
After updating your `.env` file, restart the Expo development server:
```bash
npm start
```

## 🔒 Security Notes

- The `.env` file is ignored by git to keep your API keys secure
- Never commit your actual API keys to version control
- Use `.env.example` as a template for other developers
- The `EXPO_PUBLIC_` prefix makes variables available in the Expo app

## 🚀 Fallback Behavior

If no API keys are provided:
- **Movies**: Uses sample data for demonstration
- **Music**: Uses iTunes Search API (no key required)
- **Podcasts**: Uses sample data for demonstration

The app will work without API keys, but with limited data.

## 🔧 Troubleshooting

If you encounter issues:
1. Make sure your `.env` file is in the project root
2. Restart the Expo development server after changing environment variables
3. Check that your API keys are valid
4. Verify the `EXPO_PUBLIC_` prefix is used for all variables

## 📁 File Structure
```
StreamBox/
├── .env                 # Your actual API keys (git-ignored)
├── .env.example         # Template file (committed to git)
├── app.config.js        # Expo configuration with env vars
└── src/constants/api.js # API configuration using env vars
```