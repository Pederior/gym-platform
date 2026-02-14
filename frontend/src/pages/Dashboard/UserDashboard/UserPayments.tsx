import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import { toast } from 'react-hot-toast'
import { FaShoppingCart, FaCreditCard, FaTag } from 'react-icons/fa'
import { userService, type Payment } from "../../../services/userService";
import useDocumentTitle from '../../../hooks/useDocumentTitle';

export default function UserPayments() {
  useDocumentTitle('تاریخچه پرداخت‌ها');
  
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentsData = await userService.getUserPayments();
        setPayments(paymentsData);
      } catch (err: any) {
        console.error('Fetch payments error:', err)
        toast.error('خطا در بارگذاری تاریخچه پرداخت‌ها')
      } finally {
        setLoading(false)
      }
    };
    fetchPayments();
  }, []);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      completed: { label: 'تکمیل شده', color: 'bg-green-500/10 text-green-500' },
      pending: { label: 'در انتظار', color: 'bg-yellow-500/10 text-yellow-500' },
      failed: { label: 'ناموفق', color: 'bg-destructive/10 text-destructive' },
      refunded: { label: 'بازگشت داده شد', color: 'bg-blue-500/10 text-blue-500' },
      active: { label: 'فعال', color: 'bg-green-500/10 text-green-500' },
      expired: { label: 'منقضی', color: 'bg-destructive/10 text-destructive' },
      canceled: { label: 'لغو شده', color: 'bg-muted/50 text-muted-foreground' }
    }
    const { label, color } = config[status] || config.completed
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <FaShoppingCart className="text-primary text-xl" />
      case 'subscription':
        return <FaCreditCard className="text-accent text-xl" />
      default:
        return <FaTag className="text-muted-foreground text-xl" />
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

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'تاریخ نامعتبر'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">تاریخچه پرداخت‌ها</h1>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {payments.filter(p => p.type === 'order').length} خرید
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
            {payments.filter(p => p.type === 'subscription').length} اشتراک
          </span>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">در حال بارگذاری...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCreditCard className="text-4xl text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">پرداختی ثبت نشده‌است</p>
            <p className="text-muted-foreground mt-2">شما هنوز هیچ پرداختی انجام نداده‌اید</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {payments.map(payment => (
              <div key={payment._id} className="py-4 hover:bg-muted transition">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Icon */}
                  <div className="shrink-0 mt-1">
                    {getTypeIcon(payment.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{getTypeLabel(payment.type)}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {payment.description || 'بدون توضیحات'}
                        </p>
                        
                        {/* نمایش جزئیات سفارش */}
                        {payment.type === 'order' && payment.details?.productCount && (
                          <p className="text-xs text-muted-foreground mt-1">
                            تعداد محصولات: {payment.details.productCount} | 
                            مبلغ کل: {(payment.details.totalAmount ?? payment.amount).toLocaleString()} تومان
                          </p>
                        )}
                        
                        {/* نمایش جزئیات اشتراک */}
                        {payment.type === 'subscription' && payment.details?.plan && (
                          <p className="text-xs text-muted-foreground mt-1">
                            پلن: {payment.details.plan === 'bronze' ? 'برنز' : 
                                  payment.details.plan === 'silver' ? 'نقره‌ای' : 'طلایی'} | 
                            مبلغ: {(payment.details.amount ?? payment.amount).toLocaleString()} تومان
                          </p>
                        )}
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-lg text-primary">
                          {payment.amount.toLocaleString()} تومان
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(payment.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 pt-3 border-t border-border gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(payment.status)}
                        {payment.transactionId && (
                          <span className="text-xs text-muted-foreground">
                            #{payment.transactionId.slice(0, 8)}
                          </span>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        payment.method === 'online' ? 'bg-primary/10 text-primary' :
                        payment.method === 'cash' ? 'bg-green-500/10 text-green-500' :
                        payment.method === 'wallet' ? 'bg-accent/10 text-accent' :
                        'bg-muted/50 text-muted-foreground'
                      }`}>
                        {payment.method === 'online' ? 'آنلاین' :
                         payment.method === 'cash' ? 'نقدی' :
                         payment.method === 'wallet' ? 'کیف پول' : 'سایر'}
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