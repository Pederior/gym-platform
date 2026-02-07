import api from './api'

// Types
export interface Subscription {
  _id: string
  user: { name: string }
  plan: string
  amount: number
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'canceled'
}

export interface Invoice {
  _id: string
  user: { name: string }
  totalAmount: number
  status: 'paid' | 'unpaid' | 'overdue'
  dueDate: string
}

export interface Payment {
  _id: string
  user: { name: string }
  amount: number
  method: string
  status: 'completed' | 'pending' | 'failed'
  createdAt: string
}

export interface FinancialReport {
  monthlyRevenue: number
  activeSubscriptions: number
  totalUsers: number
  paymentSuccessRate: number
}

// Service
export const financialService = {
  async getSubscriptions() {
    const res = await api.get<{ success: true; subscriptions: Subscription[] }>('/financial/subscriptions')
    return res.data.subscriptions
  },

  async getInvoices() {
    const res = await api.get<{ success: true; invoices: Invoice[] }>('/financial/invoices')
    return res.data.invoices
  },

  async getPayments() {
    const res = await api.get<{ success: true; payments: Payment[] }>('/financial/payments')
    return res.data.payments
  },

  async getFinancialReport() {
    const res = await api.get<{ success: true; report: FinancialReport }>('/financial/reports/financial')
    return res.data.report
  }
}