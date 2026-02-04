import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hook";
import { logout } from "../../store/features/authSlice";
import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { TbSmartHome, TbUser, TbBellFilled } from "react-icons/tb";
import {
  FaUser,
  FaCog,
  FaDollarSign,
  FaQuestion,
  FaSignOutAlt,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import api from "../../services/api";
import type { Product } from "../../types";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);

  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { user, token } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navItems = [
    { title: "خانه", subtitle: "صفحه اصلی", route: "/" },
    { title: "درباره ما", subtitle: "ما کی هستیم", route: "/about" },
    { title: "کلاس‌ها", subtitle: "آغاز کنید", route: "/classes" },
    { title: "مقالات", subtitle: "آموزش‌ها", route: "/articles" },
    { title: "فروشگاه", subtitle: "محصولات", route: "/store" },
  ];

  // بارگذاری سبد خرید از localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [isCartOpen]);

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
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // دریافت نوتیفیکیشن‌ها
  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
      setNotificationCount(res.data.notifications?.length || 0);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
      setNotificationCount(0);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // حذف نوتیفیکیشن
  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter((n) => n._id !== id));
      setNotificationCount((prev) => prev - 1);
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // علامت‌گذاری همه به عنوان خوانده
  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/mark-all-read");
      setNotifications([]);
      setNotificationCount(0);
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  // حذف محصول از سبد خرید
  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item._id !== productId);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // خالی کردن سبد خرید
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // محاسبه مجموع قیمت
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  // بارگذاری نوتیفیکیشن‌ها وقتی باز می‌شه
  useEffect(() => {
    if (isNotificationOpen) {
      fetchNotifications();
    }
  }, [isNotificationOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-linear-to-r from-black via-zinc-900/20 to-red-600/90 flex shadow-sm z-50 ">
      <div className="flex justify-between h-24 w-full px-5">
        <div className="flex items-center gap-2 px-2">
          <Link to="/" className="flex items-center no-underline select-none">
            <img
              src="/images/Logo2.png"
              alt="FynixClub"
              className="
                h-20
                w-auto
                object-contain
                transition
                duration-300
                hover:scale-105
              "
            />
          </Link>
        </div>

        <div className="flex items-center justify-center space-x-6 mt-4">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.route;
            return (
              <div key={idx} className="text-center h-full">
                <Link
                  to={item.route}
                  className={`flex flex-col justify-around h-full text-right group ${
                    isActive ? "text-red-500" : "text-gray-300"
                  }`}
                >
                  <span className="block text-base font-medium group-hover:text-red-500 transition-colors duration-200">
                    {item.title}
                  </span>
                  <span
                    className={`block text-xs group-hover:text-red-500 transition-colors duration-200 ${
                      isActive ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {item.subtitle}
                  </span>

                  {/* خط hover - از وسط به کنارها */}
                  {!isActive && (
                    <div className="relative mt-1">
                      <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-red-500 origin-center scale-x-0 group-hover:scale-x-100 group-hover:left-0 group-hover:w-full transition-all duration-300"></div>
                    </div>
                  )}

                  {/* خط فعال دائمی */}
                  {isActive && (
                    <div className="w-full h-0.5 bg-red-500 mx-auto mt-1"></div>
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {token && user ? (
            <div className="relative flex items-center gap-2">
              {/* سبد خرید */}
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                {cart.length > 0 && (
                  <span className="absolute right-0 top-0 text-white bg-red-500 rounded-full px-1.5 py-0.5 text-[10px]">
                    {cart.length}
                  </span>
                )}
                <RiShoppingBag4Fill className="text-white text-2xl" />
              </button>

              {/* نوتیفیکیشن */}
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                {notificationCount > 0 && (
                  <span className="absolute right-0 top-0 text-white bg-red-500 rounded-full px-1.5 py-0.5 text-[10px]">
                    {notificationCount}
                  </span>
                )}
                <TbBellFilled className="text-white text-2xl" />
              </button>

              {/* منو کاربر */}
              <div ref={menuRef}>
                <button
                  onClick={toggleMenu}
                  className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="پروفایل"
                      className="w-full h-full object-cover rounded-full border border-red-500 shadow-md"
                    />
                  ) : (
                    <span className="text-white"><FaUser /></span>
                  )}
                </button>

                {isMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-linear-to-b from-red-600/50 to-black text-white rounded-lg shadow-lg py-2 z-10">
                    <div className="px-4 py-2 border-b border-red-700">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>

                    <Link
                      to={
                        user.role === "coach"
                          ? "/dashboard/coach"
                          : user.role === "admin"
                            ? "/dashboard/admin"
                            : "/dashboard/user"
                      }
                      className="block px-4 py-2 text-sm hover:bg-red-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="inline-block mr-2">
                        <TbSmartHome />
                      </span>{" "}
                      داشبورد
                    </Link>

                    <Link
                      to="/dashboard/profile"
                      className="block px-4 py-2 text-sm hover:bg-red-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="inline-block mr-2">
                        <TbUser />
                      </span>{" "}
                      پروفایل
                    </Link>

                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm hover:bg-red-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="inline-block mr-2">
                        <FaCog />
                      </span>{" "}
                      تنظیمات
                    </Link>

                    <Link
                      to="/pricing"
                      className="block px-4 py-2 text-sm hover:bg-red-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="inline-block mr-2">
                        <FaDollarSign />
                      </span>{" "}
                      قیمت‌ها دوره ها
                    </Link>

                    <Link
                      to="/faq"
                      className="block px-4 py-2 text-sm hover:bg-red-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="inline-block mr-2">
                        <FaQuestion />
                      </span>{" "}
                      سوالات متداول
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-center mt-2 px-4 py-2 text-sm bg-red-800 text-white hover:bg-red-900 hover:text-white rounded-md"
                    >
                      <span className="inline-block mr-2">
                        <FaSignOutAlt />
                      </span>{" "}
                      خروج
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Link
                to="/login"
                className="text-sm ml-2 font-medium text-white hover:text-red-600 no-underline"
              >
                ورود
              </Link>
              <Link
                to="/register"
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 no-underline"
              >
                ثبت‌نام
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Modal نوتیفیکیشن */}
      {isNotificationOpen && (
        <div
          ref={notificationRef}
          className="fixed top-36 left-16 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200 max-h-96 overflow-y-auto"
        >
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">اعلان‌ها</h3>
            {notifications.length > 0 && (
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
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              اعلانی یافت نشد
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
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

      {/* Modal سبد خرید */}
      {isCartOpen && (
        <div
          ref={cartRef}
          className="fixed top-36 left-16 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200 max-h-[calc(100vh-150px)] overflow-y-auto"
        >
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              سبد خرید ({cart.length})
            </h3>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <RiShoppingBag4Fill className="text-4xl mx-auto mb-4 text-gray-300" />
              سبد خرید شما خالی است
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="px-4 py-3 hover:bg-gray-50 relative"
                >
                  <button
                    onClick={() => removeFromCart(item._id!)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
                    title="حذف"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                  <div className="flex items-start gap-3 pr-6">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">
                          بدون تصویر
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.category}
                      </p>
                      <p className="text-sm font-bold text-red-500 mt-2">
                        {item.price.toLocaleString()} تومان
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">مجموع کل:</span>
                  <span className="font-bold text-lg text-red-500">
                    {calculateTotal().toLocaleString()} تومان
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="flex-1 px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    خالی کردن سبد
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate("/cart");
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    ادامه خرید
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
