import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
// import userReducer from './features/userSlice'
// import workoutReducer from './features/workoutSlice'
// import chatReducer from './features/chatSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // user: userReducer,
    // workouts: workoutReducer,
    // chat: chatReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch