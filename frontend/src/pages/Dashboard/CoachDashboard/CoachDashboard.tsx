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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">داشبورد مربی</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            کاربران زیر نظر
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats?.supervisedUsers || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            برنامه‌های ایجاد شده
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats?.createdWorkouts || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            کلاس‌های فعال
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats?.activeClasses || 0}
          </p>
        </div>
      </div>

      {/* Action Section - Create Workout */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="font-bold text-lg text-gray-800">
              برنامه‌های تمرینی
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              شما می‌توانید برنامه‌های تمرینی شخصی‌سازی‌شده برای کاربران خود
              طراحی و مدیریت کنید.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/coach/workouts/create")}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer min-w-30"
          >
            ایجاد برنامه جدید
          </button>
        </div>
      </div>

      {/* Potential Students Section */}
      {potentialStudents.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold text-lg text-gray-800 mb-4">
            شاگردهای قابل انتخاب
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            این کاربران اشتراک نقره‌ای یا طلایی خریداری کرده‌اند و می‌توانید
            آن‌ها را به عنوان شاگرد انتخاب کنید.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-right">نام</th>
                  <th className="pb-3 text-right">ایمیل</th>
                  <th className="pb-3 text-right">پلن</th>
                  <th className="pb-3 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {potentialStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3">{student.name}</td>
                    <td className="py-3 text-gray-600">{student.email}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.currentSubscription.plan === "gold"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
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
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
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
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="font-bold text-gray-800 mb-2">
            شاگردی برای انتخاب وجود ندارد
          </h3>
          <p className="text-gray-600">
            هنوز کاربری با اشتراک نقره‌ای یا طلایی ثبت‌نام نکرده است.
          </p>
        </div>
      )}
    </div>
  );
}
