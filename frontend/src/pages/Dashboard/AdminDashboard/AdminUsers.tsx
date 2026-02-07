import { userService } from "../../../services/userService";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import type { User, UserRole } from "../../../types";
import Card from "../../../components/ui/Card";
import useDocumentTitle from '../../../hooks/useDocumentTitle'

export default function AdminUsers() {
  useDocumentTitle('مدیریت کاربران')
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as UserRole
  });
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  
  // ✅ state برای نمایش/پنهان کردن رمز عبور
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    const roleConfig: Record<UserRole, { label: string; color: string }> = {
      admin: { label: "مدیر", color: "bg-red-100 text-red-800" },
      coach: { label: "مربی", color: "bg-blue-100 text-blue-800" },
      user: { label: "کاربر", color: "bg-gray-100 text-gray-800" },
    };
    const { label, color } = roleConfig[role];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "خطا در بارگیری کاربران");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواید این کاربر را حذف کنید؟")) return;
    try {
      await userService.deleteUser(userId);
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("کاربر با موفقیت حذف شد");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در حذف کاربر");
    }
  };

  const openEditModal = (user: User) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsModalOpen(true);
  };

  const openPasswordModal = (user: User) => {
    if (user.role === 'admin') {
      toast.error('تغییر رمز عبور مدیران مجاز نیست');
      return;
    }
    setEditUser(user);
    setPasswordData({ password: '', confirmPassword: '' });
    setIsPasswordModalOpen(true);
    
    // ✅ ریست کردن وضعیت نمایش رمز عبور
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditUser(null);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setEditUser(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'role' ? value as UserRole : value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    setSubmitting(true);
    try {
      const updatedUser = await userService.updateUser(editUser._id, formData);
      setUsers(users.map(u => u._id === editUser._id ? updatedUser : u));
      toast.success("اطلاعات کاربر با موفقیت به‌روز شد");
      closeModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در به‌روزرسانی کاربر");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    if (passwordData.password.length < 6) {
      toast.error('رمز عبور باید حداقل 6 کاراکتر باشد');
      return;
    }

    if (passwordData.password !== passwordData.confirmPassword) {
      toast.error('رمز عبور و تکرار آن یکسان نیستند');
      return;
    }

    setPasswordSubmitting(true);
    try {
      await userService.updateUserPassword(editUser._id, { password: passwordData.password });
      toast.success("رمز عبور کاربر با موفقیت تغییر کرد");
      closePasswordModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در تغییر رمز عبور");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
      </div>

      <Card>
        {loading ? (
          <div className="py-8 text-center">در حال بارگذاری...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-sm text-gray-500 border-b">
                  <th className="pb-3">نام</th>
                  <th className="pb-3">ایمیل</th>
                  <th className="pb-3">نقش</th>
                  <th className="pb-3">تاریخ عضویت</th>
                  <th className="pb-3">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{user.name}</td>
                    <td className="py-3 text-gray-600">{user.email}</td>
                    <td className="py-3">{getRoleBadge(user.role)}</td>
                    <td className="py-3 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-blue-600 hover:text-blue-800 ml-3 cursor-pointer"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => openPasswordModal(user)}
                        className="text-purple-600 hover:text-purple-800 ml-3 cursor-pointer"
                      >
                        رمز عبور
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal ویرایش اطلاعات */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">ویرایش کاربر</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام کامل</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نقش</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option value="user">کاربر</option>
                  <option value="coach">مربی</option>
                  <option value="admin">مدیر</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal تغییر رمز عبور */}
      {isPasswordModalOpen && editUser && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">تغییر رمز عبور</h2>
              <p className="text-sm text-gray-600 mt-1">
                کاربر: <strong>{editUser.name}</strong>
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-4 space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور جدید</label>
                <input
                  type={showPassword ? "text" : "password"} // ✅ تغییر نوع input
                  name="password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none pl-10"
                  placeholder="حداقل 6 کاراکتر"
                  required
                />
                {/* ✅ دکمه چشم */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-8 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">تکرار رمز عبور</label>
                <input
                  type={showConfirmPassword ? "text" : "password"} // ✅ تغییر نوع input
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none pl-10"
                  placeholder="تکرار رمز عبور"
                  required
                />
                {/* ✅ دکمه چشم */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-8 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? '👁️' : '🙈'}
                </button>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {passwordSubmitting ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                </button>
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}