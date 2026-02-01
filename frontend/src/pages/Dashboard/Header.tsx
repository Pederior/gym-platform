import { useState, useRef, useEffect } from "react";
import { IoMdNotifications } from "react-icons/io";
import { FaUser, FaCog, FaSignOutAlt, FaHome, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hook";
import api from "../../services/api";

interface BaseNotification {
  _id: string;
  message: string;
  relatedId: string;
  createdAt: string;
  senderName?: string;
  senderRole?: string;
}

interface ChatNotification extends BaseNotification {
  type: "chat";
}

interface ClassRegistrationNotification extends BaseNotification {
  type: "class_registration";
}

interface WorkoutAssignedNotification extends BaseNotification {
  type: "workout_assigned";
}

interface AggregatedChatNotification extends BaseNotification {
  type: "chat_aggregated";
  count: number;
}

type Notification = 
  | ChatNotification
  | ClassRegistrationNotification  
  | WorkoutAssignedNotification
  | AggregatedChatNotification;

const PAGE_TITLES: Record<string, string> = {
  '/dashboard/admin': 'داشبورد مدیر',
  '/dashboard/coach': 'داشبورد مربی',
  '/dashboard/user': 'داشبورد کاربر',
  '/dashboard/admin/users': 'لیست اعضا',
  '/dashboard/admin/users/create': 'افزودن عضو',
  '/dashboard/admin/subscriptions': 'وضعیت اشتراک‌ها',
  '/dashboard/admin/invoices': 'صورت‌حساب‌ها',
  '/dashboard/admin/payments': 'پرداخت‌ها',
  '/dashboard/admin/reports': 'گزارش‌های مالی',
  '/dashboard/admin/classes': 'مدیریت کلاس‌ها',
  '/dashboard/admin/reservations': 'رزرو تجهیزات',
  '/dashboard/admin/settings/club': 'تنظیمات باشگاه',
  '/dashboard/admin/settings/pricing': 'تنظیمات قیمت‌ها',
  '/dashboard/admin/logs': 'لاگ‌ها و امنیت',
  '/dashboard/coach/workouts': 'برنامه‌های تمرینی',
  '/dashboard/coach/progress': 'پیگیری پیشرفت',
  '/dashboard/coach/classes': 'کلاس‌ها',
  '/dashboard/coach/chat': 'چت با کاربران',
  '/dashboard/user/workouts': 'برنامه تمرینی',
  '/dashboard/user/subscriptions': 'خرید اشتراک',
  '/dashboard/user/classes': 'کلاس‌ها',
  '/dashboard/user/progress': 'پیگیری پیشرفت',
  '/dashboard/user/payments': 'اعضایت و پرداخت',
  '/dashboard/user/chat': 'چت با مربی',
  '/dashboard/profile': 'پروفایل',
  '/': 'صفحه اصلی'
};

const Header = () => {
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [isChatPage, setIsChatPage] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  // بستن منوها با کلیک خارج
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // تشخیص صفحه چت
  useEffect(() => {
    const isChat = location.pathname.includes("/chat");
    setIsChatPage(isChat);
  }, [location.pathname]);

  // دریافت نوتیفیکیشن‌ها
  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // حذف نوتیفیکیشن
  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // علامت‌گذاری همه به عنوان خوانده
  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/mark-all-read");
      setNotifications([]);
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  // بارگذاری نوتیفیکیشن‌ها وقتی باز می‌شه
  useEffect(() => {
    if (isNotificationOpen) {
      fetchNotifications();
    }
  }, [isNotificationOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (PAGE_TITLES[path]) {
      return PAGE_TITLES[path];
    }
    const pathParts = path.split("/").filter((part) => part);
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1];
      const title = lastPart
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
      return title;
    }
    return "داشبورد";
  };

  // تابع تجمیع نوتیفیکیشن‌های چت
  const getAggregatedChatNotifications = (): AggregatedChatNotification[] => {
    const chatNotifs = notifications.filter((n): n is ChatNotification => n.type === 'chat');
    if (chatNotifs.length === 0) return [];

    const grouped = chatNotifs.reduce((acc, notif) => {
      const key = `${notif.relatedId}-${notif.senderName || 'ناشناس'}`;
      if (!acc[key]) {
        acc[key] = {
          count: 0,
          senderName: notif.senderName || 'ناشناس',
          senderRole: notif.senderRole || 'user',
          notifications: [] as ChatNotification[]
        };
      }
      acc[key].count++;
      acc[key].notifications.push(notif);
      return acc;
    }, {} as Record<string, { count: number; senderName: string; senderRole: string; notifications: ChatNotification[] }>);

    return Object.values(grouped).map(group => {
      const roleLabel = group.senderRole === 'coach' ? 'مربی' : 'کاربر';
      const message = group.count === 1 
        ? `شما 1 پیام از ${roleLabel} ${group.senderName} دریافت کردید`
        : `شما ${group.count} پیام از ${roleLabel} ${group.senderName} دریافت کردید`;
      
      return {
        _id: `aggregated-${group.notifications[0]._id}`,
        type: 'chat_aggregated',
        message,
        relatedId: group.notifications[0].relatedId,
        createdAt: group.notifications[0].createdAt,
        senderName: group.senderName,
        senderRole: group.senderRole,
        count: group.count
      };
    });
  };

  // فیلتر نوتیفیکیشن‌ها بر اساس صفحه
  const nonChatNotifications = notifications.filter(n => n.type !== 'chat');
  const aggregatedChatNotifications = getAggregatedChatNotifications();

  // نمایش نوتیفیکیشن‌ها
  let displayNotifications: Notification[] = [];
  if (isChatPage) {
    displayNotifications = nonChatNotifications;
  } else {
    displayNotifications = [...nonChatNotifications, ...aggregatedChatNotifications];
  }

  const unreadCount = displayNotifications.length;

  return (
    <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>داشبورد</span>
        <span>›</span>
        <span className="text-gray-800 font-medium">{getCurrentPageTitle()}</span>
      </div>

      <div className="flex items-center space-x-4">
        {/* جستجو */}
        <div className="relative">
          <input
            type="text"
            placeholder="جستجو ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* نوتیفیکیشن */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 text-gray-600 hover:text-gray-900 transition"
          >
            <IoMdNotifications className="text-3xl cursor-pointer" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown نوتیفیکیشن */}
          {isNotificationOpen && (
            <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200 max-h-96 overflow-y-auto">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">اعلان‌ها</h3>
                {displayNotifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    علامت‌گذاری همه به عنوان خوانده
                  </button>
                )}
              </div>

              {loadingNotifications ? (
                <div className="py-4 text-center text-gray-500">
                  در حال بارگذاری...
                </div>
              ) : displayNotifications.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  اعلانی یافت نشد
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {displayNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="px-4 py-3 hover:bg-gray-50 relative"
                    >
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                      <p className="text-sm text-gray-700 pr-6">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString(
                          "fa-IR",
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* آواتار + منو */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm hover:bg-red-600 transition cursor-pointer"
          >
            {user?.name.charAt(0).toUpperCase() || "U"}
          </button>

          {/* منوی کشویی */}
          {isMenuOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200 ">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              <Link
                to="/"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaHome className="ml-2 text-gray-500" />
                صفحه اصلی
              </Link>

              <Link
                to="/dashboard/profile"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUser className="ml-2 text-gray-500" />
                پروفایل
              </Link>

              <Link
                to={
                  user?.role === "coach"
                    ? "/dashboard/coach/settings"
                    : user?.role === "admin"
                      ? "/dashboard/admin/settings/club"
                      : "/dashboard/user/settings"
                }
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaCog className="ml-2 text-gray-500" />
                تنظیمات
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 flex items-center"
              >
                <FaSignOutAlt className="ml-2 text-red-500" />
                خروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;