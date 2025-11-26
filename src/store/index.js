import { configureStore } from '@reduxjs/toolkit';
import mediaReducer from './slices/mediaSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    media: mediaReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;