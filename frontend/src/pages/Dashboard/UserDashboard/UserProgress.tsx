import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import { toast } from 'react-hot-toast'
import { userService, type UserProgress } from '../../../services/userService'


export default function UserProgress() {
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await userService.getUserProgresses()
        setProgress(data)
      } catch (err: any) {
        toast.error('خطا در بارگذاری پیشرفت')
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
      <h1 className="text-2xl font-bold mb-6">پیگیری پیشرفت</h1>

      <Card>
        {loading ? (
          <div className="py-8 text-center">در حال بارگذاری...</div>
        ) : progress.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            شما هنوز پیشرفتی ثبت نشده‌است
          </div>
        ) : (
          <div className="space-y-6">
            {progress.map(p => (
              <div key={p._id} className="border-b pb-6 last:border-0">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-bold">{p.workout}</h2>
                  {getStatusBadge(p.status)}
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>پیشرفت: {p.completedDays}/{p.totalDays} روز</span>
                    <span>{Math.round((p.completedDays / p.totalDays) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${(p.completedDays / p.totalDays) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  آخرین فعالیت: {new Date(p.lastActivity).toLocaleDateString('fa-IR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}