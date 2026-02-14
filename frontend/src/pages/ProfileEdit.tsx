import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAppSelector } from "../store/hook";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar: File | null;
}

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        avatar: null,
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    
    if (name === "avatar" && files && files[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // اعتبارسنجی
      if (formData.password && formData.password !== formData.confirmPassword) {
        alert("رمز عبور و تکرار آن یکسان نیست!");
        setLoading(false);
        return;
      }

      const payload: any = {
        name: formData.name,
        email: formData.email,
      };

      // فقط اگر رمز عبور وارد شده، ارسال بشه
      if (formData.password) {
        payload.password = formData.password;
      }

      // ارسال داده‌ها
      await api.put("/auth/profile", payload);

      // اگر آواتار انتخاب شده
      if (formData.avatar) {
        const avatarData = new FormData();
        avatarData.append("avatar", formData.avatar);
        await api.put("/auth/profile/avatar", avatarData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      alert("پروفایل با موفقیت به‌روزرسانی شد!");
      navigate("/dashboard/profile");
    } catch (err: any) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "خطا در به‌روزرسانی پروفایل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-foreground">ویرایش پروفایل</h1>

      <div className="bg-card p-6 rounded-xl shadow border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl bg-muted border-2 border-dashed flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : user?.avatar ? (
                  <img src={user.avatar} alt="Current" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-muted-foreground">آواتار</span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground px-1 pt-1 rounded-lg cursor-pointer">
                ✎
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              نام کامل
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              ایمیل
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              رمز عبور جدید (اختیاری)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="فقط اگر می‌خواهید تغییر دهید"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              تکرار رمز عبور
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="تکرار رمز عبور جدید"
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 justify-end rtl:space-x-reverse gap-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard/profile")}
              className="px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-muted cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg disabled:opacity-50 cursor-pointer"
            >
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}