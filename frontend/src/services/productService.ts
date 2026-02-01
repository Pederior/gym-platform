// services/productService.ts

import api from './api';

export const productService = {
  // Get all products with filters
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
    sortBy?: string;
  }) {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  // Get single product
  async getById(id: string) {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  },

  // Create product
  async create(data: FormData) {
    const response = await api.post('/admin/products', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update product
  async update(id: string, data: FormData) {
    const response = await api.put(`/admin/products/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete product
  async delete(id: string) {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  // Toggle status
  async toggleStatus(id: string, status: string) {
    const response = await api.patch(`/admin/products/${id}/status`, { status });
    return response.data;
  },
};