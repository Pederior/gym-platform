import { useState, useRef, useEffect } from "react";
import { IoMdNotifications } from "react-icons/io";
import { FaUser, FaCog, FaSignOutAlt, FaHome, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import api from "../../services/api";
import { IoMoon, IoSunny } from "react-icons/io5";
import { toggleDarkMode } from "../../store/features/darkModeSlice";

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
  "/dashboard/admin": "داشبورد مدیر",
  "/dashboard/coach": "داشبورد مربی",
  "/dashboard/user": "داشبورد کاربر",
  "/dashboard/admin/users": "لیست اعضا",
  "/dashboard/admin/users/create": "افزودن عضو",
  "/dashboard/admin/subscriptions": "وضعیت اشتراک‌ها",
  "/dashboard/admin/invoices": "صورت‌حساب‌ها",
  "/dashboard/admin/payments": "پرداخت‌ها",
  "/dashboard/admin/tickets": "تیکتینگ",
  "/dashboard/admin/tickets/:id": "تیکتینگ",
  "/dashboard/admin/products": "مدیریت کالا",
  "/dashboard/admin/reports": "گزارش‌های مالی",
  "/dashboard/admin/classes": "مدیریت کلاس‌ها",
  "/dashboard/admin/reservations": "رزرو تجهیزات",
  "/dashboard/admin/settings/club": "تنظیمات باشگاه",
  "/dashboard/admin/settings/pricing": "تنظیمات قیمت‌ها",
  "/dashboard/admin/logs": "لاگ‌ها و امنیت",
  "/dashboard/coach/workouts": "برنامه‌های تمرینی",
  "/dashboard/coach/progress": "پیگیری پیشرفت",
  "/dashboard/coach/students": "لیست شاگردان",
  "/dashboard/coach/diet-plans": "برنامه‌های غذایی",
  "/dashboard/coach/articles": "مدیریت مقالات",
  "/dashboard/coach/comments": "کامنت ها",
  "/dashboard/coach/videos": "ویدیوهای آموزشی",
  "/dashboard/user/userstore": "فروشگاه شخصی",
  "/dashboard/coach/classes": "کلاس‌ها",
  "/dashboard/coach/chat": "چت با کاربران",
  "/dashboard/user/workouts": "برنامه تمرینی",
  "/dashboard/user/subscriptions": "خرید اشتراک",
  "/dashboard/user/diet-plans": "برنامه غذایی",
  "/dashboard/user/videos": "ویدیوهای آموزشی",
  "/dashboard/user/classes": "کلاس‌ها",
  "/dashboard/user/progress": "پیگیری پیشرفت",
  "/dashboard/user/payments": "اعضایت و پرداخت",
  "/dashboard/user/tickets": "تیکتینگ",
  "/dashboard/user/chat": "چت با مربی",
  "/dashboard/profile": "پروفایل",
  "/dashboard/profile/edit": "ویرایش پروفایل",
  "/": "صفحه اصلی",
};

interface HeaderProps {
  onToggleSidebar?: () => void;
  isMobile?: boolean;
}

