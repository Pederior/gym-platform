import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { login, clearError } from "../../store/features/authSlice";
import Button from "../../components/ui/Button";
import type { LoginCredentials } from "../../types";

export default function Login() {
  const [formData, setFormData] = useState<LoginCredentials>({
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
    dispatch(login(formData))
      .unwrap()
      .then(() => navigate("/"))
      .catch(() => {});
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: "url(/images/L&R/L1-2.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute bg-black/40 backdrop-blur-sm p-8 rounded-lg w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          ورود به حساب
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
            <button
              onClick={() => dispatch(clearError())}
              className="float-left ml-2 text-red-500 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} dir="ltr">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-white text-right">
              ایمیل
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              required
            />
          </div>

          {/* ✅ فیلد رمز عبور با دکمه چشم */}
          <div className="mb-6 relative">
            <label className="block text-sm font-medium mb-1 text-white text-right">
              رمز عبور
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white pr-10"
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

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            variant="primary"
          >
            {loading ? "... در حال ورود" : "ورود"}
          </Button>
        </form>

        <p className="text-center mt-4 text-sm text-white">
          حساب ندارید؟{" "}
          <a
            href="/register"
            className="text-red-600 no-underline hover:underline hover:text-red-200 p-2"
          >
            ثبت‌ نام
          </a>
        </p>
      </div>
    </div>
  );
}