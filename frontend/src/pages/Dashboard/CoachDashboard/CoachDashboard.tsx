export default function CoachDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">داشبورد مربی</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-600 text-sm font-medium">کاربران زیر نظر</h3>
          <p className="text-2xl font-bold mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-600 text-sm font-medium">برنامه‌های ایجاد شده</h3>
          <p className="text-2xl font-bold mt-2">8</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-600 text-sm font-medium">کلاس‌های فعال</h3>
          <p className="text-2xl font-bold mt-2">4</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">برنامه‌های تمرینی</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            ایجاد برنامه جدید
          </button>
        </div>
        <p className="text-gray-600">شما می‌توانید برنامه‌های جدید برای کاربران طراحی کنید.</p>
      </div>
    </div>
  )
}