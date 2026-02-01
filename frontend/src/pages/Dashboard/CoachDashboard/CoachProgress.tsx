import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import { toast } from 'react-hot-toast'
import { getUserProgress, type UserProgress } from '../../../services/coachService'

export default function CoachProgress() {
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
      active: { label: 'فعال', color: 'bg-green-100 text-green-800' },
      completed: { label: 'تکمیل شده', color: 'bg-blue-100 text-blue-800' },
      paused: { label: 'مکث', color: 'bg-yellow-100 text-yellow-800' }
    }
    const { label, color } = config[status] || config.active
    return <span className={`px-2 py-1 rounded-full text-xs ${color}`}>{label}</span>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">پیگیری پیشرفت کاربران</h1>

      <Card>
        {loading ? (
          <div className="py-8 text-center">در حال بارگذاری...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-sm text-gray-500 border-b">
                  <th>کاربر</th>
                  <th>برنامه</th>
                  <th>پیشرفت</th>
                  <th>آخرین فعالیت</th>
                  <th>وضعیت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {progress.map(p => (
                  <tr key={p._id} className="border-b">
                    <td>{p.user.name}</td>
                    <td>{p.workout}</td>
                    <td>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${(p.completedDays / p.totalDays) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 mt-1 block">
                        {p.completedDays}/{p.totalDays} روز
                      </span>
                    </td>
                    <td>{new Date(p.lastActivity).toLocaleDateString('fa-IR')}</td>
                    <td>{getStatusBadge(p.status)}</td>
                    <td>
                      <button className="text-blue-600">جزئیات</button>
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