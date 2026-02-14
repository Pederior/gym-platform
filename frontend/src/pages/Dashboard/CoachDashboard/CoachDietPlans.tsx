import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import { toast } from 'react-hot-toast';

interface Diet {
  name: string;
  portion: string;
  calories: number;
}

interface DietPlan {
  _id: string;
  title: string;
  description: string;
  duration: number;
  diets: Diet[];
}

interface Student {
  _id: string;
  name: string;
  email: string;
  currentSubscription?: {
    plan: 'bronze' | 'silver' | 'gold';
    status: string;
  };
}

interface AssignedUser {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  completedDays: number;
  totalDays: number;
  assignedAt: string;
}

export default function CoachDietPlans() {
  useDocumentTitle('برنامه غذایی');

  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDietPlanId, setSelectedDietPlanId] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [modalLoading, setModalLoading] = useState(false);

  const [assignedUsers, setAssignedUsers] = useState<Record<string, AssignedUser[]>>({});
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchDietPlans = async () => {
    try {
      const res = await api.get('/diet-plans');
      
      const dietPlansData = Array.isArray(res.data) 
        ? res.data 
        : res.data?.data || [];
        
      setDietPlans(dietPlansData);
      
      if (Array.isArray(dietPlansData)) {
        const usersMap: Record<string, AssignedUser[]> = {};
        for (const plan of dietPlansData) {
          try {
            const usersRes = await api.get(`/diet-plans/${plan._id}/users`);
            usersMap[plan._id] = Array.isArray(usersRes.data.data) ? usersRes.data.data : [];
          } catch (err) {
            console.error(`Error fetching assigned users for plan ${plan._id}:`, err);
            usersMap[plan._id] = [];
          }
        }
        setAssignedUsers(usersMap);
      }
    } catch (err) {
      console.error('Error fetching diet plans:', err);
      toast.error('خطا در بارگذاری برنامه‌های غذایی');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;
    try {
      await api.delete(`/diet-plans/${id}`);
      fetchDietPlans();
      toast.success('برنامه غذایی با موفقیت حذف شد');
    } catch (err) {
      console.error('Error deleting diet plan:', err);
      toast.error('خطا در حذف برنامه غذایی');
    }
  };

  const openAssignModal = async (dietPlanId: string) => {
    setSelectedDietPlanId(dietPlanId);
    setModalLoading(true);
    setIsAssignModalOpen(true);
    
    try {
      const studentsRes = await api.get('/coach/students');
      const studentsData = Array.isArray(studentsRes.data.data) 
        ? studentsRes.data.data 
        : [];
      
      setStudents(studentsData);
    } catch (err) {
      console.error('Error fetching students:', err);
      toast.error('خطا در بارگذاری لیست شاگردها');
      setStudents([]);
    } finally {
      setModalLoading(false);
    }
  };

  const handleAssignDietPlan = async () => {
    if (!selectedDietPlanId || !selectedStudentId) {
      toast.error('لطفاً یک شاگرد را انتخاب کنید');
      return;
    }

    try {
      await api.post('/diet-plans/assign', {
        userId: selectedStudentId,
        dietPlanId: selectedDietPlanId
      });

      toast.success('برنامه غذایی با موفقیت به شاگرد اختصاص داده شد');
      
      try {
        const usersRes = await api.get(`/diet-plans/${selectedDietPlanId}/users`);
        setAssignedUsers(prev => ({
          ...prev,
          [selectedDietPlanId]: Array.isArray(usersRes.data.data) ? usersRes.data.data : []
        }));
        setExpandedPlan(selectedDietPlanId);
      } catch (err) {
        console.error('Error refreshing assigned users:', err);
      }
      
      setIsAssignModalOpen(false);
      setSelectedStudentId('');
      setSelectedDietPlanId(null);
    } catch (err: any) {
      console.error('Error assigning diet plan:', err);
      toast.error(err.response?.data?.message || 'خطا در اختصاص برنامه غذایی');
    }
  };

  const toggleAssignedUsers = (planId: string) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">برنامه‌های غذایی</h1>
        <Link
          to="/dashboard/coach/diet-plans/create"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80"
        >
          ایجاد برنامه جدید
        </Link>
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">در حال بارگذاری...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dietPlans.map(plan => (
            <div key={plan._id} className="border border-border rounded-lg p-4 bg-card shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-foreground mb-2">{plan.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{plan.description}</p>
              <p className="text-xs text-muted-foreground mb-3">
                مدت زمان: {plan.duration} روز
              </p>
              
              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">وعده‌ها:</h4>
                <ul className="space-y-1">
                  {plan.diets.map((diet, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      <strong>{diet.name}</strong> - {diet.portion}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 mb-3">
                <Link
                  to={`/dashboard/coach/diet-plans/edit/${plan._id}`}
                  className="text-primary hover:text-primary/80"
                >
                  ویرایش
                </Link>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="text-destructive hover:text-destructive/80"
                >
                  حذف
                </button>
                <button
                  onClick={() => openAssignModal(plan._id)}
                  className="text-accent hover:text-accent/80"
                >
                  اختصاص
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <button
                  onClick={() => toggleAssignedUsers(plan._id)}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  {expandedPlan === plan._id 
                    ? 'پنهان کردن کاربران' 
                    : `نمایش کاربران (${assignedUsers[plan._id]?.length || 0})`}
                </button>

                {expandedPlan === plan._id && (
                  <div className="mt-2 p-2 bg-muted rounded-lg max-h-40 overflow-y-auto">
                    {assignedUsers[plan._id]?.length > 0 ? (
                      <ul className="space-y-1">
                        {assignedUsers[plan._id].map(user => (
                          <li key={user._id} className="text-xs text-foreground">
                            • {user.user.name} 
                            {user.completedDays > 0 && (
                              <span className="text-accent ml-1">
                                ({user.completedDays}/{user.totalDays})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-muted-foreground">کاربری یافت نشد</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal اختصاص برنامه غذایی */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-foreground">اختصاص برنامه غذایی</h3>
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedStudentId('');
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            {modalLoading ? (
              <div className="py-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <div className="text-muted-foreground">در حال بارگذاری شاگردها...</div>
              </div>
            ) : (
              <>
                {students.length > 0 ? (
                  <>
                    <p className="text-muted-foreground text-sm mb-4">
                      لطفاً شاگردی را برای اختصاص برنامه غذایی انتخاب کنید:
                    </p>
                    
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg mb-4 focus:ring-2 focus:ring-primary bg-background text-foreground"
                    >
                      <option value="">شاگردی را انتخاب کنید</option>
                      {students.map(student => (
                        <option key={student._id} value={student._id}>
                          {student.name} ({student.email})
                        </option>
                      ))}
                    </select>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleAssignDietPlan}
                        disabled={!selectedStudentId}
                        className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        اختصاص برنامه
                      </button>
                      <button
                        onClick={() => {
                          setIsAssignModalOpen(false);
                          setSelectedStudentId('');
                        }}
                        className="flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80"
                      >
                        انصراف
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-2 text-muted-foreground">👥</div>
                    <p className="text-muted-foreground">شاگردی برای اختصاص وجود ندارد</p>
                    <button
                      onClick={() => {
                        setIsAssignModalOpen(false);
                        window.location.href = '/dashboard/coach';
                      }}
                      className="mt-4 text-primary hover:text-primary/80 text-sm"
                    >
                      بازگشت به داشبورد
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}