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

export default function CoachWorkouts() {
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
      const users = await getAllUsers();
      setAllUsers(users);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">برنامه‌های تمرینی</h1>
        <Link
          to="/dashboard/coach/workouts/create"
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          ایجاد برنامه جدید
        </Link>
      </div>

      <Card>
        {loading ? (
          <div className="py-8 text-center">در حال بارگذاری...</div>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div key={workout._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{workout.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {workout.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      مدت زمان: {workout.duration} روز • ایجاد شده:{" "}
                      {new Date(workout.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openAssignModal(workout._id)}
                      className="text-green-600 cursor-pointer"
                    >
                      اختصاص به کاربر
                    </button>
                    <button
                      onClick={() => openDetailModal(workout)}
                      className="text-purple-600 cursor-pointer"
                    >
                      جزئیات تمرین
                    </button>
                    <Link
                      to={`/dashboard/coach/workouts/edit/${workout._id}`}
                      className="text-blue-600"
                    >
                      ویرایش
                    </Link>
                    <button
                      onClick={() => handleDelete(workout._id)}
                      className="text-red-600 cursor-pointer"
                    >
                      حذف
                    </button>
                  </div>
                </div>

                {/* دکمه نمایش کاربران */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleUsers(workout._id)}
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    {expandedWorkout === workout._id
                      ? "پنهان کردن کاربران"
                      : "نمایش کاربران"}
                  </button>

                  {expandedWorkout === workout._id && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">
                        کاربران دارنده این برنامه:
                      </h4>
                      {usersMap[workout._id]?.length > 0 ? (
                        <ul className="space-y-1">
                          {usersMap[workout._id].map((user) => (
                            <li
                              key={user._id}
                              className="text-sm text-gray-600"
                            >
                              • {user.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">کاربری یافت نشد</p>
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
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4 ">اختصاص برنامه به کاربر</h3>
            
            {modalLoading ? (
              <div className="py-4 text-center">در حال بارگذاری کاربران...</div>
            ) : (
              <>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg mb-4"
                >
                  <option value="">کاربری را انتخاب کنید</option>
                  {allUsers.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleAssignWorkout}
                    disabled={!selectedUserId}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    اختصاص برنامه
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedUserId("");
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
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
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedWorkout.title}</h3>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">توضیحات</h4>
                <p className="text-gray-600">{selectedWorkout.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">مدت زمان</h4>
                  <p>{selectedWorkout.duration} روز</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">تاریخ ایجاد</h4>
                  <p>{new Date(selectedWorkout.createdAt).toLocaleDateString('fa-IR')}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">تمرینات</h4>
                {selectedWorkout.exercises.length === 0 ? (
                  <p className="text-gray-500">تمرینی تعریف نشده است</p>
                ) : (
                  <div className="space-y-3">
                    {selectedWorkout.exercises.map((exercise, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
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
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
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