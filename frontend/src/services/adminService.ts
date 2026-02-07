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
};
