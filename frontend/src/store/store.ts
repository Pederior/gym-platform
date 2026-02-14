import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
// import userReducer from './features/userSlice'
// import workoutReducer from './features/workoutSlice'
import chatReducer from './features/chatSlice'
import darkModeReducer from './features/darkModeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // user: userReducer,
    // workouts: workoutReducer,
    darkMode: darkModeReducer,
    chat: chatReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch