import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import { userService } from '../../../services/userService'
import { toast } from 'react-hot-toast'
import { FaDumbbell, FaCheckCircle, FaPlay, FaHistory, FaCalendarCheck, FaShoppingCart } from 'react-icons/fa'

interface Workout {
  _id: string
  title: string
  description?: string
  duration?: number
  assignedAt: string
}

interface Progress {
  _id: string
  workout: string
  completedDays: number
  totalDays: number
  lastActivity: string
  status: 'active' | 'completed' | 'paused'
}

export default function UserWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [progresses, setProgresses] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchWorkoutsAndProgress = async () => {
    try {
      setLoading(true)
      const [workoutsRes, progressRes] = await Promise.all([
        userService.getUserWorkouts(),
        userService.getUserProgresses()
      ])
      setWorkouts(workoutsRes)
      setProgresses(progressRes)
    } catch (err: any) {
      console.error('Fetch error:', err)
      toast.error('خطا در بارگذاری تمرینات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkoutsAndProgress()
    
    const handleRefresh = () => fetchWorkoutsAndProgress()
    window.addEventListener('workoutProgressUpdated', handleRefresh)
    return () => window.removeEventListener('workoutProgressUpdated', handleRefresh)
  }, [])

  const getProgressForWorkout = (workoutId: string) => {
    return progresses.find(p => p.workout === workoutId) || null
  }

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: 'در حال انجام', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'کامل شده', color: 'bg-green-100 text-green-800' },
      paused: { label: 'مکث', color: 'bg-yellow-100 text-yellow-800' }
    }
    const { label, color } = config[status as keyof typeof config] || config.active
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">در حال بارگذاری تمرینات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">برنامه‌های تمرینی من</h1>
            <p className="text-gray-600 mt-2">پیشرفت خود را در هر برنامه تمرینی دنبال کنید</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {progresses.filter(p => p.status === 'completed').length} برنامه کامل شده
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {Math.round(progresses.reduce((sum, p) => sum + (p.completedDays / p.totalDays), 0)) || 0}% میانگین پیشرفت
            </span>
          </div>
        </div>

        {workouts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaDumbbell className="text-6xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">تمرینی برای نمایش وجود ندارد</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              هنوز برنامه تمرینی به شما اختصاص داده نشده است. با مربی خود تماس بگیرید یا از بخش فروشگاه یک برنامه تهیه کنید.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/store')}
                className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
              >
                <FaShoppingCart />
                خرید برنامه تمرینی
              </button>
              <button
                onClick={() => navigate('/dashboard/user/profile')}
                className="bg-white border-2 border-red-500 text-red-500 px-8 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
              >
                <FaHistory className="ml-2" />
                تماس با مربی
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {workouts.map((workout) => {
              const progress = getProgressForWorkout(workout._id)
              const percentage = progress 
                ? Math.min(100, Math.round((progress.completedDays / progress.totalDays) * 100))
                : 0
              
              // تعیین رنگ بر اساس وضعیت
              const getProgressColor = () => {
                if (!progress) return 'bg-gray-300'
                if (progress.status === 'completed') return 'bg-green-500'
                if (percentage > 75) return 'bg-green-400'
                if (percentage > 50) return 'bg-yellow-400'
                return 'bg-red-500'
              }

              return (
                <Card 
                  key={workout._id} 
                  className={`p-6 transition-all duration-300 ${
                    progress?.status === 'completed' 
                      ? 'border-green-300 bg-green-50 ring-1 ring-green-200' 
                      : 'hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                          <FaDumbbell className="text-red-600 text-2xl" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-500">
                            {workout.duration ? `${workout.duration} روزه` : 'برنامه سفارشی'}
                          </span>
                          {progress && (
                            <span className="text-xs text-gray-400">•</span>
                          )}
                          {progress && (
                            <span className="text-xs text-gray-500">
                              آخرین فعالیت: {new Date(progress.lastActivity).toLocaleDateString('fa-IR')}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{workout.title}</h3>
                        {workout.description && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2 max-w-md">
                            {workout.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {progress?.status === 'completed' && (
                      <div className="shrink-0 bg-green-100 text-green-800 p-2 rounded-full">
                        <FaCheckCircle className="text-xl" />
                      </div>
                    )}
                  </div>

                  {/* Progress Section - داخل کارت */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <FaCalendarCheck className="text-blue-500" />
                        <span className="font-bold text-gray-800">پیشرفت برنامه</span>
                      </div>
                      {progress && (
                        <span className="text-lg font-bold text-red-600">
                          {percentage}%
                        </span>
                      )}
                    </div>
                    
                    {progress ? (
                      <>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{progress.completedDays} روز از {progress.totalDays} روز کامل شد</span>
                          <span>{progress.totalDays - progress.completedDays} روز باقی مانده</span>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(progress.status)}
                            {progress.status === 'active' && (
                              <span className="text-xs text-green-600 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                در حال انجام
                              </span>
                            )}
                          </div>
                          {progress.status === 'completed' && (
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                              <FaCheckCircle />
                              برنامه با موفقیت به پایان رسید
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 mb-2">شروع تمرینات برای ثبت پیشرفت</p>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="h-3 rounded-full bg-gray-400" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      شروع برنامه: {new Date(workout.assignedAt).toLocaleDateString('fa-IR')}
                    </div>
                    <button
                      onClick={() => navigate(`/dashboard/user/workouts/${workout._id}/start`)}
                      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
                        progress?.status === 'completed'
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md'
                      }`}
                      disabled={progress?.status === 'completed'}
                    >
                      {progress?.status === 'completed' ? (
                        <>
                          <FaCheckCircle />
                          برنامه کامل شد
                        </>
                      ) : (
                        <>
                          <FaPlay />
                          {progress ? 'ادامه تمرین' : 'شروع تمرین'}
                        </>
                      )}
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}