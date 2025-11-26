import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthStorage } from '../utils/authStorage';

// Auth action types
const AUTH_ACTIONS = {
  RESTORE_SESSION: 'RESTORE_SESSION',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
  SET_LOADING: 'SET_LOADING',
  UPDATE_USER: 'UPDATE_USER',
};

// Initial auth state
const initialState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  isLoading: true,
  error: null,
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isLoading: false,
      };
    case AUTH_ACTIONS.SIGN_IN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTIONS.SIGN_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext(null);

// Mock API functions (in a real app, these would call your backend)
const mockAuthAPI = {
  signIn: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for existing users in storage (for registered users)
    const storedUsers = await AuthStorage.getItem('registered_users') || [];
    const user = storedUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        data: {
          accessToken: 'mock_access_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now(),
          user: userWithoutPassword,
        },
      };
    }
    
    return {
      success: false,
      error: 'Invalid email or password',
    };
  },

  signUp: async (userData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { email, password, username, name } = userData;
    
    // Check if user already exists
    const storedUsers = await AuthStorage.getItem('registered_users') || [];
    const existingUser = storedUsers.find(u => u.email === email || u.username === username);
    
    if (existingUser) {
      return {
        success: false,
        error: 'User with this email or username already exists',
      };
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      username,
      name,
      password, // In real app, this would be hashed
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    
    // Store user
    storedUsers.push(newUser);
    await AuthStorage.setItem('registered_users', storedUsers);
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      success: true,
      data: {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        user: userWithoutPassword,
      },
    };
  },

  refreshToken: async (refreshToken) => {
    // Simulate token refresh
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        accessToken: 'mock_refreshed_token_' + Date.now(),
      },
    };
  },
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore authentication session on app start
  useEffect(() => {
    restoreAuthSession();
  }, []);

  const restoreAuthSession = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      const authData = await AuthStorage.getAuthData();
      
      if (authData.isAuthenticated && authData.accessToken && authData.user) {
        dispatch({
          type: AUTH_ACTIONS.RESTORE_SESSION,
          payload: {
            isAuthenticated: true,
            user: authData.user,
            accessToken: authData.accessToken,
          },
        });
      } else {
        dispatch({
          type: AUTH_ACTIONS.RESTORE_SESSION,
          payload: {
            isAuthenticated: false,
            user: null,
            accessToken: null,
          },
        });
      }
    } catch (error) {
      console.error('Error restoring auth session:', error);
      dispatch({
        type: AUTH_ACTIONS.RESTORE_SESSION,
        payload: {
          isAuthenticated: false,
          user: null,
          accessToken: null,
        },
      });
    }
  };

  const signIn = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await mockAuthAPI.signIn(email, password);
      
      if (response.success) {
        const { accessToken, refreshToken, user } = response.data;
        
        // Store auth data securely
        await AuthStorage.storeAuthData({
          accessToken,
          refreshToken,
          user,
        });
        
        dispatch({
          type: AUTH_ACTIONS.SIGN_IN,
          payload: {
            user,
            accessToken,
          },
        });
        
        return { success: true };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: false, error: response.error };
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await mockAuthAPI.signUp(userData);
      
      if (response.success) {
        const { accessToken, refreshToken, user } = response.data;
        
        // Store auth data securely
        await AuthStorage.storeAuthData({
          accessToken,
          refreshToken,
          user,
        });
        
        dispatch({
          type: AUTH_ACTIONS.SIGN_IN,
          payload: {
            user,
            accessToken,
          },
        });
        
        return { success: true };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: false, error: response.error };
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      await AuthStorage.clearAuthData();
      dispatch({ type: AUTH_ACTIONS.SIGN_OUT });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = { ...state.user, ...userData };
      await AuthStorage.updateUserData(updatedUser);
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: userData,
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    updateUser,
    restoreAuthSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};