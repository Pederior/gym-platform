import { useState, useEffect } from "react";
import Card from "../../../components/ui/Card";
import { toast } from "react-hot-toast";
import api from "../../../services/api";
import { Link } from "react-router-dom";

interface User {
  _id: string;
  name: string;
}

interface Workout {
  _id: string;
  title: string;
}

export default function CoachAddWorkoutsToUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedWorkout, setSelectedWorkout] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, workoutsRes] = await Promise.all([
          api.get("/users?role=user"),
          api.get("/workouts"),
        ]);
        setUsers(usersRes.data.users);
        setWorkouts(workoutsRes.data.workouts);
      } catch (err: any) {
        toast.error("خطا در بارگذاری داده‌ها");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedWorkout) return;

    setSubmitting(true);
    try {
      await api.post(
        "/user-workouts",
        {
          userId: selectedUser,
          workoutId: selectedWorkout,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success("برنامه تمرینی با موفقیت به کاربر اختصاص داده شد");
      setSelectedUser("");
      setSelectedWorkout("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در اختصاص برنامه");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        اختصاص برنامه تمرینی به کاربران
      </h1>

      <Card>
        {loading ? (
          <div className="py-8 text-center">در حال بارگذاری...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                انتخاب کاربر
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">کاربری را انتخاب کنید</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                انتخاب برنامه تمرینی
              </label>
              <select
                value={selectedWorkout}
                onChange={(e) => setSelectedWorkout(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">برنامه‌ای را انتخاب کنید</option>
                {workouts.map((workout) => (
                  <option key={workout._id} value={workout._id}>
                    {workout.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedUser || !selectedWorkout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 ml-3"
            >
              {submitting ? "در حال اختصاص..." : "اختصاص برنامه"}
            </button>
            <Link
              to="/dashboard/coach/workouts"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              بازگشت
            </Link>
          </form>
        )}
      </Card>
    </div>
  );
}
