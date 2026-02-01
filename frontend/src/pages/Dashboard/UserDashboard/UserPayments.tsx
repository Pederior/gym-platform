import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import { toast } from 'react-hot-toast'
import { FaShoppingCart, FaCreditCard, FaTag } from 'react-icons/fa'
import { userService } from "../../../services/userService";

interface Payment {
  _id: string
  amount: number
  type: 'subscription' | 'order' | 'other'
  method: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  description: string
  details?: {
    orderId?: string
    productCount?: number
    totalAmount?: number
    orderStatus?: string
    subscriptionId?: string
    plan?: string
    amount?: number
    status?: string
  }
  transactionId?: string
  createdAt: string
}

export default function UserPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const fetchPayments = async () => {
    try {
      // ✅ استفاده از سرویس
      const payments = await userService.getUserPayments();
      setPayments(payments);
    } catch (err: any) {
      toast.error('خطا در بارگذاری تاریخچه پرداخت‌ها');
    } finally {
      setLoading(false);
    }
  };
  fetchPayments();
}, []);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string; icon?: string }> = {
      completed: { label: 'تکمیل شده', color: 'bg-green-100 text-green-800' },
      pending: { label: 'در انتظار', color: 'bg-yellow-100 text-yellow-800' },
      failed: { label: 'ناموفق', color: 'bg-red-100 text-red-800' },
      refunded: { label: 'بازگشت داده شد', color: 'bg-blue-100 text-blue-800' },
      active: { label: 'فعال', color: 'bg-green-100 text-green-800' },
      expired: { label: 'منقضی', color: 'bg-red-100 text-red-800' },
      canceled: { label: 'لغو شده', color: 'bg-gray-100 text-gray-800' }
    }
    const { label, color } = config[status] || config.completed
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <FaShoppingCart className="text-blue-500 text-xl" />
      case 'subscription':
        return <FaCreditCard className="text-purple-500 text-xl" />
      default:
        return <FaTag className="text-gray-500 text-xl" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'order':
        return 'خرید از فروشگاه'
      case 'subscription':
        return 'اشتراک'
      default:
        return 'سایر'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">تاریخچه پرداخت‌ها</h1>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
            {payments.filter(p => p.type === 'order').length} خرید
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800`}>
            {payments.filter(p => p.type === 'subscription').length} اشتراک
          </span>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCreditCard className="text-4xl text-gray-400" />
            </div>
            <p className="text-gray-500">پرداختی ثبت نشده‌است</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {payments.map(payment => (
              <div key={payment._id} className="py-4 hover:bg-gray-50 transition">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="shrink-0 mt-1">
                    {getTypeIcon(payment.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{getTypeLabel(payment.type)}</h3>
                        <p className="text-sm text-gray-600 mt-1">{payment.description}</p>
                        {payment.details && payment.type === 'order' && (
                          <p className="text-xs text-gray-500 mt-1">
                            تعداد محصولات: {payment.details.productCount} | 
                            مبلغ کل: {payment.details.totalAmount?.toLocaleString()} تومان
                          </p>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg text-red-500">
                          {payment.amount.toLocaleString()} تومان
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(payment.createdAt).toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(payment.status)}
                        {payment.transactionId && (
                          <span className="text-xs text-gray-400">
                            #{payment.transactionId.slice(0, 8)}
                          </span>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        payment.method === 'online' ? 'bg-blue-100 text-blue-800' :
                        payment.method === 'cash' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.method === 'online' ? 'آنلاین' :
                         payment.method === 'cash' ? 'نقدی' : 'کیف پول'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}