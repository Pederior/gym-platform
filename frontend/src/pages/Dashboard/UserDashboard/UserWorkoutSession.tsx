import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../../components/ui/Card";
import { toast } from "react-hot-toast";
import { userService } from "../../../services/userService";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaArrowRight,
  FaDumbbell,
} from "react-icons/fa";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  _id?: string;
}

interface WorkoutDetail {
  _id: string;
  title: string;
  description?: string;
  duration?: number;
  exercises: Exercise[];
}

export default function UserWorkoutSession() {
  const { workoutId } = useParams<{ workoutId: string }>();
  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseStatus, setExerciseStatus] = useState<boolean[]>([]); // true = completed
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        if (!workoutId) {
          toast.error("شناسه تمرین نامعتبر است");
          navigate("/dashboard/user/workouts");
          return;
        }

        const data = await userService.getWorkoutDetail(workoutId);
        setWorkout(data);

        // Initialize exercise status array (همه ناتمام)
        setExerciseStatus(new Array(data.exercises.length).fill(false));
      } catch (err: any) {
        console.error("Fetch workout error:", err);
        toast.error(err.response?.data?.message || "خطا در بارگذاری تمرین");
        navigate("/dashboard/user/workouts");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, [workoutId, navigate]);

  // علامت‌گذاری تمرین فعلی به عنوان کامل‌شده
  const markCurrentExerciseComplete = () => {
    setExerciseStatus((prev) => {
      const newStatus = [...prev];
      newStatus[currentExerciseIndex] = true;
      return newStatus;
    });
  };

  // بررسی اینکه آیا همه تمرینات کامل شده‌اند
  const allExercisesCompleted = exerciseStatus.every((status) => status);

  const handleCompleteExercise = () => {
    markCurrentExerciseComplete();

    // اگر تمرین آخر نیست، برو به بعدی
    if (currentExerciseIndex < (workout?.exercises.length || 0) - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else if (allExercisesCompleted) {
      // اگر آخرین تمرین و همه کامل شدن، پیشرفت رو ثبت کن
      handleSubmitProgress();
    }
  };

  const handleSkipExercise = () => {
    if (currentExerciseIndex < (workout?.exercises.length || 0) - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
    }
  };

  const handleSubmitProgress = async () => {
    if (!allExercisesCompleted) {
      if (
        !confirm(
          "همه تمرینات را کامل نکرده‌اید. آیا می‌خواهید پیشرفت فعلی ثبت شود؟",
        )
      ) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (!workoutId) return;

      await userService.submitWorkoutProgress(workoutId);

      toast.success("آفرین! پیشرفت شما با موفقیت ثبت شد", {
        icon: "💪",
        duration: 3000,
      });

      setTimeout(() => {
        window.dispatchEvent(new Event("workoutProgressUpdated"));

        navigate("/dashboard/user/workouts", {
          state: { refresh: true }, 
        });
      }, 1500);
    } catch (err: any) {
      console.error("Submit progress error:", err);
      toast.error(err.response?.data?.message || "خطا در ثبت پیشرفت");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">در حال بارگذاری تمرین...</p>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimesCircle className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            تمرین یافت نشد
          </h2>
          <p className="text-gray-600 mb-6">متاسفانه تمرین مورد نظر پیدا نشد</p>
          <button
            onClick={() => navigate("/dashboard/user/workouts")}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition flex items-center mx-auto"
          >
            <FaArrowLeft className="ml-2" />
            بازگشت به لیست تمرینات
          </button>
        </div>
      </div>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const completedCount = exerciseStatus.filter((status) => status).length;
  const progressPercentage = Math.round(
    (completedCount / workout.exercises.length) * 100,
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard/user/workouts")}
            className="flex items-center text-gray-600 hover:text-gray-800 transition"
          >
            <FaArrowLeft className="ml-2" />
            بازگشت به لیست
          </button>
          <div className="bg-red-100 text-red-800 px-4 py-1 rounded-full font-medium">
            جلسه {currentExerciseIndex + 1} از {workout.exercises.length}
          </div>
        </div>

        <Card className="p-6 sm:p-8">
          {/* Workout Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <FaDumbbell className="text-red-600 text-3xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {workout.title}
            </h1>
            {workout.description && (
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                {workout.description}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>پیشرفت جلسه</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-linear-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              {completedCount} از {workout.exercises.length} تمرین کامل شد
            </p>
          </div>

          {/* Current Exercise */}
          <div className="bg-linear-to-br from-gray-50 to-white rounded-xl p-6 mb-8 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-block bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
                  تمرین {currentExerciseIndex + 1}
                </span>
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentExercise.name}
                </h2>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                {exerciseStatus.map((completed, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentExerciseIndex(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      completed
                        ? "bg-green-500 text-white"
                        : index === currentExerciseIndex
                          ? "bg-red-500 text-white scale-110"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                    title={`تمرین ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-gray-500 mb-1">تعداد ست</div>
                <div className="text-2xl font-bold text-red-600">
                  {currentExercise.sets}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-gray-500 mb-1">تکرار در هر ست</div>
                <div className="text-2xl font-bold text-red-600">
                  {currentExercise.reps}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-gray-500 mb-1">زمان استراحت</div>
                <div className="text-2xl font-bold text-red-600">
                  {currentExercise.restTime} ثانیه
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentExerciseIndex === 0}
              className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
            >
              <FaArrowLeft className="ml-2" />
              تمرین قبلی
            </button>

            <button
              onClick={handleSkipExercise}
              disabled={currentExerciseIndex === workout.exercises.length - 1}
              className="flex-1 px-4 py-3 bg-yellow-100 text-yellow-800 border-2 border-yellow-300 rounded-lg font-medium hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              رد کردن تمرین
            </button>

            {currentExerciseIndex === workout.exercises.length - 1 ? (
              <button
                onClick={handleCompleteExercise}
                disabled={isSubmitting || exerciseStatus[currentExerciseIndex]}
                className="flex-1 px-4 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition flex items-center justify-center disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    در حال ثبت...
                  </span>
                ) : exerciseStatus[currentExerciseIndex] ? (
                  <span className="flex items-center">
                    <FaCheckCircle className="ml-2" />
                    تکمیل شد
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaCheckCircle className="ml-2" />
                    پایان تمرین و ثبت پیشرفت
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={handleCompleteExercise}
                disabled={exerciseStatus[currentExerciseIndex]}
                className="flex-1 px-4 py-3 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg font-bold hover:from-red-600 hover:to-red-700 transition flex items-center justify-center disabled:opacity-70"
              >
                {exerciseStatus[currentExerciseIndex] ? (
                  <span className="flex items-center">
                    <FaCheckCircle className="ml-2" />
                    تکمیل شد
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaArrowRight className="mr-2" />
                    تمرین بعدی
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Completion Summary */}
          {allExercisesCompleted && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 text-center">
              <div className="flex items-center justify-center mb-2">
                <FaCheckCircle className="text-green-500 text-3xl mr-2" />
                <h3 className="text-xl font-bold text-green-800">
                  آفرین! جلسه تمرینی کامل شد
                </h3>
              </div>
              <p className="text-green-700">
                همه تمرینات با موفقیت انجام شد. پیشرفت شما به زودی ثبت می‌شود.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
