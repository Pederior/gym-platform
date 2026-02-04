import { Link } from "react-router-dom";
import { useAppSelector } from "../store/hook";

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">پروفایل کاربری</h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Avatar Section */}
        <div className="flex justify-center py-8 bg-gray-50">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="آواتار کاربر"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-4xl text-gray-500">👤</span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {user?.name || "نامشخص"}
            </h2>
            <p className="text-gray-600 mt-1">
              {user?.email || "ایمیلی وجود ندارد"}
            </p>
            <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {user?.role === "admin"
                ? "مدیر"
                : user?.role === "coach"
                  ? "مربی"
                  : "کاربر"}
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام کامل
              </label>
              <p className="text-gray-900">{user?.name || "—"} </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ایمیل
              </label>
              <p className="text-gray-900">{user?.email || "—"}</p>
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-8 text-center">
            <Link
              to={
                user?.role === "admin"
                  ? "/dashboard/admin/users"
                  : "/dashboard/profile/edit"
              }
              className="inline-block px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200"
            >
              ویرایش پروفایل
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
