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
  const [exerciseStatus, setExerciseStatus] = useState<boolean[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (workout?.title) {
      document.title = `فینیکس کلاب | ${workout.title}`;
    }
  }, [workout?.title]);

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

  const allExercisesCompleted = exerciseStatus.every((status) => status);

  const handleCompleteExercise = () => {
    const newStatus = [...exerciseStatus];
    newStatus[currentExerciseIndex] = true;
    setExerciseStatus(newStatus);

    const allCompletedNow = newStatus.every((status) => status);

    if (allCompletedNow) {
      handleSubmitProgress();
      return;
    }

    if (currentExerciseIndex < (workout?.exercises.length || 0) - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">
            در حال بارگذاری تمرین...
          </p>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-card rounded-xl shadow border border-border max-w-md mx-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimesCircle className="text-destructive text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            تمرین یافت نشد
          </h2>
          <p className="text-muted-foreground mb-6">
            متاسفانه تمرین مورد نظر پیدا نشد
          </p>
          <button
            onClick={() => navigate("/dashboard/user/workouts")}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/80 transition flex items-center mx-auto"
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
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="bg-primary/10 text-primary px-4 py-1 rounded-full font-medium">
            جلسه {currentExerciseIndex + 1} از {workout.exercises.length}
          </div>
          <button
            onClick={() => navigate("/dashboard/user/workouts")}
            className="flex items-center text-muted-foreground hover:text-foreground transition"
          >
            <FaArrowLeft className="ml-2" />
            بازگشت به لیست
          </button>
        </div>

        <Card className="p-6 sm:p-8">
          {/* Workout Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
              <FaDumbbell className="text-primary text-3xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {workout.title}
            </h1>
            {workout.description && (
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                {workout.description}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>پیشرفت جلسه</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-border rounded-full h-3 overflow-hidden">
              <div
                className="bg-linear-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {completedCount} از {workout.exercises.length} تمرین کامل شد
            </p>
          </div>

          {/* Current Exercise */}
          <div className="bg-muted rounded-xl p-6 mb-8 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-2">
                  تمرین {currentExerciseIndex + 1}
                </span>
                <h2 className="text-2xl font-bold text-foreground">
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
                        ? "bg-success text-success-foreground"
                        : index === currentExerciseIndex
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-border text-muted-foreground hover:bg-muted"
                    }`}
                    title={`تمرین ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-card p-4 rounded-lg border border-border text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  تعداد ست
                </div>
                <div className="text-2xl font-bold text-primary">
                  {currentExercise.sets}
                </div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  تکرار در هر ست
                </div>
                <div className="text-2xl font-bold text-primary">
                  {currentExercise.reps}
                </div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  زمان استراحت
                </div>
                <div className="text-2xl font-bold text-primary">
                  {currentExercise.restTime} ثانیه
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            {currentExerciseIndex === workout.exercises.length - 1 ? (
              <button
                onClick={handleCompleteExercise}
                disabled={isSubmitting || exerciseStatus[currentExerciseIndex]}
                className="flex-1 px-4 py-3 bg-linear-to-r from-success to-success/80 text-success-foreground rounded-lg font-bold hover:from-success/80 hover:to-success/60 transition flex items-center justify-center disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-success-foreground mr-2"></span>
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
                className="flex-1 px-4 py-3 bg-linear-to-r from-primary to-primary/80 text-primary-foreground rounded-lg font-bold hover:from-primary/80 hover:to-primary/60 transition flex items-center justify-center disabled:opacity-70"
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

            <button
              onClick={handleSkipExercise}
              disabled={currentExerciseIndex === workout.exercises.length - 1}
              className="flex-1 px-4 py-3 bg-warning/10 text-warning border-2 border-warning/20 rounded-lg font-medium hover:bg-warning/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              رد کردن تمرین
            </button>

            <button
              onClick={handlePrevious}
              disabled={currentExerciseIndex === 0}
              className="flex-1 px-4 py-3 bg-background border-2 border-border text-foreground rounded-lg font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
            >
              <FaArrowLeft className="ml-2" />
              تمرین قبلی
            </button>
          </div>

          {/* Completion Summary */}
          {allExercisesCompleted && (
            <div className="mt-6 p-4 bg-success/10 rounded-lg border border-success/20 text-center">
              <div className="flex items-center justify-center mb-2">
                <FaCheckCircle className="text-success text-3xl mr-2" />
                <h3 className="text-xl font-bold text-success">
                  آفرین! جلسه تمرینی کامل شد
                </h3>
              </div>
              <p className="text-success">
                همه تمرینات با موفقیت انجام شد. پیشرفت شما به زودی ثبت می‌شود.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
