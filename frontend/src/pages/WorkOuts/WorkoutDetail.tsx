import { useParams } from 'react-router-dom'

export default function WorkoutDetail() {
  const { id } = useParams()

  // در عمل این داده از API باید بیاد
  const workout = {
    title: 'برنامه قدرتی ۸ هفته‌ای',
    description: 'این برنامه برای افزایش قدرت عضلانی و حجم طراحی شده است.',
    exercises: [
      { name: 'اسکات', sets: 4, reps: 8 },
      { name: 'ددلیفت', sets: 4, reps: 6 },
      { name: 'پرس سینه', sets: 4, reps: 10 },
    ],
    duration: 56,
    coach: 'علی رضایی'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{workout.title}</h1>
      <p className="text-gray-600 mb-6">طراحی‌شده توسط: {workout.coach}</p>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="font-bold mb-3">توضیحات</h2>
        <p>{workout.description}</p>
      </div>

      <div>
        <h2 className="font-bold text-lg mb-4">تمرینات</h2>
        <div className="space-y-3">
          {workout.exercises.map((ex, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium">{ex.name}</div>
              <div className="text-sm text-gray-600 mt-1">
                {ex.sets} ست — هر ست {ex.reps} تکرار
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        شروع این برنامه
      </button>
    </div>
  )
}