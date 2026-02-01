import api from "./api";
import { type User } from "../types";

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export const authService = {
  async register(name: string, email: string, password: string) {
    const res = await api.post<AuthResponse>("/auth/register", {
      name,
      email,
      password,
    });
    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  },

  async login(email: string, password: string) {
    const res = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  },
  async getProfile() {
    const res = await api.get("/users/profile");
    return res.data.user;
  },

  logout() {
    localStorage.removeItem("token");
  },
};
