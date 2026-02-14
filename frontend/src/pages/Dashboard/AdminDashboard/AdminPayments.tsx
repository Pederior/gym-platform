import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import { financialService, type Payment } from '../../../services/financialService'
import { toast } from 'react-hot-toast'
import useDocumentTitle from '../../../hooks/useDocumentTitle'

export default function AdminPayments() {
  useDocumentTitle('پرداخت‌ها')
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await financialService.getPayments()
        setPayments(data)
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'خطا در بارگذاری پرداخت‌ها')
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      completed: { label: 'تکمیل شده', color: 'bg-green-500/10 text-green-500' },
      pending: { label: 'در انتظار', color: 'bg-yellow-500/10 text-yellow-500' },
      failed: { label: 'ناموفق', color: 'bg-destructive/10 text-destructive' }
    }
    const { label, color } = config[status] || config.completed
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6">پرداخت‌ها</h1>
      <Card>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">در حال بارگذاری...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="text-right text-sm text-muted-foreground border-b border-border">
                  <th className="py-3 px-2">کاربر</th>
                  <th className="py-3 px-2">مبلغ</th>
                  <th className="py-3 px-2">روش</th>
                  <th className="py-3 px-2">وضعیت</th>
                  <th className="py-3 px-2">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p._id} className="border-b border-border hover:bg-muted">
                    <td className="py-3 px-2 text-foreground">{p.user.name}</td>
                    <td className="py-3 px-2 text-foreground">{p.amount.toLocaleString()} تومان</td>
                    <td className="py-3 px-2 text-foreground">{p.method}</td>
                    <td className="py-3 px-2">{getStatusBadge(p.status)}</td>
                    <td className="py-3 px-2 text-muted-foreground">{new Date(p.createdAt).toLocaleDateString('fa-IR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}