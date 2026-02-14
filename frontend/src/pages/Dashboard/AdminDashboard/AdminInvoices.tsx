import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import { financialService, type Invoice } from '../../../services/financialService'
import { toast } from 'react-hot-toast'
import useDocumentTitle from '../../../hooks/useDocumentTitle'

export default function AdminInvoices() {
  useDocumentTitle('صورت‌حساب‌ها')
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await financialService.getInvoices()
        setInvoices(data)
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'خطا در بارگذاری صورت‌حساب‌ها')
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [])

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      paid: { label: 'پرداخت شده', color: 'bg-green-500/10 text-green-500' },
      unpaid: { label: 'پرداخت نشده', color: 'bg-yellow-500/10 text-yellow-500' },
      overdue: { label: 'سررسید گذشته', color: 'bg-destructive/10 text-destructive' }
    }
    const { label, color } = config[status] || config.unpaid
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6">صورت‌حساب‌ها</h1>
      <Card>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">در حال بارگذاری...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="text-right text-sm text-muted-foreground border-b border-border">
                  <th className="py-3 px-2">کاربر</th>
                  <th className="py-3 px-2">مبلغ کل</th>
                  <th className="py-3 px-2">سررسید</th>
                  <th className="py-3 px-2">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv._id} className="border-b border-border hover:bg-muted">
                    <td className="py-3 px-2 text-foreground">{inv.user.name}</td>
                    <td className="py-3 px-2 text-foreground">{inv.totalAmount.toLocaleString()} تومان</td>
                    <td className="py-3 px-2 text-muted-foreground">{new Date(inv.dueDate).toLocaleDateString('fa-IR')}</td>
                    <td className="py-3 px-2">{getStatusBadge(inv.status)}</td>
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