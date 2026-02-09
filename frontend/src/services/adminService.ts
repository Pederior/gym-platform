import api from "./api";

export interface Settings {
  clubName: string;
  address: string;
  phone: string;
  email: string;
}

export interface Pricing {
  monthly: number;
  quarterly: number;
  yearly: number;
}

export interface Equipment {
  _id: string;
  name: string;
  type: string;
  status: "available" | "reserved" | "maintenance";
}

export interface Room {
  _id: string;
  name: string;
  capacity: number;
  status: "available" | "reserved" | "maintenance";
}

export interface AdminSubscriptionPlan {
  _id: string;
  id: "bronze" | "silver" | "gold";
  name: string;
  description: string;
  isPopular: boolean;
  isActive: boolean;
  features: string[];
  price: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  order: number;
}

export interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  category: 'nutrition' | 'workout' | 'lifestyle' | 'motivation' | 'health';
  status: 'draft' | 'published' | 'archived';
  author: { name: string; email: string };
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
  author: { name: string; email: string; role: string };
  parent?: { content: string; author: { name: string } };
  likes: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const adminService = {
  async getSettings() {
    const res = await api.get<{ success: true; data: Settings }>('/admin/settings');
    return res.data.data;
  },
  
  async updateSettings(settings: Settings) {
    const res = await api.put<{ success: true; data: Settings }>('/admin/settings', settings);
    return res.data.data;
  },

  async getPricing() {
    const res = await api.get<{ success: true; pricing: Pricing }>(
      "/admin/settings/pricing",
    );
    return res.data.pricing;
  },

  async updatePricing(pricing: Pricing) {
    const res = await api.put<{ success: true; pricing: Pricing }>(
      "/admin/settings/pricing",
      pricing,
    );
    return res.data.pricing;
  },

  async getEquipment() {
    const res = await api.get<{ success: true; equipment: Equipment[] }>(
      "/admin/equipment",
    );
    return res.data.equipment;
  },

  async createEquipment(equipment: { name: string; type: string }) {
    const res = await api.post<{ success: true; equipment: Equipment }>(
      "/admin/equipment",
      equipment,
    );
    return res.data.equipment;
  },

  async getRooms() {
    const res = await api.get<{ success: true; rooms: Room[] }>("/admin/rooms");
    return res.data.rooms;
  },

  async createRoom(room: { name: string; capacity: number }) {
    const res = await api.post<{ success: true; room: Room }>(
      "/admin/rooms",
      room,
    );
    return res.data.room;
  },
  async getSubscriptionPlans() {
    const res = await api.get<{
      success: true;
      plans: AdminSubscriptionPlan[];
    }>("/admin/subscriptions");
    return res.data.plans;
  },

  async upsertSubscriptionPlan(plan: Omit<AdminSubscriptionPlan, "_id">) {
    const res = await api.post<{ success: true; plan: AdminSubscriptionPlan }>(
      "/admin/subscriptions",
      plan,
    );
    return res.data.plan;
  },

  async deleteSubscriptionPlan(id: string) {
    await api.delete(`/admin/subscriptions/${id}`);
  },

   async getArticles(filters: { status?: string; category?: string; search?: string; page?: number; limit?: number } = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const res = await api.get<{ success: true; articles: Article[]; pagination: any }>(
      `/admin/articles${params.toString() ? '?' + params.toString() : ''}`
    );
    return res.data;
  },

  async getArticle(id: string) {
    const res = await api.get<{ success: true; article: Article }>(`/admin/articles/${id}`);
    return res.data.article;
  },

  async createArticle(article: Omit<Article, '_id' | 'author' | 'commentsCount' | 'createdAt'>) {
    const res = await api.post<{ success: true; article: Article }>('/admin/articles', article);
    return res.data.article;
  },

  async updateArticle(id: string, article: Partial<Omit<Article, '_id' | 'author' | 'commentsCount' | 'createdAt'>>) {
    const res = await api.put<{ success: true; article: Article }>(`/admin/articles/${id}`, article);
    return res.data.article;
  },

  async deleteArticle(id: string) {
    await api.delete(`/admin/articles/${id}`);
  },

  // --- مدیریت کامنت‌ها ---
 async getComments() {
    const res = await api.get<{ success: true; comments: Comment[] }>(`/admin/comments`);
    return res.data;
  },

  async replyToComment(commentId: string, content: string) {
    const res = await api.post<{ success: true; comment: Comment }>(`/admin/comments/reply`, {
      parentId: commentId,
      content
    });
    return res.data.comment;
  },

  async deleteComment(id: string) {
    await api.delete(`/admin/comments/${id}`);
  },

  async approveComment(id: string) {
    await api.put(`/admin/comments/${id}/status`, { status: 'approved' });
  },

  async rejectComment(id: string) {
    await api.put(`/admin/comments/${id}/status`, { status: 'rejected' });
  },

  async uploadImage(formData: FormData) {
    const res = await api.post<{ success: true; imageUrl: string }>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },
};
