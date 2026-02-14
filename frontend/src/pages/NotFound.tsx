import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import { HiHome } from "react-icons/hi";
import useDocumentTitle from "../hooks/useDocumentTitle";
import TopBar from "../components/layout/TopBar";
import Navbar from "../components/layout/Navbar";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { useAppSelector } from "../store/hook";


export default function NotFound() {
  useDocumentTitle("صفحه یافت نشد");
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <div
        className="w-full bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/bg-header.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <TopBar iconColor="gray-300" textColor="white" />
          <Navbar />
        </div>
        <div className="max-w-7xl mx-auto flex justify-between my-5 pb-5 relative z-10">
          <div className="flex text-lg text-white gap-2">
            <Link to="/">
              <HiHome className="font-bold" />
            </Link>
            <MdKeyboardDoubleArrowLeft className="text-gray-300/70" />
            <span className="text-sm">صفحه یافت نشد!</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated Error Code */}
          <div className="relative mb-8">
            <div className="text-8xl md:text-9xl font-bold text-red-500/20 absolute inset-0 flex items-center justify-center -z-10">
              404
            </div>
            <div className="relative z-10">
              <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-4">
                <span className="bg-linear-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  404
                </span>
              </h1>
              <div className="w-24 h-1 bg-linear-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            صفحه مورد نظر یافت نشد!
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg mx-auto">
            متاسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا آدرس آن تغییر
            کرده است. اما نگران نباشید، ما همیشه در کنار شما هستیم!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-linear-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <HiHome className="text-xl" />
              بازگشت به خانه
            </Link>

            <Link
              to={user?.role === "admin"
                ? "/"
                : user?.role === "coach"
                  ? "/"
                  : "/dashboard/user/tickets"}
              className="inline-flex items-center gap-2 border-2 border-red-500 text-red-500 px-8 py-4 rounded-xl font-semibold hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              تماس با پشتیبانی
            </Link>
          </div>

          {/* Fun Message */}
          <div className="mt-8 text-gray-500 text-sm">
            <p>💡 نکته: ممکنه آدرس رو اشتباه تایپ کرده باشید!</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
