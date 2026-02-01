import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import { financialService, type Subscription } from '../../../services/financialService'
import { toast } from 'react-hot-toast'

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const data = await financialService.getSubscriptions()
        setSubs(data)
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'خطا در بارگذاری اشتراک‌ها')
      } finally {
        setLoading(false)
      }
    }
    fetchSubs()
  }, [])

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      active: { label: 'فعال', color: 'bg-green-100 text-green-800' },
      expired: { label: 'منقضی', color: 'bg-red-100 text-red-800' },
      canceled: { label: 'لغو شده', color: 'bg-gray-100 text-gray-800' }
    }
    const { label, color } = config[status] || config.expired
    return <span className={`px-2 py-1 rounded-full text-xs ${color}`}>{label}</span>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">اشتراک‌ها</h1>
      <Card>
        {loading ? (
          <div className="py-8 text-center">در حال بارگذاری...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-sm text-gray-500 border-b">
                  <th>کاربر</th>
                  <th>طرح</th>
                  <th>مبلغ</th>
                  <th>شروع</th>
                  <th>پایان</th>
                  <th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {subs.map(sub => (
                  <tr key={sub._id} className="border-b">
                    <td>{sub.user.name}</td>
                    <td>{sub.plan}</td>
                    <td>{sub.amount.toLocaleString()} تومان</td>
                    <td>{new Date(sub.startDate).toLocaleDateString('fa-IR')}</td>
                    <td>{new Date(sub.endDate).toLocaleDateString('fa-IR')}</td>
                    <td>{getStatusBadge(sub.status)}</td>
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