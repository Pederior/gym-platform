import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import { toast } from 'react-hot-toast'
import { coachService, type Exercise } from '../../../services/coachService'
import useDocumentTitle from '../../../hooks/useDocumentTitle';

export default function CoachWorkoutsEdit() {
  const { id } = useParams<{ id: string }>()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 56
  })
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: 4, reps: 8, restTime: 90 }
  ])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useDocumentTitle(`ویرایش برنامه ${formData.title}`)
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        if (!id) return
        const workouts = await coachService.getWorkouts()
        const workout = workouts.find(w => w._id === id)
        if (workout) {
          setFormData({
            title: workout.title,
            description: workout.description || '',
            duration: workout.duration
          })
          setExercises(workout.exercises || [{ name: '', sets: 4, reps: 8, restTime: 90 }])
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'خطا در بارگذاری برنامه')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkout()
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'duration' ? parseInt(value) || 0 : value }))
  }

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    const newExercises = [...exercises]
    newExercises[index] = { ...newExercises[index], [field]: value }
    setExercises(newExercises)
  }

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 4, reps: 8, restTime: 90 }])
  }

  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    setSubmitting(true)
    try {
      await coachService.updateWorkout(id, { ...formData, exercises })
      toast.success('برنامه تمرینی با موفقیت به‌روز شد')
      navigate('/dashboard/coach/workouts')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در به‌روزرسانی')
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-8">در حال بارگذاری...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ویرایش برنامه تمرینی</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان برنامه</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مدت زمان (روز)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">تمرینات</label>
              <button
                type="button"
                onClick={addExercise}
                className="text-sm text-red-600 hover:text-red-800"
              >
                + افزودن تمرین
              </button>
            </div>
            
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">نام تمرین</label>
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm"
                          placeholder="اسکات"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">ست</label>
                        <input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border rounded text-sm"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">تکرار</label>
                        <input
                          type="number"
                          value={exercise.reps}
                          onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border rounded text-sm"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">استراحت (ثانیه)</label>
                        <input
                          type="number"
                          value={exercise.restTime}
                          onChange={(e) => handleExerciseChange(index, 'restTime', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border rounded text-sm"
                          min="0"
                        />
                      </div>
                    </div>
                    {exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="text-red-500 ml-2 mt-6"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {submitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/coach/workouts')}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              انصراف
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}