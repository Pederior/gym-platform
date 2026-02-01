import { useAppSelector } from '../../../store/hook'

export default function UserDashboard() {
  const { user, token } = useAppSelector((state) => state.auth)
  
  console.log('User from Redux:', user)
  console.log('Token:', token)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">داشبورد کاربر — خوش آمدید، {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-600 text-sm font-medium">کلاس‌های رزرو شده</h3>
          <p className="text-2xl font-bold mt-2">3</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-600 text-sm font-medium">تمرین‌های انجام‌شده امروز</h3>
          <p className="text-2xl font-bold mt-2">5</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-600 text-sm font-medium">پیشرفت هفتگی</h3>
          <p className="text-2xl font-bold mt-2">82%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold text-lg mb-4">برنامه تمرینی فعلی</h2>
        <p className="text-gray-700">برنامه "تناسب اندام پیشرفته — هفته 3"</p>
        <button className="mt-3 text-blue-600 hover:underline text-sm">مشاهده جزئیات</button>
      </div>
    </div>
  )
}