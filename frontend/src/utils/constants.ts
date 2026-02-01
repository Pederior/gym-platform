export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const USER_ROLES = {
  ADMIN: 'admin',
  COACH: 'coach',
  USER: 'user',
} as const

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  ADMIN: '/admin',
  COACH: '/coach',
  PROFILE: '/profile',
  WORKOUTS: '/workouts',
  CLASSES: '/classes',
  CHAT: '/chat',
} as const