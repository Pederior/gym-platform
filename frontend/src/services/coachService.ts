import api from "./api";

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  restTime: number;
}

export interface WorkoutPlan {
  _id: string;
  title: string;
  description: string;
  duration: number;
  exercises: Exercise[];
  coach: string;
  createdAt: string;
}

interface CreateWorkoutDTO {
  title: string;
  description: string;
  duration: number;
  exercises: Exercise[];
}

export interface UserProgress {
  _id: string;
  user: { name: string; _id: string };
  workout: string;
  completedDays: number;
  totalDays: number;
  lastActivity: string;
  status: "active" | "completed" | "paused";
}

export interface WorkoutUser {
  _id: string;
  name: string;
}

interface AssignWorkoutDTO {
  userId: string;
  workoutId: string;
}

export interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  category: "nutrition" | "workout" | "lifestyle" | "motivation" | "health";
  status: "draft" | "published";
  featuredImage?: string;
  tags: string[];
  readTime: number;
  commentsCount: number;
  createdAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  article: { title: string; _id: string };
  author: { name: string; email: string };
  parent?: { content: string; author: { name: string } };
  likes: number;
  createdAt: string;
}

export const coachService = {
  async getWorkouts() {
    const res = await api.get<{ success: true; workouts: WorkoutPlan[] }>(
      "/workouts",
    );
    return res.data.workouts;
  },

  async createWorkout(workoutData: CreateWorkoutDTO) {
    const res = await api.post<{ success: true; workout: WorkoutPlan }>(
      "/workouts",
      workoutData,
    );
    return res.data.workout;
  },

  async updateWorkout(id: string, workoutData: Partial<CreateWorkoutDTO>) {
    const res = await api.put<{ success: true; workout: WorkoutPlan }>(
      `/workouts/${id}`,
      workoutData,
    );
    return res.data.workout;
  },

  async deleteWorkout(id: string) {
    const res = await api.delete<{ success: true; message: string }>(
      `/workouts/${id}`,
    );
    return res.data;
  },
  async getWorkoutUsers(workoutId: string) {
    const res = await api.get<{ success: true; users: WorkoutUser[] }>(
      `/workouts/${workoutId}/users`,
    );
    return res.data.users;
  },
  async assignWorkoutToUser(data: AssignWorkoutDTO) {
    const res = await api.post<{ success: true; userWorkout: any }>(
      "/user-workouts",
      data,
    );
    return res.data.userWorkout;
  },

  async getArticles() {
    const res = await api.get<{ success: true; articles: Article[] }>(
      "/coach/articles",
    );
    return res.data;
  },

  async getArticle(id: string) {
    const res = await api.get<{ success: true; article: Article }>(
      `/coach/articles/${id}`,
    );
    return res.data.article;
  },

  async createArticle(
    article: Omit<Article, "_id" | "commentsCount" | "createdAt">,
  ) {
    const res = await api.post<{ success: true; article: Article }>(
      "/coach/articles",
      article,
    );
    return res.data.article;
  },

  async updateArticle(
    id: string,
    article: Partial<Omit<Article, "_id" | "commentsCount" | "createdAt">>,
  ) {
    const res = await api.put<{ success: true; article: Article }>(
      `/coach/articles/${id}`,
      article,
    );
    return res.data.article;
  },

  async deleteArticle(id: string) {
    await api.delete(`/coach/articles/${id}`);
  },

  // --- مدیریت کامنت‌ها ---
  async getComments() {
    const res = await api.get<{ success: true; comments: Comment[] }>(
      "/coach/comments",
    );
    return res.data;
  },

  async replyToComment(commentId: string, content: string) {
    const res = await api.post<{ success: true; comment: Comment }>(
      "/coach/comments/reply",
      {
        parentId: commentId,
        content,
      },
    );
    return res.data;
  },

  async deleteComment(id: string) {
    await api.delete(`/coach/comments/${id}`);
  },

  async uploadImage(formData: FormData) {
    const res = await api.post<{ success: true; imageUrl: string }>(
      "/coach/upload-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data;
  },
};

export const getUserProgress = async () => {
  const res = await api.get<{ success: true; progress: UserProgress[] }>(
    "/coach/progress",
  );
  return res.data.progress;
};

export const getAllUsers = async () => {
  const res = await api.get<{ success: true; users: WorkoutUser[] }>(
    "/users?role=user",
  );
  return res.data.users;
};
