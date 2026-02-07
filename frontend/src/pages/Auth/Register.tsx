import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { register, clearError } from "../../store/features/authSlice";
import Button from "../../components/ui/Button";
import type { RegisterData } from "../../types";

export default function Register() {
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
  });
  const { loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // ✅ state برای نمایش/پنهان کردن رمز عبور
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(register(formData))
      .unwrap()
      .then(() => navigate("/"))
      .catch(() => {});
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 p-4"
      style={{
        backgroundImage: "url(/images/L&R/R1-1.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute bg-black/40 backdrop-blur-sm p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-white mb-2">
          ثبت‌نام
        </h1>
        <p className="text-white text-center mb-6">حساب کاربری خود را بسازید</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex justify-between">
            {error}
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" dir="ltr">
          <div>
            <label className="block text-sm font-medium text-white mb-1 text-right">
              نام کامل
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1 text-right">
              ایمیل
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
              required
            />
          </div>

          {/* ✅ فیلد رمز عبور با دکمه چشم */}
          <div className="relative">
            <label className="block text-sm font-medium text-white mb-1 text-right">
              رمز عبور
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 bg-white pr-10"
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "در حال ثبت‌ نام..." : "ثبت‌ نام"}
          </Button>
        </form>

        <p className="text-center mt-4 text-sm text-white">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <a
            href="/login"
            className="text-red-600 no-underline hover:underline hover:text-red-200 p-2"
          >
            ورود
          </a>
        </p>
      </div>
    </div>
  );
}