const Header = ({ onToggleSidebar, isMobile }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [isChatPage, setIsChatPage] = useState(false);
  const { darkMode } = useAppSelector((state) => state.darkMode);

  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

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

  useEffect(() => {
    const isChat = location.pathname.includes("/chat");
    setIsChatPage(isChat);
  }, [location.pathname]);

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

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/mark-all-read");
      setNotifications([]);
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

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

  const getAggregatedChatNotifications = (): AggregatedChatNotification[] => {
    const chatNotifs = notifications.filter(
      (n): n is ChatNotification => n.type === "chat",
    );
    if (chatNotifs.length === 0) return [];

    const grouped = chatNotifs.reduce(
      (acc, notif) => {
        const key = `${notif.relatedId}-${notif.senderName || "ناشناس"}`;
        if (!acc[key]) {
          acc[key] = {
            count: 0,
            senderName: notif.senderName || "ناشناس",
            senderRole: notif.senderRole || "user",
            notifications: [] as ChatNotification[],
          };
        }
        acc[key].count++;
        acc[key].notifications.push(notif);
        return acc;
      },
      {} as Record<
        string,
        {
          count: number;
          senderName: string;
          senderRole: string;
          notifications: ChatNotification[];
        }
      >,
    );

    return Object.values(grouped).map((group) => {
      const roleLabel = group.senderRole === "coach" ? "مربی" : "کاربر";
      const message =
        group.count === 1
          ? `شما 1 پیام از ${roleLabel} ${group.senderName} دریافت کردید`
          : `شما ${group.count} پیام از ${roleLabel} ${group.senderName} دریافت کردید`;

      return {
        _id: `aggregated-${group.notifications[0]._id}`,
        type: "chat_aggregated",
        message,
        relatedId: group.notifications[0].relatedId,
        createdAt: group.notifications[0].createdAt,
        senderName: group.senderName,
        senderRole: group.senderRole,
        count: group.count,
      };
    });
  };

  const nonChatNotifications = notifications.filter((n) => n.type !== "chat");
  const aggregatedChatNotifications = getAggregatedChatNotifications();

  let displayNotifications: Notification[] = [];
  if (isChatPage) {
    displayNotifications = nonChatNotifications;
  } else {
    displayNotifications = [
      ...nonChatNotifications,
      ...aggregatedChatNotifications,
    ];
  }

  const unreadCount = displayNotifications.length;

  return (
    <header className="bg-background border-b border-border px-4 py-3 flex items-center justify-between">
      {/* دکمه منو برای موبایل */}
      {isMobile && onToggleSidebar && (
        <button
          onClick={onToggleSidebar}
          className="p-2 text-foreground hover:text-primary transition-colors mr-2"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>داشبورد</span>
        <span>›</span>
        <span className="text-foreground font-medium">
          {getCurrentPageTitle()}
        </span>
      </div>

      <div className="flex items-center space-x-3">
        {/* دکمه Dark Mode */}
        <button
          onClick={handleToggleDarkMode}
          className="p-2 rounded-full bg-muted hover:bg-secondary transition-colors cursor-pointer"
          title={darkMode ? "حالت روشن" : "حالت تاریک"}
        >
          {darkMode ? (
            <IoSunny className="text-yellow-400 text-xl" />
          ) : (
            <IoMoon className="text-foreground text-xl" />
          )}
        </button>

        {/* نوتیفیکیشن */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 text-muted-foreground hover:text-foreground transition"
          >
            <IoMdNotifications className="text-2xl md:text-3xl cursor-pointer" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown نوتیفیکیشن */}
          {isNotificationOpen && (
            <div className="absolute left-0 mt-2 w-80 bg-popover rounded-lg shadow-lg py-2 z-50 border border-border max-h-96 overflow-y-auto">
              <div className="px-4 py-3 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold text-popover-foreground">
                  اعلان‌ها
                </h3>
                {displayNotifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    علامت‌گذاری همه به عنوان خوانده
                  </button>
                )}
              </div>

              {loadingNotifications ? (
                <div className="py-4 text-center text-muted-foreground">
                  در حال بارگذاری...
                </div>
              ) : displayNotifications.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  اعلانی یافت نشد
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {displayNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="px-4 py-3 hover:bg-muted relative"
                    >
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-destructive"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                      <p className="text-sm text-popover-foreground pr-6">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
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
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs md:text-sm hover:bg-primary/80 transition cursor-pointer"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="پروفایل"
                className="w-full h-full object-cover rounded-full border border-primary shadow-md"
              />
            ) : user?.name ? (
              <span className="text-primary-foreground font-medium text-xs md:text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <span className="text-primary-foreground text-xs">👤</span>
            )}
          </button>

          {/* منوی کشویی */}
          {isMenuOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-popover rounded-lg shadow-lg py-2 z-50 border border-border">
              <div className="px-4 py-2 border-b border-border">
                <p className="font-medium text-popover-foreground">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>

              <Link
                to="/"
                className="px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaHome className="ml-2 text-muted-foreground" />
                صفحه اصلی
              </Link>

              <Link
                to="/dashboard/profile"
                className="px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUser className="ml-2 text-muted-foreground" />
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
                className="px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaCog className="ml-2 text-muted-foreground" />
                تنظیمات
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center"
              >
                <FaSignOutAlt className="ml-2 text-destructive" />
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
