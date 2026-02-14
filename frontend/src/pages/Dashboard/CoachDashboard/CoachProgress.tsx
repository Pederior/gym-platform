import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import { toast } from 'react-hot-toast'
import { getUserProgress, type UserProgress } from '../../../services/coachService'
import useDocumentTitle from '../../../hooks/useDocumentTitle';

export default function CoachProgress() {
  useDocumentTitle('پیشرفت کاربران')
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getUserProgress()
        setProgress(data)
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'خطا در بارگذاری پیشرفت')
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, [])

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      active: { label: 'فعال', color: 'bg-green-500/10 text-green-500' },
      completed: { label: 'تکمیل شده', color: 'bg-blue-500/10 text-blue-500' },
      paused: { label: 'مکث', color: 'bg-yellow-500/10 text-yellow-500' }
    }
    const { label, color } = config[status] || config.active
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6">پیگیری پیشرفت کاربران</h1>

      <Card>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">در حال بارگذاری...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="text-right text-sm text-muted-foreground border-b border-border">
                  <th className="py-3 px-2">کاربر</th>
                  <th className="py-3 px-2">برنامه</th>
                  <th className="py-3 px-2">پیشرفت</th>
                  <th className="py-3 px-2">آخرین فعالیت</th>
                  <th className="py-3 px-2">وضعیت</th>
                  <th className="py-3 px-2">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {progress.map(p => (
                  <tr key={p._id} className="border-b border-border hover:bg-muted">
                    <td className="py-3 px-2 text-foreground">{p.user.name}</td>
                    <td className="py-3 px-2 text-foreground">{p.workout}</td>
                    <td className="py-3 px-2">
                      <div className="w-24 sm:w-32 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${Math.min((p.completedDays / p.totalDays) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 block">
                        {p.completedDays}/{p.totalDays} روز
                      </span>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{new Date(p.lastActivity).toLocaleDateString('fa-IR')}</td>
                    <td className="py-3 px-2">{getStatusBadge(p.status)}</td>
                    <td className="py-3 px-2">
                      <button className="text-primary hover:text-primary/80">جزئیات</button>
                    </td>
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