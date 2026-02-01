import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import { toast } from 'react-hot-toast'
import { userService } from '../../../services/userService'

interface Exercise {
  name: string
  sets: number
  reps: number
  restTime: number
}

interface WorkoutDetail {
  _id: string
  title: string
  exercises: Exercise[]
}

export default function UserWorkoutSession() {
  const { workoutId } = useParams<{ workoutId: string }>()
  const [workout, setWorkout] = useState<WorkoutDetail | null>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        if (!workoutId) return
        const data = await userService.getWorkoutDetail(workoutId)
        setWorkout(data)
      } catch (err: any) {
        toast.error('خطا در بارگذاری تمرین')
      } finally {
        setLoading(false)
      }
    }
    fetchWorkout()
  }, [workoutId])

  const handleCompleteExercise = () => {
    setCompletedExercises(prev => [...prev, currentExerciseIndex])
  }

  const handleNext = () => {
    handleCompleteExercise()
    if (currentExerciseIndex < (workout?.exercises.length || 0) - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
    } else {
      // تمام تمرینات تموم شدن
      handleSubmitProgress()
    }
  }

  const handlePrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1)
    }
  }

  const handleSubmitProgress = async () => {
    try {
      if (!workoutId) return
      await userService.submitWorkoutProgress(workoutId)
      toast.success('پیشرفت شما ثبت شد!')
      navigate('/dashboard/user/workouts')
    } catch (err: any) {
      toast.error('خطا در ثبت پیشرفت')
    }
  }

  if (loading) {
    return <div className="p-8">در حال بارگذاری تمرین...</div>
  }

  if (!workout) {
    return <div className="p-8">تمرین یافت نشد</div>
  }

  const currentExercise = workout.exercises[currentExerciseIndex]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{workout.title}</h1>
      
      <Card>
        <div className="text-center mb-6">
          <div className="text-lg font-bold mb-2">{currentExercise.name}</div>
          <div className="text-gray-600">
            ست: {currentExercise.sets} | تکرار: {currentExercise.reps}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            استراحت: {currentExercise.restTime} ثانیه
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentExerciseIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50"
          >
            تمرین قبلی
          </button>
          
          {currentExerciseIndex === workout.exercises.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              پایان تمرین
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              تمرین بعدی
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>پیشرفت</span>
            <span>{Math.round(((currentExerciseIndex + 1) / workout.exercises.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-600 h-2 rounded-full" 
              style={{ width: `${((currentExerciseIndex + 1) / workout.exercises.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </Card>
    </div>
  )
}