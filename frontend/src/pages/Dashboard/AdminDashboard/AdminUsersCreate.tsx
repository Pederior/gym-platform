import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import { userService } from "../../../services/userService";
import { toast } from "react-hot-toast";
import useDocumentTitle from '../../../hooks/useDocumentTitle'

export default function AdminUsersCreate() {
  useDocumentTitle('ایجاد کاربر جدید')
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as const,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await userService.createUser(formData);
      toast.success("کاربر جدید با موفقیت ایجاد شد");
      navigate("/dashboard/admin/users");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در ایجاد کاربر");
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
        ایجاد کاربر جدید
      </h1>

      <Card className="bg-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              نام کامل
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="نام و نام خانوادگی"
              required
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              ایمیل
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@phoenixclub.com"
              required
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              رمز عبور
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="حداقل 6 کاراکتر"
              required
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              نقش
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full text-center sm:w-1/3 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
            >
              <option value="user">کاربر</option>
              <option value="coach">مربی</option>
              <option value="admin">مدیر</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "در حال ثبت..." : "ایجاد کاربر"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/admin/users")}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 cursor-pointer"
            >
              انصراف
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}