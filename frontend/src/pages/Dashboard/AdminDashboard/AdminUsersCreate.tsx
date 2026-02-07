// src/pages/Dashboard/AdminDashboard/AdminUsersCreate.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        ایجاد کاربر جدید
      </h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام کامل
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="نام و نام خانوادگی"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ایمیل
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@phoenixclub.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رمز عبور
            </label>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="حداقل 6 کاراکتر"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نقش
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-1/5 px-3 py-2 border text-center rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option value="user">کاربر</option>
              <option value="coach">مربی</option>
              <option value="admin">مدیر</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "در حال ثبت..." : "ایجاد کاربر"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/dashboard/admin/users")}
            >
              انصراف
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
