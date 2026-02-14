import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import { toast } from 'react-hot-toast'
import { coachService, type Exercise } from '../../../services/coachService'
import useDocumentTitle from '../../../hooks/useDocumentTitle';

export default function CoachWorkoutsCreate() {
  useDocumentTitle('ایجاد برنامه تمرینی جدید')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 56
  })
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: 4, reps: 8, restTime: 90 }
  ])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
    setLoading(true)
    
    try {
      await coachService.createWorkout({ ...formData, exercises })
      toast.success('برنامه تمرینی با موفقیت ایجاد شد')
      navigate('/dashboard/coach/workouts')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در ایجاد برنامه')
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6">ایجاد برنامه تمرینی جدید</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">عنوان برنامه</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">توضیحات</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">مدت زمان (روز)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
              <label className="block text-sm font-medium text-foreground">تمرینات</label>
              <button
                type="button"
                onClick={addExercise}
                className="text-sm text-primary hover:text-primary/80"
              >
                + افزودن تمرین
              </button>
            </div>
            
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={index} className="p-4 border border-border rounded-lg bg-muted">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">نام تمرین</label>
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                          className="w-full px-2 py-1 border border-border rounded text-sm bg-background text-foreground"
                          placeholder="اسکات"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">ست</label>
                        <input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-border rounded text-sm bg-background text-foreground"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">تکرار</label>
                        <input
                          type="number"
                          value={exercise.reps}
                          onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-border rounded text-sm bg-background text-foreground"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">استراحت (ثانیه)</label>
                        <input
                          type="number"
                          value={exercise.restTime}
                          onChange={(e) => handleExerciseChange(index, 'restTime', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-border rounded text-sm bg-background text-foreground"
                          min="0"
                        />
                      </div>
                    </div>
                    {exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="text-destructive ml-2 mt-6"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80 disabled:opacity-50"
            >
              {loading ? 'در حال ایجاد...' : 'ایجاد برنامه'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/coach/workouts')}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80"
            >
              انصراف
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}