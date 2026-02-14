export type UserRole = 'admin' | 'coach' | 'user'
export type ProductType = 'supplement' | 'clothing' | 'accessory' | 'digital';
export type PlanType = 'bronze' | 'silver' | 'gold';
export type ProductStatus = 'active' | 'inactive' | 'draft';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'coach' | 'admin';
  subscription?: {
    plan: 'bronze' | 'silver' | 'gold';
    expiresAt: string;
    status: 'active' | 'expired';
  };
  createdAt: string;
  avatar?: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface Class {
  _id: string
  title: string
  description: string
  coach: {
    _id: string
    name: string
  }
  dateTime: string
  price: number
  capacity: number
  reservedBy: Array<{ user: string; reservedAt: string }>
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string


}

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  type: ProductType;
  category: string;
  description: string;
  image?: string;
  compatiblePlans?: PlanType[];
  bundles?: string[];
  status?: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  type: ProductType;
  category: string;
  description: string;
  image?: File | string;
  compatiblePlans?: PlanType[];
  bundles?: string[];
  status?: ProductStatus;
}