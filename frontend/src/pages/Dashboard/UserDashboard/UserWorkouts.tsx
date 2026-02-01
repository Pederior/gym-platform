import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import { toast } from 'react-hot-toast'
import { userService, type UserWorkout } from '../../../services/userService'

export default function UserWorkouts() {
  const [workouts, setWorkouts] = useState<UserWorkout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await userService.getUserWorkouts()
        setWorkouts(data)
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'خطا در بارگذاری برنامه‌ها')
      } finally {
        setLoading(false)
      }
    }
    fetchWorkouts()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">برنامه‌های تمرینی من</h1>

      <Card>
        {loading ? (
          <div className="py-8 text-center">در حال بارگذاری...</div>
        ) : workouts.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            هنوز برنامه‌ای برای شما تعیین نشده است.
          </div>
        ) : (
          <div className="space-y-6">
            {workouts.map(workout => (
              <div key={workout._id} className="p-4 border rounded-lg">
                <div className="flex justify-between">
                  <h3 className="font-bold text-lg">{workout.title}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(workout.assignedAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{workout.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    مدت زمان: {workout.duration} روز
                  </span>
                  <Link
                    to={`/dashboard/user/workouts/${workout._id}/start`}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    شروع تمرین
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}