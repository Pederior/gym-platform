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
      paid: { label: 'پرداخت شده', color: 'bg-green-100 text-green-800' },
      unpaid: { label: 'پرداخت نشده', color: 'bg-yellow-100 text-yellow-800' },
      overdue: { label: 'سررسید گذشته', color: 'bg-red-100 text-red-800' }
    }
    const { label, color } = config[status] || config.unpaid
    return <span className={`px-2 py-1 rounded-full text-xs ${color}`}>{label}</span>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">صورت‌حساب‌ها</h1>
      <Card>
        {loading ? (
          <div className="py-8 text-center">در حال بارگذاری...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-sm text-gray-500 border-b">
                  <th>کاربر</th>
                  <th>مبلغ کل</th>
                  <th>سررسید</th>
                  <th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv._id} className="border-b">
                    <td>{inv.user.name}</td>
                    <td>{inv.totalAmount.toLocaleString()} تومان</td>
                    <td>{new Date(inv.dueDate).toLocaleDateString('fa-IR')}</td>
                    <td>{getStatusBadge(inv.status)}</td>
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