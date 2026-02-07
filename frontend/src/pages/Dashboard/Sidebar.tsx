import { useState, useMemo, type ReactNode } from "react";
import { TbSmartHome, TbUser } from "react-icons/tb";
import { GiMuscleUp } from "react-icons/gi";
import { useAppSelector } from "../../store/hook";
import { Link } from "react-router-dom";
import {
  MdOutlineJoinFull,
  MdClass,
  MdOutlineSecurity,
  MdPayment,
  MdManageAccounts,
  MdSettingsInputComponent,
  MdStore,
  MdOutlineOndemandVideo 
} from "react-icons/md";
import {
  FaChartLine,
  FaPersonCirclePlus,
  FaFileInvoiceDollar,
  FaMoneyBillTransfer,
} from "react-icons/fa6";
import { AiFillDollarCircle, AiOutlineDollar } from "react-icons/ai";
import { IoChatboxEllipses, IoPeopleSharp, IoFastFood, IoTicketSharp   } from "react-icons/io5";
import { FaClipboardList, FaChartBar } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { FaCalendarPlus } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { BsFillCartPlusFill } from "react-icons/bs";
import { TiShoppingCart } from "react-icons/ti";

interface MenuItem {
  title: string;
  icon: ReactNode; // ✅ ReactNode برای آیکون اصلی
  to?: string;
  children?: {
    label: string;
    icon: ReactNode; // ✅ ReactNode برای آیکون زیرمنو
    to: string;
  }[];
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role || "user";

  const toggleMenu = (menu: string) => {
    if (isCollapsed) {
      onToggle(); 
      setTimeout(() => {
        setOpenMenu(openMenu === menu ? null : menu);
      }, 100);
    } else {
      setOpenMenu(openMenu === menu ? null : menu);
    }
  };

  // const toggleSidebar = () => {
  //   setIsCollapsed(!isCollapsed);
  //   if (!isCollapsed) {
  //     setOpenMenu(null);
  //   }
  // };

  const menuItems: MenuItem[] = useMemo(() => {
    if (role === "admin") {
      return [
        { title: "داشبورد", icon: <TbSmartHome />, to: "/dashboard/admin" },
        {
          title: "اعضا",
          icon: <TbUser />,
          children: [
            {
              label: "لیست اعضا",
              icon: <IoPeopleSharp />,
              to: "/dashboard/admin/users",
            },
            {
              label: "افزودن عضو",
              icon: <FaPersonCirclePlus />,
              to: "/dashboard/admin/users/create",
            },
            {
              label: "وضعیت اشتراک‌ها",
              icon: <FaChartBar />,
              to: "/dashboard/admin/subscriptions",
            },
            {
              label: "تیکتینگ",
              icon: <IoTicketSharp />,
              to: "/dashboard/admin/tickets",
            },
          ],
        },
        {
          title: "امور مالی",
          icon: <AiOutlineDollar />,
          children: [
            {
              label: "صورت‌حساب‌ها",
              icon: <FaFileInvoiceDollar />,
              to: "/dashboard/admin/invoices",
            },
            {
              label: "پرداخت‌ها",
              icon: <MdPayment />,
              to: "/dashboard/admin/payments",
            },
            {
              label: "گزارش‌های مالی",
              icon: <TbReportSearch />,
              to: "/dashboard/admin/reports",
            },
          ],
        },
        {
          title: "برنامه‌ها",
          icon: <MdClass />,
          children: [
            {
              label: "مدیریت کلاس‌ها",
              icon: <MdManageAccounts />,
              to: "/dashboard/admin/classes",
            },
            {
              label: "رزرو تجهیزات / سالن‌ها",
              icon: <FaCalendarPlus />,
              to: "/dashboard/admin/reservations",
            },
          ],
        },
        {
          title: "فروشگاه",
          icon: <MdStore />,
          children: [
            {
              label: "مدیریت کالا",
              icon: <BsFillCartPlusFill />,
              to: "/dashboard/admin/products",
            },
          ],
        },
        {
          title: "تنظیمات",
          icon: <IoMdSettings />,
          to: "/dashboard/admin/settings",
          children: [
            {
              label: "تنظیمات باشگاه",
              icon: <MdSettingsInputComponent />,
              to: "/dashboard/admin/settings/club",
            },
            {
              label: "تنظیمات اشتراک و قیمت‌ها",
              icon: <FaMoneyBillTransfer />,
              to: "/dashboard/admin/settings/pricing",
            },
          ],
        },
        {
          title: "لاگ‌ها و امنیت",
          icon: <MdOutlineSecurity />,
          to: "/dashboard/admin/logs",
        },
      ];
    } else if (role === "coach") {
      return [
        { title: "داشبورد", icon: <TbSmartHome />, to: "/dashboard/coach" },
        { title: "شاگردان", icon: <TbSmartHome />, to: "/dashboard/coach/students" },
        {
          title: "برنامه‌های تمرینی",
          icon: <GiMuscleUp />,
          children: [
            {
              label: "لیست برنامه‌ها",
              icon: <FaClipboardList />,
              to: "/dashboard/coach/workouts",
            },
            {
              label: "پیگیری پیشرفت کاربران",
              icon: <FaChartLine />,
              to: "/dashboard/coach/progress",
            },
          ],
        },
        {
          title: "برنامه های غذایی ",
          icon: <IoFastFood />,
          to: "/dashboard/coach/diet-plans",
        },
        {
          title: "ویدیوهای آموزشی ",
          icon: <MdOutlineOndemandVideo  />,
          to: "/dashboard/coach/videos",
        },
        {
          title: "کلاس‌ها",
          icon: <MdClass />,
          to: "/dashboard/coach/classes",
        },
        {
          title: "چت با شاگردان",
          icon: <IoChatboxEllipses />,
          to: "/dashboard/coach/chat",
        },
      ];
    } else {
      return [
        { title: "داشبورد", icon: <TbSmartHome />, to: "/dashboard/user" },
        {
          title: "خرید اشتراک",
          icon: <MdOutlineJoinFull />,
          to: "/dashboard/user/subscriptions",
        },
        {
          title: "فروشگاه شخصی",
          icon: <TiShoppingCart />,
          to: "/dashboard/user/userstore",
        },
        {
          title: "برنامه تمرینی",
          icon: <GiMuscleUp />,
          to: "/dashboard/user/workouts",
        },
        {
          title: "برنامه غذایی",
          icon: <IoFastFood  />,
          to: "/dashboard/user/diet-plans",
        },
        {
          title: "ویدیو های آموزشی",
          icon: <MdOutlineOndemandVideo   />,
          to: "/dashboard/user/videos",
        },
        {
          title: "کلاس‌ها",
          icon: <MdClass />,
          to: "/dashboard/user/classes",
        },
        // {
        //   title: "پیگیری پیشرفت",
        //   icon: <FaChartLine />,
        //   to: "/dashboard/user/progress",
        // },
        {
          title: "چت با مربی",
          icon: <IoChatboxEllipses />,
          to: "/dashboard/user/chat",
        },
        {
          title: "تیکتینگ",
          icon: <IoTicketSharp />,
          to: "/dashboard/user/tickets",
        },
        {
          title: "اشتراک و پرداخت",
          icon: <AiFillDollarCircle />,
          to: "/dashboard/user/payments",
        },
      ];
    }
  }, [role]);

