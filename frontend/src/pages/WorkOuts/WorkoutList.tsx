import { useNavigate } from 'react-router-dom'

export default function WorkoutList() {
  const navigate = useNavigate()

  const workouts = [
    { id: '1', title: 'برنامه قدرتی ۸ هفته‌ای', duration: 56, coach: 'علی رضایی' },
    { id: '2', title: 'کاهش چربی + افزایش استقامت', duration: 42, coach: 'سارا محمدی' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">برنامه‌های تمرینی</h1>
        <button
          onClick={() => navigate('/workouts/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          ایجاد برنامه جدید
        </button>
      </div>

      <div className="space-y-4">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            onClick={() => navigate(`/workouts/${workout.id}`)}
            className="bg-white p-5 rounded-xl shadow hover:shadow-md cursor-pointer transition"
          >
            <h3 className="font-bold text-lg">{workout.title}</h3>
            <p className="text-gray-600 text-sm mt-1">
              {workout.duration} روزه — مربی: {workout.coach}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}