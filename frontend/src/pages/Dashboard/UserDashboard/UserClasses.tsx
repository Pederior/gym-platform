import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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

export default function ClassList() {
    useDocumentTitle('کلاس های من');
  
  const [userClasses, setUserClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserClasses = async () => {
      try {
        // API برای دریافت کلاس‌های کاربر
        const res = await api.get('/users/classes')
        setUserClasses(res.data.classes || [])
      } catch (err: any) {
        console.error('Error fetching user classes:', err)
        toast.error('خطا در بارگذاری کلاس‌های شما')
      } finally {
        setLoading(false)
      }
    }
    fetchUserClasses()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">کلاس‌های من</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">در حال بارگذاری...</div>
        ) : userClasses.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            شما هنوز در هیچ کلاسی عضو نشده‌اید
          </div>
        ) : (
          userClasses.map(cls => (
            <Card key={cls._id} className="p-6">
              <h2 className="text-xl font-bold mb-2">{cls.title}</h2>
              <p className="text-gray-600 mb-3">مربی: {cls.coach.name}</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {new Date(cls.dateTime).toLocaleDateString('fa-IR')}
                </span>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  {cls.price.toLocaleString()} تومان
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>ظرفیت</span>
                  <span>{cls.reservedBy.length}/{cls.capacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${(cls.reservedBy.length / cls.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          ))
        )}

        {/* کارت افزودن کلاس جدید */}
        <Link to="/classes" className="block">
          <Card className="p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-red-500 transition cursor-pointer">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl text-red-600">+</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">افزودن کلاس جدید</h3>
            <p className="text-sm text-gray-500 mt-1 text-center">
              برای عضویت در کلاس‌های جدید کلیک کنید
            </p>
          </Card>
        </Link>
      </div>
    </div>
  )
}