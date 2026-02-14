import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/ui/Card";
import { toast } from "react-hot-toast";
import {
  coachService,
  type WorkoutPlan,
  type WorkoutUser,
  getAllUsers
} from "../../../services/coachService";
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import api from "../../../services/api";

export default function CoachWorkouts() {
  useDocumentTitle('برنامه‌ تمرینی');
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const [usersMap, setUsersMap] = useState<Record<string, WorkoutUser[]>>({});
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<WorkoutUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [modalLoading, setModalLoading] = useState(false);

  // Modal جزئیات تمرین
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await coachService.getWorkouts();
        setWorkouts(data);
      } catch (err: any) {
        toast.error("خطا در بارگذاری برنامه‌ها");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  const toggleUsers = async (workoutId: string) => {
    if (expandedWorkout === workoutId) {
      setExpandedWorkout(null);
      return;
    }

    if (!usersMap[workoutId]) {
      try {
        const users = await coachService.getWorkoutUsers(workoutId);
        setUsersMap((prev) => ({ ...prev, [workoutId]: users }));
      } catch (err: any) {
        toast.error("خطا در بارگذاری لیست کاربران");
        return;
      }
    }
    setExpandedWorkout(workoutId);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواید این برنامه را حذف کنید؟")) return;
    try {
      await coachService.deleteWorkout(id);
      setWorkouts(workouts.filter((w) => w._id !== id));
      toast.success("برنامه با موفقیت حذف شد");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در حذف برنامه");
    }
  };

  // باز کردن modal اختصاص
  const openAssignModal = async (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
    setModalLoading(true);
    
    try {
      const studentsRes = await api.get('/coach/students');
      const studentsData = Array.isArray(studentsRes.data.data) 
        ? studentsRes.data.data 
        : [];
      setAllUsers(studentsData);
      setIsModalOpen(true);
    } catch (err: any) {
      console.error('Error loading users:', err)
      toast.error("خطا در بارگذاری لیست کاربران");
    } finally {
      setModalLoading(false);
    }
  };

  // اختصاص برنامه به کاربر
  const handleAssignWorkout = async () => {
    if (!selectedWorkoutId || !selectedUserId) return;
    
    try {
      await coachService.assignWorkoutToUser({
        userId: selectedUserId,
        workoutId: selectedWorkoutId
      });
      
      toast.success("برنامه تمرینی با موفقیت به کاربر اختصاص داده شد");
      setIsModalOpen(false);
      setSelectedUserId("");
      
      const users = await coachService.getWorkoutUsers(selectedWorkoutId);
      setUsersMap(prev => ({ ...prev, [selectedWorkoutId]: users }));
    } catch (err: any) {
      console.error('Error assigning workout:', err)
      toast.error(err.response?.data?.message || "خطا در اختصاص برنامه");
    }
  };

  // باز کردن modal جزئیات
  const openDetailModal = (workout: WorkoutPlan) => {
    setSelectedWorkout(workout);
    setDetailModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">برنامه‌های تمرینی</h1>
        <Link
          to="/dashboard/coach/workouts/create"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80"
        >
          ایجاد برنامه جدید
        </Link>
      </div>

      <Card>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">در حال بارگذاری...</div>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div key={workout._id} className="border border-border rounded-lg p-4 bg-card">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{workout.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {workout.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      مدت زمان: {workout.duration} روز • ایجاد شده:{" "}
                      {new Date(workout.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => openAssignModal(workout._id)}
                      className="text-accent hover:text-accent/80 cursor-pointer text-sm"
                    >
                      اختصاص به کاربر
                    </button>
                    <button
                      onClick={() => openDetailModal(workout)}
                      className="text-primary hover:text-primary/80 cursor-pointer text-sm"
                    >
                      جزئیات تمرین
                    </button>
                    <Link
                      to={`/dashboard/coach/workouts/edit/${workout._id}`}
                      className="text-primary hover:text-primary/80 text-sm"
                    >
                      ویرایش
                    </Link>
                    <button
                      onClick={() => handleDelete(workout._id)}
                      className="text-destructive hover:text-destructive/80 cursor-pointer text-sm"
                    >
                      حذف
                    </button>
                  </div>
                </div>

                {/* دکمه نمایش کاربران */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleUsers(workout._id)}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    {expandedWorkout === workout._id
                      ? "پنهان کردن کاربران"
                      : "نمایش کاربران"}
                  </button>

                  {expandedWorkout === workout._id && (
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">
                        کاربران دارنده این برنامه:
                      </h4>
                      {usersMap[workout._id]?.length > 0 ? (
                        <ul className="space-y-1">
                          {usersMap[workout._id].map((user) => (
                            <li
                              key={user._id}
                              className="text-sm text-foreground"
                            >
                              • {user.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">کاربری یافت نشد</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal اختصاص به کاربر */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md mx-4 border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">اختصاص برنامه به کاربر</h3>
            
            {modalLoading ? (
              <div className="py-4 text-center text-muted-foreground">در حال بارگذاری کاربران...</div>
            ) : (
              <>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground mb-4"
                >
                  <option value="">کاربری را انتخاب کنید</option>
                  {allUsers.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleAssignWorkout}
                    disabled={!selectedUserId}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80 disabled:opacity-50"
                  >
                    اختصاص برنامه
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedUserId("");
                    }}
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80"
                  >
                    انصراف
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal جزئیات تمرین */}
      {detailModalOpen && selectedWorkout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-foreground">{selectedWorkout.title}</h3>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">توضیحات</h4>
                <p className="text-muted-foreground">{selectedWorkout.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">مدت زمان</h4>
                  <p className="text-foreground">{selectedWorkout.duration} روز</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">تاریخ ایجاد</h4>
                  <p className="text-foreground">{new Date(selectedWorkout.createdAt).toLocaleDateString('fa-IR')}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">تمرینات</h4>
                {selectedWorkout.exercises.length === 0 ? (
                  <p className="text-muted-foreground">تمرینی تعریف نشده است</p>
                ) : (
                  <div className="space-y-3">
                    {selectedWorkout.exercises.map((exercise, index) => (
                      <div key={index} className="border border-border rounded-lg p-3 bg-muted">
                        <div className="font-medium text-foreground">{exercise.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          ست: {exercise.sets} | تکرار: {exercise.reps} | استراحت: {exercise.restTime} ثانیه
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}