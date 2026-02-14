import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import { financialService, type Subscription } from '../../../services/financialService'
import { toast } from 'react-hot-toast'
import useDocumentTitle from '../../../hooks/useDocumentTitle'

export default function AdminSubscriptions() {
  useDocumentTitle('اشتراک‌ها')
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
      active: { label: 'فعال', color: 'bg-green-500/10 text-green-500' },
      expired: { label: 'منقضی', color: 'bg-destructive/10 text-destructive' },
      canceled: { label: 'لغو شده', color: 'bg-muted/50 text-muted-foreground' }
    }
    const { label, color } = config[status] || config.expired
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6">اشتراک‌ها</h1>
      <Card className='bg-card'>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">در حال بارگذاری...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="text-right text-sm text-muted-foreground border-b border-border">
                  <th className="py-3 px-2">کاربر</th>
                  <th className="py-3 px-2">طرح</th>
                  <th className="py-3 px-2">مبلغ</th>
                  <th className="py-3 px-2">شروع</th>
                  <th className="py-3 px-2">پایان</th>
                  <th className="py-3 px-2">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {subs.map(sub => (
                  <tr key={sub._id} className="border-b border-border hover:bg-muted">
                    <td className="py-3 px-2 text-foreground">{sub.user.name}</td>
                    <td className="py-3 px-2 text-foreground">{sub.plan}</td>
                    <td className="py-3 px-2 text-foreground">{sub.amount.toLocaleString()} تومان</td>
                    <td className="py-3 px-2 text-muted-foreground">{new Date(sub.startDate).toLocaleDateString('fa-IR')}</td>
                    <td className="py-3 px-2 text-muted-foreground">{new Date(sub.endDate).toLocaleDateString('fa-IR')}</td>
                    <td className="py-3 px-2">{getStatusBadge(sub.status)}</td>
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