  return (
    <aside 
      className={`h-screen fixed right-0 top-0 overflow-y-auto transition-all duration-300 z-50 ${
        isCollapsed 
          ? 'w-16 bg-red-800' 
          : 'w-64 bg-red-600'
      }`}
    >
      <div className={`p-4 border-b border-red-500 flex items-center justify-between ${
        isCollapsed ? 'justify-center' : ''
      }`}>
        {!isCollapsed && (
          <Link to="/">
            <h1 className="text-xl font-bold text-white">فینیکس کلاب</h1>
          </Link>
        )}
        <button 
          onClick={onToggle}
          className="w-8 h-8 bg-red-700/90 rounded-full flex items-center justify-center cursor-pointer text-white hover:bg-red-700"
        >
          {isCollapsed ? '»' : '«'}
        </button>
      </div>

      <nav className="p-2 space-y-1">
        {menuItems.map((item, idx) => (
          <div key={idx}>
            {item.children && item.children.length > 0 ? (
              <button
                onClick={() => toggleMenu(item.title)} // ✅ تغییر اینجا
                className={`flex items-center w-full p-3 rounded-lg hover:bg-red-700/90 transition text-white ${
                  isCollapsed ? 'justify-center px-0' : 'text-right'
                }`}
                title={isCollapsed ? item.title : undefined}
              >
                <span className={`${isCollapsed ? 'text-xl' : 'text-xl ml-2'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <>
                    <span className="flex-1 mr-2">{item.title}</span>
                    <span
                      className={`transform transition-transform text-xs ${
                        openMenu === item.title ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </>
                )}
              </button>
            ) : (
              <Link
                to={item.to || "#"}
                className={`flex items-center w-full p-3 rounded-lg hover:bg-red-700/90 transition text-white ${
                  isCollapsed ? 'justify-center px-0' : 'text-right'
                }`}
                title={isCollapsed ? item.title : undefined}
              >
                <span className={`${isCollapsed ? 'text-xl' : 'text-xl ml-2'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="flex-1 mr-2">{item.title}</span>
                )}
              </Link>
            )}

            {/* زیرمنوها - فقط در حالت expanded */}
            {item.children &&
              item.children.length > 0 &&
              openMenu === item.title &&
              !isCollapsed && (
                <div
                  className="pr-4 mt-1 space-y-1 mr-2 overflow-hidden"
                  style={{
                    maxHeight: openMenu === item.title ? "500px" : "0",
                    opacity: openMenu === item.title ? 1 : 0,
                    transition: "max-height 0.3s ease, opacity 0.2s ease",
                  }}
                >
                  {item.children.map((child, childIdx) => (
                    <Link
                      key={childIdx}
                      to={child.to}
                      className="w-full flex items-center p-2 text-sm rounded hover:bg-red-700 text-white transition text-right"
                    >
                      <span className="text-lg ml-2">{child.icon}</span>
                      <span>{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
