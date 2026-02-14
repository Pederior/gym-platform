import { useState, useEffect } from "react";
import Card from "../../components/ui/Card";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import TopBar from "../../components/layout/TopBar";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { HiHome } from "react-icons/hi";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { FaChalkboardTeacher, FaCalendarAlt, FaUsers } from "react-icons/fa";
import { BiMoneyWithdraw } from "react-icons/bi";
import { useAppSelector } from "../../store/hook";

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
  useDocumentTitle("کلاس‌ها");
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("برای مشاهده کلاس‌ها باید ابتدا وارد حساب خود شوید");
      navigate("/login");
      return;
    }

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
  }, [token, navigate]);

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

  const getCapacityColor = (cls: Class) => {
    const percentage = (cls.reservedBy.length / cls.capacity) * 100;
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 70) return "bg-orange-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  // ✅ نمایش صفحه بارگذاری یا خطا برای کاربران مهمان
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div
        className="w-full bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/bg-header.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-7xl mx-auto relative">
          <TopBar iconColor="gray-300" textColor="white" />
          <Navbar />
        </div>
        <div className="max-w-7xl mx-auto flex justify-between my-5 pb-5 relative px-4">
          <div className="flex text-lg text-white gap-2">
            <Link to="/">
              <HiHome className="font-bold" />
            </Link>
            <MdKeyboardDoubleArrowLeft className="text-gray-300/70" />
            <span className="text-sm">کلاس ها</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="text-sm font-medium">همین امروز شروع کنید</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            کلاس‌های{" "}
            <span className="text-primary">تمرین گروهی</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            بهترین کلاس‌های تخصصی با مربیان مجرب برای رسیدن به اهدافتان
          </p>
        </div>

        {/* Classes Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-8xl mb-8 text-muted-foreground">🏋️‍♂️</div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              کلاسی برای نمایش وجود ندارد
            </h3>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              به زودی کلاس‌های جدیدی اضافه خواهد شد. منتظر باشید!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <Card
                key={cls._id}
                className={`p-6 bg-card border border-border hover:border-primary transition-all duration-300 shadow hover:shadow-lg ${
                  isClassFull(cls)
                    ? "opacity-80 cursor-not-allowed"
                    : "hover:-translate-y-1 cursor-pointer hover:bg-muted"
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      {cls.title}
                    </h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <FaChalkboardTeacher className="text-primary text-xl" />
                      {cls.coach.name}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isClassFull(cls)
                        ? "bg-destructive/10 text-destructive"
                        : "bg-green-500/10 text-green-500"
                    }`}
                  >
                    {isClassFull(cls) ? "پر شده" : "در دسترس"}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-foreground gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FaCalendarAlt className="text-primary text-base" />
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {formatDateTime(cls.dateTime)}
                    </span>
                  </div>

                  <div className="flex items-center text-foreground gap-2">
                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <FaUsers className="text-secondary-foreground text-base" />
                    </div>
                    <span className="text-sm text-secondary-foreground font-bold">
                      {cls.reservedBy.length}/{cls.capacity} شرکت‌کننده
                    </span>
                  </div>

                  <div className="flex items-center text-foreground gap-2">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <BiMoneyWithdraw className="text-accent text-base" />
                    </div>
                    <span className="text-lg font-bold text-accent">
                      {cls.price.toLocaleString()} تومان
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full ${getCapacityColor(cls)} transition-all duration-700`}
                      style={{
                        width: `${Math.min((cls.reservedBy.length / cls.capacity) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>شروع</span>
                    <span>پر شده</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleReserveClass(cls)}
                  disabled={isClassFull(cls)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    isClassFull(cls)
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/80 shadow hover:shadow-md transform hover:scale-105"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">رزرو کلاس</h2>
              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground text-2xl transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Class Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {selectedClass.title}
                </h3>
                <p className="text-muted-foreground">
                  مربی:{" "}
                  <span className="font-semibold text-foreground">
                    {selectedClass.coach.name}
                  </span>
                </p>
              </div>

              {/* Details */}
              <div className="space-y-4 bg-muted p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">
                    تاریخ و ساعت:
                  </span>
                  <span className="text-foreground font-semibold">
                    {formatDateTime(selectedClass.dateTime)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">هزینه:</span>
                  <span className="text-accent font-bold">
                    {selectedClass.price.toLocaleString()} تومان
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">ظرفیت:</span>
                  <span className="text-foreground font-semibold">
                    {selectedClass.reservedBy.length}/{selectedClass.capacity}
                  </span>
                </div>
              </div>

              {/* Capacity Progress */}
              <div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${getCapacityColor(selectedClass)} transition-all duration-700`}
                    style={{
                      width: `${Math.min((selectedClass.reservedBy.length / selectedClass.capacity) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>شروع</span>
                  <span>پر شده</span>
                </div>
              </div>

              {/* Warning */}
              {!isClassFull(selectedClass) && (
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                  <p className="text-accent text-sm text-center">
                    ✨ پس از تأیید رزرو، بلیط الکترونیکی شما صادر خواهد شد
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-border flex gap-3">
              <button
                onClick={handleBook}
                disabled={submitting || isClassFull(selectedClass)}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  isClassFull(selectedClass)
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : submitting
                      ? "bg-primary/70 text-primary-foreground"
                      : "bg-primary text-primary-foreground hover:bg-primary/80 shadow hover:shadow-md"
                }`}
              >
                {submitting
                  ? "در حال پردازش..."
                  : isClassFull(selectedClass)
                    ? "ظرفیت تکمیل شده"
                    : "تأیید رزرو"}
              </button>

              <button
                onClick={closeModal}
                className="px-4 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-colors font-semibold"
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