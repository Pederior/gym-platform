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

// ✅ اضافه کردن interface جدید
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
  
  // Modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDietPlanId, setSelectedDietPlanId] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [modalLoading, setModalLoading] = useState(false);

  // ✅ اضافه کردن state برای لیست کاربران اختصاص داده شده
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
      
      // ✅ دریافت لیست کاربران اختصاص داده شده برای هر برنامه
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

  // باز کردن modal اختصاص
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

  // اختصاص برنامه به کاربر
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
        setExpandedPlan(selectedDietPlanId); // نمایش لیست بعد از اختصاص
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

  // تغییر وضعیت نمایش لیست کاربران
  const toggleAssignedUsers = (planId: string) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">برنامه‌های غذایی</h1>
        <Link
          to="/dashboard/coach/diet-plans/create"
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          ایجاد برنامه جدید
        </Link>
      </div>

      {loading ? (
        <div className="py-8 text-center">در حال بارگذاری...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dietPlans.map(plan => (
            <div key={plan._id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg mb-2">{plan.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{plan.description}</p>
              <p className="text-xs text-gray-500 mb-3">
                مدت زمان: {plan.duration} روز
              </p>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">وعده‌ها:</h4>
                <ul className="space-y-1">
                  {plan.diets.map((diet, index) => (
                    <li key={index} className="text-sm">
                      <strong>{diet.name}</strong> - {diet.portion}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 mb-3">
                <Link
                  to={`/dashboard/coach/diet-plans/edit/${plan._id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ویرایش
                </Link>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  حذف
                </button>
                <button
                  onClick={() => openAssignModal(plan._id)}
                  className="text-green-600 hover:text-green-800"
                >
                  اختصاص
                </button>
              </div>

              {/* ✅ نمایش لیست کاربران اختصاص داده شده */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => toggleAssignedUsers(plan._id)}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  {expandedPlan === plan._id 
                    ? 'پنهان کردن کاربران' 
                    : `نمایش کاربران (${assignedUsers[plan._id]?.length || 0})`}
                </button>

                {expandedPlan === plan._id && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                    {assignedUsers[plan._id]?.length > 0 ? (
                      <ul className="space-y-1">
                        {assignedUsers[plan._id].map(user => (
                          <li key={user._id} className="text-xs text-gray-700">
                            • {user.user.name} 
                            {user.completedDays > 0 && (
                              <span className="text-green-600 ml-1">
                                ({user.completedDays}/{user.totalDays})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-500">کاربری یافت نشد</p>
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
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">اختصاص برنامه غذایی</h3>
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedStudentId('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {modalLoading ? (
              <div className="py-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
                در حال بارگذاری شاگردها...
              </div>
            ) : (
              <>
                {students.length > 0 ? (
                  <>
                    <p className="text-gray-600 text-sm mb-4">
                      لطفاً شاگردی را برای اختصاص برنامه غذایی انتخاب کنید:
                    </p>
                    
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">شاگردی را انتخاب کنید</option>
                      {students.map(student => (
                        <option key={student._id} value={student._id}>
                          {student.name} ({student.email})
                        </option>
                      ))}
                    </select>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handleAssignDietPlan}
                        disabled={!selectedStudentId}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        اختصاص برنامه
                      </button>
                      <button
                        onClick={() => {
                          setIsAssignModalOpen(false);
                          setSelectedStudentId('');
                        }}
                        className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                      >
                        انصراف
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-2">👥</div>
                    <p className="text-gray-600">شاگردی برای اختصاص وجود ندارد</p>
                    <button
                      onClick={() => {
                        setIsAssignModalOpen(false);
                        window.location.href = '/dashboard/coach';
                      }}
                      className="mt-4 text-red-600 hover:text-red-800 text-sm"
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