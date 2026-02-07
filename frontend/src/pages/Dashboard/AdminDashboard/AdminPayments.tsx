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
      completed: { label: 'تکمیل شده', color: 'bg-green-100 text-green-800' },
      pending: { label: 'در انتظار', color: 'bg-yellow-100 text-yellow-800' },
      failed: { label: 'ناموفق', color: 'bg-red-100 text-red-800' }
    }
    const { label, color } = config[status] || config.completed
    return <span className={`px-2 py-1 rounded-full text-xs ${color}`}>{label}</span>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">پرداخت‌ها</h1>
      <Card>
        {loading ? (
          <div className="py-8 text-center">در حال بارگذاری...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-sm text-gray-500">
                  <th className=' px-2'>کاربر</th>
                  <th className=' px-2'>مبلغ</th>
                  <th className=' px-2'>روش</th>
                  <th className=' px-3'>وضعیت</th>
                  <th className=' px-2'>تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p._id} className="border-b py-2">
                    <td className='py-3 px-2'>{p.user.name}</td>
                    <td className='py-3 px-2'>{p.amount.toLocaleString()} تومان</td>
                    <td className='py-3 px-2'>{p.method}</td>
                    <td className='py-3 px-2'>{getStatusBadge(p.status)}</td>
                    <td className='py-3 px-2'>{new Date(p.createdAt).toLocaleDateString('fa-IR')}</td>
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