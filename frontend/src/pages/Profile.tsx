import { Link } from "react-router-dom";
import { useAppSelector } from "../store/hook";
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth);
  useDocumentTitle('پروفایل کاربری');
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-foreground">پروفایل کاربری</h1>

      <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border">
        {/* Avatar Section */}
        <div className="flex justify-center py-8 bg-muted">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="آواتار کاربر"
              className="w-32 h-32 rounded-full object-cover border-4 border-card shadow-md"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-muted border-4 border-dashed border-border flex items-center justify-center">
              <span className="text-4xl text-muted-foreground">👤</span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {user?.name || "نامشخص"}
            </h2>
            <p className="text-muted-foreground mt-1">
              {user?.email || "ایمیلی وجود ندارد"}
            </p>
            <span className="inline-block mt-3 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {user?.role === "admin"
                ? "مدیر"
                : user?.role === "coach"
                  ? "مربی"
                  : "کاربر"}
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                نام کامل
              </label>
              <p className="text-foreground">{user?.name || "—"} </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                ایمیل
              </label>
              <p className="text-foreground">{user?.email || "—"}</p>
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
              className="inline-block px-6 py-2 bg-primary hover:bg-primary/80 text-primary-foreground font-medium rounded-lg transition duration-200"
            >
              ویرایش پروفایل
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}