import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import { toast } from 'react-hot-toast'
import api from '../../../services/api'
import useDocumentTitle from '../../../hooks/useDocumentTitle';

export default function CoachClassesEdit() {
  const { id } = useParams<{ id: string }>()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateTime: '',
    capacity: 10,
    price: 0
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useDocumentTitle(`ویرایش کلاس ${formData.title}`)
  useEffect(() => {
    const fetchClass = async () => {
      try {
        if (!id) return
        const res = await api.get(`/classes/${id}`)
        const classData = res.data.class
        
        // تبدیل تاریخ به فرمت datetime-local
        const dateTimeLocal = new Date(classData.dateTime).toISOString().slice(0, 16)
        
        setFormData({
          title: classData.title,
          description: classData.description || '',
          dateTime: dateTimeLocal,
          capacity: classData.capacity,
          price: classData.price
        })
      } catch (err: any) {
        toast.error('خطا در بارگذاری کلاس')
      } finally {
        setLoading(false)
      }
    }

    fetchClass()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'price' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    setSubmitting(true)
    try {
      await api.put(`/classes/${id}`, formData)
      toast.success('کلاس با موفقیت به‌روز شد')
      navigate('/dashboard/coach/classes')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در به‌روزرسانی کلاس')
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-4 sm:p-8 text-center text-muted-foreground">در حال بارگذاری...</div>
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6">ویرایش کلاس</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">عنوان کلاس</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">توضیحات</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">تاریخ و ساعت</label>
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">ظرفیت</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">هزینه (تومان)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80 disabled:opacity-50"
            >
              {submitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/coach/classes')}
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