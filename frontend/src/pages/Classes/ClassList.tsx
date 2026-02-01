import { useState, useEffect } from "react";
import Card from "../../components/ui/Card";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import TopBar from "../../components/layout/TopBar";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { HiHome } from "react-icons/hi";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";
interface Class {
  _id: string;
  title: string;
  coach: { name: string };
  dateTime: string;
  capacity: number;
  reservedBy: any[];
  price: number;
}

export default function ClassList() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get("/classes");
        setClasses(res.data.classes || []);
      } catch (err: any) {
        console.error("Error fetching classes:", err);
        toast.error("خطا در بارگذاری کلاس‌ها");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleReserveClass = (cls: Class) => {
    setSelectedClass(cls);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  const handleBook = async () => {
    if (!selectedClass) return;

    setSubmitting(true);
    try {
      await api.post(`/classes/${selectedClass._id}/reserve`);
      toast.success("کلاس با موفقیت رزرو شد!");
      closeModal();

      // آپدیت لیست کلاس‌ها
      const res = await api.get("/classes");
      setClasses(res.data.classes || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در رزرو کلاس");
    } finally {
      setSubmitting(false);
    }
  };

  const isClassFull = (cls: Class) => {
    return cls.reservedBy.length >= cls.capacity;
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const day = date.toLocaleDateString("fa-IR", { weekday: "long" });
    const dateStr = date.toLocaleDateString("fa-IR");
    const time = date.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${day}، ${dateStr} - ${time}`;
  };

  return (
    <div className="min-h-screen">
      <div
        className="w-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bg-header.jpg')",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <TopBar iconColor="gray-300" textColor="white" />
          <Navbar />
        </div>
        <div className="max-w-7xl mx-auto flex justify-between my-5 pb-5">
          <span className="text-white text-lg font-bold">کلاس ها</span>
          <div className="flex text-lg text-white gap-2">
            <Link to="/">
              <HiHome className="font-bold" />
            </Link>
            <MdKeyboardDoubleArrowLeft className="text-gray-300/70" />
            <span className="text-sm">کلاس ها</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 mt-15 mb-15 rounded-3xl backdrop-blur-sm">
        <div className="text-center mb-12">
          <span className="">همین امروز شروع کنید</span>
          <h1 className="text-5xl font-bold text-black my-6 ">
            کلاس‌های{" "}
            <span className="text-red-500 font-light border-b-4 ">تمرین</span>{" "}
            گروهی
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto pt-5">
            بهترین کلاس‌های تخصصی با مربیان مجرب برای رسیدن به اهدافتان
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 text-gray-400">🏋️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              کلاسی برای نمایش وجود ندارد
            </h3>
            <p className="text-gray-500">
              به زودی کلاس‌های جدیدی اضافه خواهد شد
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((cls) => (
              <Card
                key={cls._id}
                className={`p-6 bg-white border border-gray-200 hover:border-red-300 transition-all duration-300 shadow-sm hover:shadow-md ${
                  isClassFull(cls) ? "opacity-75" : "hover:-translate-y-1"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">
                      {cls.title}
                    </h2>
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="ml-1">👨‍🏫</span>
                      {cls.coach.name}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isClassFull(cls)
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {isClassFull(cls) ? "پر شده" : "در دسترس"}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <span className="ml-2 text-blue-600">📅</span>
                    <span className="text-sm">
                      {formatDateTime(cls.dateTime)}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <span className="ml-2 text-purple-600">👥</span>
                    <span className="text-sm">
                      {cls.reservedBy.length}/{cls.capacity} شرکت‌کننده
                    </span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <span className="ml-2 text-green-600">💰</span>
                    <span className="text-sm font-medium">
                      {cls.price.toLocaleString()} تومان
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isClassFull(cls) ? "bg-red-600" : "bg-blue-600"
                      }`}
                      style={{
                        width: `${(cls.reservedBy.length / cls.capacity) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => handleReserveClass(cls)}
                  disabled={isClassFull(cls)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isClassFull(cls)
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-linear-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg"
                  }`}
                >
                  {isClassFull(cls) ? "ظرفیت تکمیل شده" : "عضویت در کلاس"}
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal رزرو کلاس */}
      {isModalOpen && selectedClass && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-red-900 border-2 border-red-700 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-red-700">
              <h2 className="text-2xl font-bold text-white">رزرو کلاس</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {selectedClass.title}
                </h3>
                <p className="text-gray-300">
                  مربی: {selectedClass.coach.name}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">تاریخ و ساعت:</span>
                  <span className="text-white">
                    {formatDateTime(selectedClass.dateTime)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">هزینه:</span>
                  <span className="text-white">
                    {selectedClass.price.toLocaleString()} تومان
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">ظرفیت:</span>
                  <span className="text-white">
                    {selectedClass.reservedBy.length}/{selectedClass.capacity}
                  </span>
                </div>
              </div>

              <div className="w-full bg-gray-900 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isClassFull(selectedClass) ? "bg-red-600" : "bg-blue-600"
                  }`}
                  style={{
                    width: `${(selectedClass.reservedBy.length / selectedClass.capacity) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="p-6 border-t border-red-700 flex gap-3">
              <button
                onClick={handleBook}
                disabled={submitting || isClassFull(selectedClass)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  isClassFull(selectedClass)
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : submitting
                      ? "bg-red-800 text-white"
                      : "bg-linear-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
                }`}
              >
                {submitting
                  ? "در حال رزرو..."
                  : isClassFull(selectedClass)
                    ? "ظرفیت تکمیل شده"
                    : "تأیید رزرو"}
              </button>

              <button
                onClick={closeModal}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
