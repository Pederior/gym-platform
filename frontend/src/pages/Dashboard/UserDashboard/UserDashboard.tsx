import { useEffect, useState } from "react";
import { useAppSelector } from "../../../store/hook";
import api from "../../../services/api";
import useDocumentTitle from "../../../hooks/useDocumentTitle";

interface DashboardStats {
  reservedClasses: number;
  completedWorkouts: number;
  weeklyProgress: number;
}

interface CurrentWorkout {
  _id: string;
  title: string;
  description: string;
  duration: number;
}

interface DietItem {
  name: string;
  portion: string;
  calories?: number;
}

interface DietPlan {
  _id: string;
  title: string;
  description: string;
  duration: number;
  diets: DietItem[];
}

export default function UserDashboard() {
  useDocumentTitle("داشبورد کاربر");

  const { user } = useAppSelector((state) => state.auth);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<CurrentWorkout | null>(
    null,
  );
  const [currentDietPlan, setCurrentDietPlan] = useState<DietPlan | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, workoutsRes, dietPlansRes] = await Promise.all([
          api.get("/users/dashboard/stats"),
          api.get("/users/workouts/assigned"),
          api.get("/users/diet-plans/current"),
        ]);

        setStats(
          statsRes.data.data || {
            reservedClasses: 0,
            completedWorkouts: 0,
            weeklyProgress: 0,
          },
        );
        console.log(workoutsRes.data.data);
        const workouts = Array.isArray(workoutsRes.data.data)
          ? workoutsRes.data.data.filter((w) => w && w._id && w.title)
          : [];

        const dietPlans = Array.isArray(dietPlansRes.data.data)
          ? dietPlansRes.data.data
          : [];

        const workoutWithDefaults = workouts[0]
          ? {
              ...workouts[0],
              completedDays: 0,
              totalDays: workouts[0].duration,
            }
          : null;

        setCurrentWorkout(workoutWithDefaults);
        setCurrentDietPlan(dietPlans[0] || null);
      } catch (error) {
        console.error("Failed to fetch dashboard ", error);
        setStats({
          reservedClasses: 0,
          completedWorkouts: 0,
          weeklyProgress: 0,
        });
        setCurrentWorkout(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        داشبورد کاربر — خوش آمدید، {user?.name}!
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            کلاس‌های رزرو شده
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats?.reservedClasses || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            تمرین‌های انجام‌شده
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats?.completedWorkouts || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            پیشرفت هفتگی
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats?.weeklyProgress ? `${stats.weeklyProgress}%` : "—"}
          </p>
        </div>
      </div>

      {/* Current Workout Section */}
      {currentWorkout && currentWorkout._id && currentWorkout.title ? (
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="flex-1">
              <h2 className="font-bold text-lg text-gray-800 mb-2">
                برنامه تمرینی فعلی
              </h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {currentWorkout.title}
              </h3>
              <p className="text-gray-600 mb-4">{currentWorkout.description}</p>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>پیشرفت</span>
                  <span>
                    {currentWorkout.completedDays} از {currentWorkout.totalDays}{" "}
                    روز
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(currentWorkout.completedDays / currentWorkout.totalDays) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-32">
              <button
                onClick={() =>
                  (window.location.href = `/dashboard/user/workouts/${currentWorkout._id}`)
                }
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                مشاهده جزئیات
              </button>
              <button
                onClick={() => {
                  /* ثبت پیشرفت */
                }}
                className="border border-red-600 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                ثبت پیشرفت
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <div className="text-6xl mb-4">🏋️</div>
          <h3 className="font-bold text-gray-800 mb-2">
            برنامه تمرینی فعالی وجود ندارد
          </h3>
          <p className="text-gray-600 mb-4">
            {user?.subscription?.plan === "bronze"
              ? "با ارتقای اشتراک خود، برنامه‌های تمرینی شخصی‌سازی‌شده دریافت کنید"
              : "منتظر اختصاص برنامه تمرینی توسط مربی خود باشید"}
          </p>
          {user?.subscription?.plan === "bronze" && (
            <button
              onClick={() => (window.location.href = "/subscription")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              ارتقای اشتراک
            </button>
          )}
        </div>
      )}

      {/* Subscription Info */}
      {user?.subscription && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold text-lg text-gray-800 mb-3">اشتراک فعلی</h2>
          <div className="flex flex-wrap items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.subscription.plan === "gold"
                  ? "bg-yellow-100 text-yellow-800"
                  : user.subscription.plan === "silver"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              {user.subscription.plan === "gold"
                ? "طلایی"
                : user.subscription.plan === "silver"
                  ? "نقره‌ای"
                  : "برنز"}
            </span>
            <span className="text-gray-600 text-sm">
              منقضی می‌شود:{" "}
              {new Date(user.subscription.expiresAt).toLocaleDateString(
                "fa-IR",
              )}
            </span>
            <button
              onClick={() => (window.location.href = "/subscription")}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              تمدید/ارتقا
            </button>
          </div>
        </div>
      )}

      {currentDietPlan && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold text-lg text-gray-800 mb-3">
            برنامه غذایی فعلی
          </h2>
          <h3 className="text-xl font-semibold mb-2">
            {currentDietPlan.title}
          </h3>

          <div className="space-y-3">
            {currentDietPlan && (
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-bold text-lg text-gray-800 mb-3">
                  برنامه غذایی فعلی
                </h2>
                <h3 className="text-xl font-semibold mb-2">
                  {currentDietPlan.title}
                </h3>

                <div className="space-y-3">
                  {currentDietPlan.diets.map((diet, index) => (
                    <div key={index} className="border-l-4 border-red-600 pl-3">
                      <h4 className="font-medium">{diet.name}</h4>
                      <p className="text-gray-600 text-sm">{diet.portion}</p>
                      {diet.calories && diet.calories > 0 && (
                        <p className="text-gray-500 text-xs">
                          {diet.calories} کالری
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
