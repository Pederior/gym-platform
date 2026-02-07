import api from "./api";
import { type User } from "../types";

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: "user" | "coach" | "admin";
}

export interface UserWorkout {
  _id: string;
  title: string;
  description: string;
  duration: number;
  assignedAt: string;
}

export interface UserProgress {
  _id: string;
  workout: string;
  completedDays: number;
  totalDays: number;
  lastActivity: string;
  status: "active" | "completed" | "paused";
}

export interface UserSubscriptionPlan {
  id: 'bronze' | 'silver' | 'gold';
  name: string;
  description: string;
  isPopular: boolean;
  features: string[];
  price: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
}

export interface Payment {
  _id: string;
  user: string;
  amount: number;
  type: 'subscription' | 'order' | 'other';
  method: 'online' | 'cash' | 'wallet';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  description?: string;
  details?: {
    orderId?: string;
    productCount?: number;
    totalAmount?: number;
    orderStatus?: string;
    subscriptionId?: string;
    plan?: string;
    amount?: number;
    status?: string;
  };
  transactionId?: string;
  createdAt: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  restTime: number;
}

export interface WorkoutDetail {
  _id: string;
  title: string;
  exercises: Exercise[];
}

export interface CreateSubscriptionDTO {
  planId: 'bronze' | 'silver' | 'gold';
  duration: 'monthly' | 'quarterly' | 'yearly';
}

export const userService = {
  async getAllUsers() {
    const res = await api.get<{ success: true; users: User[] }>("/users");
    return res.data.users;
  },

  async createUser(userData: CreateUserDTO) {
    const res = await api.post<{ success: true; user: User }>(
      "/users",
      userData,
    );
    return res.data.user;
  },

  async updateUser(userId: string, userData: Partial<CreateUserDTO>) {
    const res = await api.put<{ success: true; user: User }>(
      `/users/${userId}`,
      userData,
    );
    return res.data.user;
  },
  
  async updateUserPassword(userId: string, data: { password: string }) {
    const res = await api.put<{ success: true; message: string }>(
      `/users/${userId}/password`,
      data
    );
    return res.data;
  },

  async deleteUser(userId: string) {
    const res = await api.delete<{ success: true; message: string }>(
      `/users/${userId}`,
    );
    return res.data;
  },

  async getUserWorkouts() {
    const res = await api.get<{ success: true; workouts: UserWorkout[] }>(
      "/users/workouts",
    );
    return res.data.workouts;
  },

  async getUserProgresses() {
    const res = await api.get<{ success: true; progress: UserProgress[] }>(
      "/users/progress",
    );
    return res.data.progress;
  },

  async getSubscriptionPlans() {
    const res = await api.get<{ success: true; plans: UserSubscriptionPlan[] }>('/subscriptions/plans');
    return res.data.plans;
  },

  async createSubscription(data: { planId: 'bronze' | 'silver' | 'gold'; duration: 'monthly' | 'quarterly' | 'yearly' }) {
    const res = await api.post<{ success: true; message: string }>('/users/subscription', data);
    return res.data;
  },

  async getUserSubscription() {
    const res = await api.get<{ success: true; subscription: any }>('/users/subscription');
    return res.data.subscription;
  },

  async getUserPayments() {
    const res = await api.get<{ success: true; payments: Payment[] }>(
      "/payments",
    );
    return res.data.payments;
  },

  async submitWorkoutProgress(workoutId: string) {
    const res = await api.post<{ success: true }>('/users/progress', {
      workoutId,
      completedDays: 1 
    });
    return res.data;
  },

  async getWorkoutDetail(workoutId: string) {
    const res = await api.get<{ success: true; workout: WorkoutDetail }>(
      `/users/workouts/${workoutId}`
    );
    return res.data.workout;
  },
};