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
        setStudents(res.data.data || []);
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">شاگردهای من</h1>
      </div>

      {students.length === 0 ? (
        <div className="bg-card p-6 rounded-xl shadow border border-border text-center">
          <div className="text-6xl mb-4 text-muted-foreground">👥</div>
          <h3 className="font-bold text-foreground mb-2">شاگردی وجود ندارد</h3>
          <p className="text-muted-foreground">
            شما هنوز شاگردی ندارید. می‌توانید از داشبورد اصلی شاگرد انتخاب کنید.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div key={student._id} className="bg-card rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden border border-border">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.currentSubscription?.plan === 'gold' 
                      ? 'bg-accent/10 text-accent'
                      : student.currentSubscription?.plan === 'silver'
                      ? 'bg-muted-foreground/10 text-muted-foreground'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {student.currentSubscription?.plan === 'gold' ? 'طلایی' : 
                     student.currentSubscription?.plan === 'silver' ? 'نقره‌ای' : 'برنز'}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-foreground mb-2">برنامه‌های تمرینی:</h4>
                  {student.workoutPlans && student.workoutPlans.length > 0 ? (
                    <ul className="space-y-2">
                      {student.workoutPlans.map((plan) => (
                        <li key={plan._id} className="flex justify-between items-center bg-muted p-2 rounded">
                          <span className="text-sm text-foreground">{plan.title}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            plan.isActive ? 'bg-green-500/10 text-green-500' : 'bg-muted/50 text-muted-foreground'
                          }`}>
                            {plan.isActive ? 'فعال' : 'غیرفعال'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-sm">برنامه‌ای وجود ندارد</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCreateWorkout(student._id)}
                    className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    ایجاد برنامه
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/coach/chat`)}
                    className="flex-1 bg-accent hover:bg-accent/80 text-accent-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors"
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