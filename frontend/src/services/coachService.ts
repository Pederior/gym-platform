import api from './api'

export interface Exercise {
  name: string
  sets: number
  reps: number
  restTime: number
}

export interface WorkoutPlan {
  _id: string
  title: string
  description: string
  duration: number
  exercises: Exercise[]
  coach: string
  createdAt: string
}

interface CreateWorkoutDTO {
  title: string
  description: string
  duration: number
  exercises: Exercise[]
}


export interface UserProgress {
  _id: string
  user: { name: string; _id: string }
  workout: string
  completedDays: number
  totalDays: number
  lastActivity: string
  status: 'active' | 'completed' | 'paused'
}

export interface WorkoutUser {
  _id: string
  name: string
}

interface AssignWorkoutDTO {
  userId: string
  workoutId: string
}``

export const coachService = {
  async getWorkouts() {
    const res = await api.get<{ success: true; workouts: WorkoutPlan[] }>('/workouts')
    return res.data.workouts
  },

  async createWorkout(workoutData: CreateWorkoutDTO) {
    const res = await api.post<{ success: true; workout: WorkoutPlan }>('/workouts', workoutData)
    return res.data.workout
  },

  async updateWorkout(id: string, workoutData: Partial<CreateWorkoutDTO>) {
    const res = await api.put<{ success: true; workout: WorkoutPlan }>(`/workouts/${id}`, workoutData)
    return res.data.workout
  },

  async deleteWorkout(id: string) {
    const res = await api.delete<{ success: true; message: string }>(`/workouts/${id}`)
    return res.data
  },
  async getWorkoutUsers(workoutId: string) {
    const res = await api.get<{ success: true; users: WorkoutUser[] }>(`/workouts/${workoutId}/users`)
    return res.data.users
  },
  async assignWorkoutToUser(data: AssignWorkoutDTO) {
    const res = await api.post<{ success: true; userWorkout: any }>('/user-workouts', data)
    return res.data.userWorkout
  }
  
}

export const getUserProgress = async () => {
  const res = await api.get<{ success: true; progress: UserProgress[] }>('/coach/progress')
  return res.data.progress
}

export const getAllUsers = async () => {
  const res = await api.get<{ success: true; users: WorkoutUser[] }>('/users?role=user')
  return res.data.users
}