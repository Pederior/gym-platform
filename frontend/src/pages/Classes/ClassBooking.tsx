//! NOT USED
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/ui/Card'
import { toast } from 'react-hot-toast'
import api from '../../services/api'

interface Class {
  _id: string
  title: string
  coach: { name: string }
  dateTime: string
  capacity: number
  reservedBy: any[]
  price: number
}

export default function ClassBooking() {
  const { id } = useParams<{ id: string }>()
  const [classData, setClassData] = useState<Class | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClass = async () => {
      try {
        if (!id) return
        const res = await api.get(`/classes/${id}`)
        setClassData(res.data.class)
      } catch (err: any) {
        toast.error('خطا در بارگذاری کلاس')
      } finally {
        setLoading(false)
      }
    }
    fetchClass()
  }, [id])

  const handleBook = async () => {
    if (!id) return
    
    setSubmitting(true)
    try {
      await api.post(`/classes/${id}/reserve`)
      toast.success('کلاس با موفقیت رزرو شد!')
      navigate('/dashboard/user/classes')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در رزرو کلاس')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">در حال بارگذاری...</div>
  }

  if (!classData) {
    return <div className="container mx-auto px-4 py-8">کلاس یافت نشد</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">رزرو کلاس</h1>

      <Card className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">{classData.title}</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <p className="text-gray-600">مربی</p>
            <p className="font-medium">{classData.coach.name}</p>
          </div>
          
          <div>
            <p className="text-gray-600">تاریخ و ساعت</p>
            <p className="font-medium">{new Date(classData.dateTime).toLocaleDateString('fa-IR')}</p>
          </div>
          
          <div>
            <p className="text-gray-600">هزینه</p>
            <p className="font-medium">{classData.price.toLocaleString()} تومان</p>
          </div>
          
          <div>
            <p className="text-gray-600">ظرفیت</p>
            <p className="font-medium">{classData.reservedBy.length}/{classData.capacity}</p>
          </div>
        </div>

        <button
          onClick={handleBook}
          disabled={submitting || classData.reservedBy.length >= classData.capacity}
          className={`w-full py-3 px-4 rounded-lg font-medium ${
            classData.reservedBy.length >= classData.capacity
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {classData.reservedBy.length >= classData.capacity
            ? 'ظرفیت تکمیل شده'
            : submitting
            ? 'در حال رزرو...'
            : 'رزرو کلاس'}
        </button>
      </Card>
    </div>
  )
}