import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import { userService } from "../../../services/userService";
import { toast } from "react-hot-toast";
import {
  FaDumbbell,
  FaCheckCircle,
  FaPlay,
  FaHistory,
  FaCalendarCheck,
  FaShoppingCart,
} from "react-icons/fa";
import useDocumentTitle from "../../../hooks/useDocumentTitle";

interface Workout {
  _id: string;
  title: string;
  description?: string;
  duration?: number;
  assignedAt: string;
}

interface Progress {
  _id: string;
  workout: string;
  completedDays: number;
  totalDays: number;
  lastActivity: string;
  status: "active" | "completed" | "paused";
}

export default function UserWorkouts() {
  useDocumentTitle("برنامه تمرینات");

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [progresses, setProgresses] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWorkoutsAndProgress = async () => {
    try {
      setLoading(true);
      const [workoutsRes, progressRes] = await Promise.all([
        userService.getUserWorkouts(),
        userService.getUserProgresses(),
      ]);
      setWorkouts(workoutsRes);
      setProgresses(progressRes);
    } catch (err: any) {
      console.error("Fetch error:", err);
      toast.error("خطا در بارگذاری تمرینات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutsAndProgress();

    const handleRefresh = () => {
      console.log("Refreshing workouts and progress...");
      fetchWorkoutsAndProgress();
    };

    window.addEventListener("workoutProgressUpdated", handleRefresh);

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchWorkoutsAndProgress();
      }
    }, 30000);

    return () => {
      window.removeEventListener("workoutProgressUpdated", handleRefresh);
      clearInterval(interval);
    };
  }, []);

  const refreshData = () => {
    fetchWorkoutsAndProgress();
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: "در حال انجام", color: "bg-primary/10 text-primary" },
      completed: { label: "کامل شده", color: "bg-success/10 text-success" },
      paused: { label: "مکث", color: "bg-warning/10 text-warning" },
    };
    const { label, color } =
      config[status as keyof typeof config] || config.active;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">
            در حال بارگذاری تمرینات...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              برنامه‌های تمرینی من
            </h1>
            <p className="text-muted-foreground mt-2">
              پیشرفت خود را در هر برنامه تمرینی دنبال کنید
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
              {progresses.filter((p) => p.status === "completed").length} برنامه
              کامل شده
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {Math.round(
                progresses.reduce(
                  (sum, p) => sum + p.completedDays / p.totalDays,
                  0,
                ),
              ) || 0}
              % میانگین پیشرفت
            </span>
          </div>
        </div>

        {workouts.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-sm p-12 text-center border border-border">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <FaDumbbell className="text-6xl text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              تمرینی برای نمایش وجود ندارد
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              هنوز برنامه تمرینی به شما اختصاص داده نشده است. با مربی خود تماس
              بگیرید یا از بخش فروشگاه یک برنامه تهیه کنید.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/store")}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/80 transition flex items-center justify-center gap-2"
              >
                <FaShoppingCart />
                خرید برنامه تمرینی
              </button>
              <button
                onClick={() => navigate("/dashboard/user/profile")}
                className="bg-background border-2 border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary/5 hover:text-primary/80 transition"
              >
                <FaHistory className="ml-2" />
                تماس با مربی
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {workouts.map((workout) => {
              const progress =
                progresses.find((p) => p.workout === workout.title) || null;
              const percentage = progress
                ? Math.min(
                    100,
                    Math.round(
                      (progress.completedDays / progress.totalDays) * 100,
                    ),
                  )
                : 0;

              const getProgressColor = () => {
                if (!progress) return "bg-muted";
                if (progress.status === "completed") return "bg-success";
                if (percentage > 75) return "bg-success";
                if (percentage > 50) return "bg-warning";
                return "bg-destructive";
              };

              return (
                <Card
                  key={workout._id}
                  className={`p-6 transition-all duration-300 ${
                    progress?.status === "completed"
                      ? "border-success/20 bg-success/5 ring-1 ring-success/10"
                      : "hover:shadow-xl"
                  }`}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                          <FaDumbbell className="text-primary text-2xl" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-muted-foreground">
                            {workout.duration
                              ? `${workout.duration} روزه`
                              : "برنامه سفارشی"}
                          </span>
                          {progress && (
                            <span className="text-xs text-muted-foreground">•</span>
                          )}
                          {progress && (
                            <span className="text-xs text-muted-foreground">
                              آخرین فعالیت:{" "}
                              {new Date(
                                progress.lastActivity,
                              ).toLocaleDateString("fa-IR")}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                          {workout.title}
                        </h3>
                        {workout.description && (
                          <p className="text-muted-foreground text-sm mt-1 line-clamp-2 max-w-md">
                            {workout.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {progress?.status === "completed" && (
                      <div className="shrink-0 bg-success/10 text-success p-2 rounded-full">
                        <FaCheckCircle className="text-xl" />
                      </div>
                    )}
                  </div>

                  {/* Progress Section - داخل کارت */}
                  <div className="mb-6 p-4 bg-muted rounded-xl border border-border">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <FaCalendarCheck className="text-primary" />
                        <span className="font-bold text-foreground">
                          پیشرفت برنامه
                        </span>
                      </div>
                      {progress && (
                        <span className="text-lg font-bold text-primary">
                          {percentage}%
                        </span>
                      )}
                    </div>

                    {progress ? (
                      <>
                        <div className="w-full bg-border rounded-full h-3 overflow-hidden mb-2">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>

                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>
                            {progress.completedDays} روز از {progress.totalDays}{" "}
                            روز کامل شد
                          </span>
                          <span>
                            {progress.totalDays - progress.completedDays} روز
                            باقی مانده
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {progress.status === "active" && (
                              <span className="text-xs text-primary flex items-center gap-1">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                {getStatusBadge(progress.status)}
                              </span>
                            )}
                          </div>
                          {progress.status === "completed" && (
                            <span className="text-xs text-success font-medium flex items-center gap-1">
                              <FaCheckCircle />
                              برنامه با موفقیت به پایان رسید
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground mb-2">
                          شروع تمرینات برای ثبت پیشرفت
                        </p>
                        <div className="w-full bg-border rounded-full h-3">
                          <div
                            className="h-3 rounded-full bg-muted"
                            style={{ width: "0%" }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-4 border-t border-border">
                    <button
                      onClick={() => {
                        refreshData();
                        navigate(
                          `/dashboard/user/workouts/${workout._id}/start`,
                        );
                      }}
                      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
                        progress?.status === "completed"
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-linear-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/80 hover:to-primary/60 shadow-md"
                      }`}
                      disabled={progress?.status === "completed"}
                    >
                      {progress?.status === "completed" ? (
                        <>
                          <FaCheckCircle />
                          برنامه کامل شد
                        </>
                      ) : (
                        <>
                          <FaPlay />
                          {progress ? "ادامه تمرین" : "شروع تمرین"}
                        </>
                      )}
                    </button>
                    <div className="text-xs text-muted-foreground">
                      شروع برنامه:{" "}
                      {new Date(workout.assignedAt).toLocaleDateString("fa-IR")}
                    </div>
                    
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <div className="bg-card p-6 rounded-xl shadow border border-border">
        <h3 className="font-bold text-foreground mb-3">اقدامات سریع</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              refreshData();
              navigate("/dashboard/user/progress");
            }}
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary transition-colors"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              📊
            </div>
            <div className="text-right">
              <div className="font-medium text-foreground">پیگیری پیشرفت</div>
              <div className="text-sm text-muted-foreground">مشاهده وضعیت تمارین</div>
            </div>
          </button>

          <button
            onClick={() => navigate("/dashboard/user/chat")}
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary transition-colors"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              💬
            </div>
            <div className="text-right">
              <div className="font-medium text-foreground">تماس با مربی</div>
              <div className="text-sm text-muted-foreground">
                درخواست تغییر برنامه غذایی
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}