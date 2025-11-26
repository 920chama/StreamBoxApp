import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  AUTH_STATE: 'auth_state',
};

// Check if SecureStore is available (not available in web)
const isSecureStoreAvailable = Platform.OS !== 'web' && SecureStore.isAvailableAsync;

// Secure storage utility class
class AuthStorage {
  // Store sensitive data securely (tokens)
  static async setSecureItem(key, value) {
    try {
      if (isSecureStoreAvailable) {
        await SecureStore.setItemAsync(key, value);
      } else {
        // Fallback to AsyncStorage for web
        await AsyncStorage.setItem(`secure_${key}`, value);
      }
    } catch (error) {
      console.error(`Error storing secure item ${key}:`, error);
      throw error;
    }
  }

  // Get sensitive data securely
  static async getSecureItem(key) {
    try {
      if (isSecureStoreAvailable) {
        return await SecureStore.getItemAsync(key);
      } else {
        // Fallback to AsyncStorage for web
        return await AsyncStorage.getItem(`secure_${key}`);
      }
    } catch (error) {
      console.error(`Error retrieving secure item ${key}:`, error);
      return null;
    }
  }

  // Remove sensitive data
  static async removeSecureItem(key) {
    try {
      if (isSecureStoreAvailable) {
        await SecureStore.deleteItemAsync(key);
      } else {
        // Fallback to AsyncStorage for web
        await AsyncStorage.removeItem(`secure_${key}`);
      }
    } catch (error) {
      console.error(`Error removing secure item ${key}:`, error);
    }
  }

  // Store non-sensitive data (user profile)
  static async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing item ${key}:`, error);
      throw error;
    }
  }

  // Get non-sensitive data
  static async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving item ${key}:`, error);
      return null;
    }
  }

  // Remove non-sensitive data
  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  }

  // Authentication specific methods
  static async storeAuthData(authData) {
    try {
      const { accessToken, refreshToken, user } = authData;
      
      // Store tokens securely
      if (accessToken) {
        await this.setSecureItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      }
      if (refreshToken) {
        await this.setSecureItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      
      // Store user data in regular storage (non-sensitive)
      if (user) {
        await this.setItem(STORAGE_KEYS.USER_DATA, user);
      }

      // Store auth state
      await this.setItem(STORAGE_KEYS.AUTH_STATE, { isAuthenticated: true });
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  }

  static async getAuthData() {
    try {
      const [accessToken, refreshToken, userData, authState] = await Promise.all([
        this.getSecureItem(STORAGE_KEYS.ACCESS_TOKEN),
        this.getSecureItem(STORAGE_KEYS.REFRESH_TOKEN),
        this.getItem(STORAGE_KEYS.USER_DATA),
        this.getItem(STORAGE_KEYS.AUTH_STATE),
      ]);

      return {
        accessToken,
        refreshToken,
        user: userData,
        isAuthenticated: authState?.isAuthenticated || false,
      };
    } catch (error) {
      console.error('Error retrieving auth data:', error);
      return {
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
      };
    }
  }

  static async clearAuthData() {
    try {
      await Promise.all([
        this.removeSecureItem(STORAGE_KEYS.ACCESS_TOKEN),
        this.removeSecureItem(STORAGE_KEYS.REFRESH_TOKEN),
        this.removeItem(STORAGE_KEYS.USER_DATA),
        this.removeItem(STORAGE_KEYS.AUTH_STATE),
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  static async updateUserData(userData) {
    try {
      await this.setItem(STORAGE_KEYS.USER_DATA, userData);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  }
}

export { AuthStorage, STORAGE_KEYS };