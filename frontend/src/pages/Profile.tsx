import { Link } from "react-router-dom";
import { useAppSelector } from "../store/hook";

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">پروفایل کاربری</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex items-center mb-6">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <div className="mr-4">
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
              {user?.role === "admin"
                ? "مدیر"
                : user?.role === "coach"
                ? "مربی"
                : "کاربر"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              نام
            </label>
            <p className="mt-1">{user?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ایمیل
            </label>
            <p className="mt-1">{user?.email}</p>
          </div>
        </div>
        <div className="mt-6 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm text-center">
          <Link
            to={user?.role === "admin"
                ? "/dashboard/admin/users"
                : user?.role === "coach"
                ? "مربی"
                : "کاربر"}
            
          >
            ویرایش پروفایل
          </Link>
        </div>
      </div>
    </div>
  );
}
