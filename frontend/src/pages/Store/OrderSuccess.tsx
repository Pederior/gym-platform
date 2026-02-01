import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaHome, FaShoppingBag } from "react-icons/fa";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="text-5xl text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          سفارش شما با موفقیت ثبت شد! ✅
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          از اعتماد شما متشکریم. سفارش شما در حال پردازش است و به زودی با شما تماس خواهیم گرفت.
        </p>

        {/* Order Details */}
        {location.state?.order && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="font-medium text-gray-700">شماره سفارش:</p>
            <p className="text-sm text-gray-500">{location.state.order._id}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
          >
            <FaHome className="inline-block ml-2" />
            بازگشت به صفحه اصلی
          </Link>

          <Link
            to="/store"
            className="block w-full bg-white border-2 border-red-500 text-red-500 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
          >
            <FaShoppingBag className="inline-block ml-2" />
            ادامه خرید
          </Link>
        </div>

        {/* Countdown */}
        <p className="text-sm text-gray-400 mt-6">
          بازگشت به صفحه اصلی در {countdown} ثانیه...
        </p>
      </div>
    </div>
  );
}