import { useEffect, useState } from 'react';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';

interface WorkoutPlan {
  _id: string;
  title: string;
  duration: number;
  isActive: boolean;
}

interface Subscription {
  plan: 'bronze' | 'silver' | 'gold';
  status: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  currentSubscription?: Subscription;
  workoutPlans?: WorkoutPlan[];
}

export default function CoachStudents() {
  useDocumentTitle('شاگردهای من');
  const navigate = useNavigate();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchStudents = async () => {
    try {
      const res = await api.get('/coach/students');
      
      setStudents(res.data.studentsWithWorkouts || []);
      console.log(res.data.studentsWithWorkouts)
    } catch (error) {
      console.error('Failed to fetch students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  fetchStudents();
}, []);

  const handleCreateWorkout = (studentId: string) => {
    navigate(`/dashboard/coach/workouts/create?studentId=${studentId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">شاگردهای من</h1>
      </div>

      {students.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="font-bold text-gray-800 mb-2">شاگردی وجود ندارد</h3>
          <p className="text-gray-600">
            شما هنوز شاگردی ندارید. می‌توانید از داشبورد اصلی شاگرد انتخاب کنید.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div key={student._id} className="bg-white rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{student.name}</h3>
                    <p className="text-gray-600 text-sm">{student.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.currentSubscription?.plan === 'gold' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : student.currentSubscription?.plan === 'silver'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {student.currentSubscription?.plan === 'gold' ? 'طلایی' : 
                     student.currentSubscription?.plan === 'silver' ? 'نقره‌ای' : 'برنز'}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">برنامه‌های تمرینی:</h4>
                  {student.workoutPlans && student.workoutPlans.length > 0 ? (
                    <ul className="space-y-2">
                      {student.workoutPlans.map((plan) => (
                        <li key={plan._id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <span className="text-sm">{plan.title}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            plan.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {plan.isActive ? 'فعال' : 'غیرفعال'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">برنامه‌ای وجود ندارد</p>
                  )}
                </div>

                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => handleCreateWorkout(student._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    ایجاد برنامه
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/coach/chat/${student._id}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    چت
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}