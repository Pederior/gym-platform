import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import { toast } from 'react-hot-toast'
import api from '../../../services/api'
import useDocumentTitle from '../../../hooks/useDocumentTitle';

interface Class {
  _id: string
  title: string
  coach: { name: string }
  dateTime: string
  capacity: number
  reservedBy: any[]
  price: number
}

interface Coach {
  _id: string
  name: string
}

export default function AdminClasses() {
  useDocumentTitle('کلاس‌ها');
  const [classes, setClasses] = useState<Class[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    coach: '',
    dateTime: '',
    capacity: 10,
    price: 0
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/classes')
        setClasses(res.data.classes)
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'خطا در بارگذاری کلاس‌ها')
      } finally {
        setLoading(false)
      }
    }

    const fetchCoaches = async () => {
      try {
        const res = await api.get('/users?role=coach')
        setCoaches(res.data.users)
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'خطا در بارگذاری مربیان')
      }
    }

    fetchClasses()
    fetchCoaches()
  }, [])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'price' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/classes', formData)
      toast.success('کلاس جدید با موفقیت ایجاد شد')
      // رفرش لیست
      const res = await api.get('/classes')
      setClasses(res.data.classes)
      closeModal()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در ایجاد کلاس')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت کلاس‌ها</h1>
        <button
          onClick={openModal}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          ایجاد کلاس جدید
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="py-8 text-center">در حال بارگذاری...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-sm text-gray-500 border-b">
                  <th>عنوان</th>
                  <th>مربی</th>
                  <th>تاریخ و ساعت</th>
                  <th>ظرفیت</th>
                  <th>هزینه</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {classes.map(cls => (
                  <tr key={cls._id} className="border-b">
                    <td>{cls.title}</td>
                    <td>{cls.coach.name}</td>
                    <td>{new Date(cls.dateTime).toLocaleDateString('fa-IR')}</td>
                    <td>{cls.reservedBy.length}/{cls.capacity}</td>
                    <td>{cls.price.toLocaleString()} تومان</td>
                    <td>
                      <button className="text-blue-600 mr-3">ویرایش</button>
                      <button className="text-red-600">حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal ایجاد کلاس */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">ایجاد کلاس جدید</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان کلاس</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">مربی</label>
                <select
                  name="coach"
                  value={formData.coach}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">انتخاب مربی</option>
                  {coaches.map(coach => (
                    <option key={coach._id} value={coach._id}>{coach.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ و ساعت</label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ظرفیت</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">هزینه (تومان)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? 'در حال ایجاد...' : 'ایجاد کلاس'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}