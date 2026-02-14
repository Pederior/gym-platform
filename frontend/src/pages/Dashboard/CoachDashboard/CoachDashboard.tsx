import { useEffect, useState } from "react";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  supervisedUsers: number;
  createdWorkouts: number;
  activeClasses: number;
}

interface Subscription {
  _id: string;
  plan: "bronze" | "silver" | "gold";
  duration: string;
  amount: number;
  startDate: string;
  expiresAt: string;
  status: "active" | "expired" | "cancelled";
}

interface PotentialStudent {
  _id: string;
  name: string;
  email: string;
  currentSubscription: Subscription;
}

export default function CoachDashboard() {
  useDocumentTitle("داشبورد مربی");
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [potentialStudents, setPotentialStudents] = useState<
    PotentialStudent[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, studentsRes] = await Promise.all([
          api.get("/dashboard/coach/summary"),
          api.get("/coach/potential-students"),
        ]);

        setStats(statsRes.data.data || null);
        setPotentialStudents(
          Array.isArray(studentsRes.data.data) ? studentsRes.data.data : [],
        );
      } catch (error) {
        console.error("Failed to fetch dashboard ", error);
        setPotentialStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Assign student to coach
  const handleAssignStudent = async (studentId: string) => {
    setAssigning(studentId);
    try {
      await api.post("/coach/assign-student", { studentId });

      // Refresh data
      const studentsRes = await api.get("/coach/potential-students");
      setPotentialStudents(studentsRes.data.data);

      // Optional: show success message
      alert("شاگرد با موفقیت انتخاب شد!");
    } catch (error: any) {
      console.error("Failed to assign student:", error);
      alert(error.response?.data?.message || "خطا در انتخاب شاگرد");
    } finally {
      setAssigning(null);
    }
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
      <h1 className="text-2xl font-bold text-foreground">داشبورد مربی</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl shadow hover:shadow-md transition-shadow border border-border">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">
            کاربران زیر نظر
          </h3>
          <p className="text-3xl font-bold text-foreground">
            {stats?.supervisedUsers || 0}
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl shadow hover:shadow-md transition-shadow border border-border">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">
            برنامه‌های ایجاد شده
          </h3>
          <p className="text-3xl font-bold text-foreground">
            {stats?.createdWorkouts || 0}
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl shadow hover:shadow-md transition-shadow border border-border">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">
            کلاس‌های فعال
          </h3>
          <p className="text-3xl font-bold text-foreground">
            {stats?.activeClasses || 0}
          </p>
        </div>
      </div>

      {/* Action Section - Create Workout */}
      <div className="bg-card p-6 rounded-xl shadow border border-border">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="font-bold text-lg text-foreground">
              برنامه‌های تمرینی
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              شما می‌توانید برنامه‌های تمرینی شخصی‌سازی‌شده برای کاربران خود
              طراحی و مدیریت کنید.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/coach/workouts/create")}
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer min-w-30"
          >
            ایجاد برنامه جدید
          </button>
        </div>
      </div>

      {/* Potential Students Section */}
      {potentialStudents.length > 0 && (
        <div className="bg-card p-6 rounded-xl shadow border border-border">
          <h2 className="font-bold text-lg text-foreground mb-4">
            شاگردهای قابل انتخاب
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            این کاربران اشتراک نقره‌ای یا طلایی خریداری کرده‌اند و می‌توانید
            آن‌ها را به عنوان شاگرد انتخاب کنید.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-right text-foreground">نام</th>
                  <th className="pb-3 text-right text-foreground">ایمیل</th>
                  <th className="pb-3 text-right text-foreground">پلن</th>
                  <th className="pb-3 text-right text-foreground">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {potentialStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="border-b border-border hover:bg-muted"
                  >
                    <td className="py-3 text-foreground">{student.name}</td>
                    <td className="py-3 text-muted-foreground">{student.email}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.currentSubscription.plan === "gold"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                        }`}
                      >
                        {student.currentSubscription.plan === "gold"
                          ? "طلایی"
                          : "نقره‌ای"}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleAssignStudent(student._id)}
                        disabled={assigning === student._id}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          assigning === student._id
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-primary hover:bg-primary/80 text-primary-foreground"
                        }`}
                      >
                        {assigning === student._id
                          ? "در حال انتخاب..."
                          : "انتخاب"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No potential students */}
      {potentialStudents.length === 0 && (
        <div className="bg-card p-6 rounded-xl shadow text-center border border-border">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="font-bold text-foreground mb-2">
            شاگردی برای انتخاب وجود ندارد
          </h3>
          <p className="text-muted-foreground">
            هنوز کاربری با اشتراک نقره‌ای یا طلایی ثبت‌نام نکرده است.
          </p>
        </div>
      )}
    </div>
  );
}