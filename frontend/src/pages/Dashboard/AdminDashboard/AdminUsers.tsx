import { userService } from "../../../services/userService";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import type { User, UserRole } from "../../../types";
import Card from "../../../components/ui/Card";
import useDocumentTitle from '../../../hooks/useDocumentTitle'
import { FaRegEye,FaRegEyeSlash  } from "react-icons/fa";

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
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    const roleConfig: Record<UserRole, { label: string; color: string }> = {
      admin: { label: "مدیر", color: "bg-destructive/10 text-destructive" },
      coach: { label: "مربی", color: "bg-primary/10 text-primary" },
      user: { label: "کاربر", color: "bg-muted/50 text-muted-foreground" },
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
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">مدیریت کاربران</h1>
      </div>

      <Card className="overflow-x-auto bg-card">
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">در حال بارگذاری...</div>
        ) : (
          <div className="overflow-x-auto ">
            <table className="w-full min-w-full">
              <thead>
                <tr className="text-right text-sm text-muted-foreground border-b border-border">
                  <th className="pb-3 px-2">نام</th>
                  <th className="pb-3 px-2">ایمیل</th>
                  <th className="pb-3 px-2">نقش</th>
                  <th className="pb-3 px-2">تاریخ عضویت</th>
                  <th className="pb-3 px-2">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-border hover:bg-muted">
                    <td className="py-3 px-2 font-medium text-foreground">{user.name}</td>
                    <td className="py-3 px-2 text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-2">{getRoleBadge(user.role)}</td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-primary hover:text-primary/80 ml-2 cursor-pointer text-sm"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => openPasswordModal(user)}
                        className="text-accent hover:text-accent/80 ml-2 cursor-pointer text-sm"
                      >
                        رمز عبور
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-destructive hover:text-destructive/80 cursor-pointer text-sm"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg w-full max-w-md border border-border">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">ویرایش کاربر</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">نام کامل</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">ایمیل</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">نقش</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
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
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 cursor-pointer"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg w-full max-w-md border border-border">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">تغییر رمز عبور</h2>
              <p className="text-sm text-muted-foreground mt-1">
                کاربر: <strong className="text-foreground">{editUser.name}</strong>
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-4 space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-1">رمز عبور جدید</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:outline-none bg-background text-foreground pl-10"
                  placeholder="حداقل 6 کاراکتر"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-8 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-1">تکرار رمز عبور</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:outline-none bg-background text-foreground pl-10"
                  placeholder="تکرار رمز عبور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-8 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/80 disabled:opacity-50 cursor-pointer"
                >
                  {passwordSubmitting ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                </button>
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 cursor-pointer"
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