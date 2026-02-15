import { useState, useMemo, type ReactNode, useEffect, useCallback } from "react";
import { TbSmartHome, TbUser } from "react-icons/tb";
import { GiMuscleUp } from "react-icons/gi";
import { useAppSelector } from "../../store/hook";
import { Link, useNavigate } from "react-router-dom";
import {
  MdOutlineJoinFull,
  MdClass,
  MdOutlineSecurity,
  MdPayment,
  MdManageAccounts,
  MdSettingsInputComponent,
  MdStore,
  MdOutlineOndemandVideo,
  MdArticle,
} from "react-icons/md";
import {
  FaChartLine,
  FaPersonCirclePlus,
  FaFileInvoiceDollar,
  FaMoneyBillTransfer,
} from "react-icons/fa6";
import { AiFillDollarCircle, AiOutlineDollar } from "react-icons/ai";
import {
  IoChatboxEllipses,
  IoPeopleSharp,
  IoFastFood,
  IoTicketSharp,
} from "react-icons/io5";
import { FaClipboardList, FaChartBar } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { FaCalendarPlus } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { BsFillCartPlusFill } from "react-icons/bs";
import { TiShoppingCart } from "react-icons/ti";
import { GrArticle } from "react-icons/gr";
import { LiaComment } from "react-icons/lia";

interface MenuItem {
  title: string;
  icon: ReactNode;
  to?: string;
  children?: {
    label: string;
    icon: ReactNode;
    to: string;
  }[];
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

const Sidebar = ({ isCollapsed, onToggle, isMobile = false }: SidebarProps) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role || "user";
  const navigate = useNavigate();

  const toggleMenu = (menu: string) => {
    if (isMobile && !isCollapsed) {
      setOpenMenu(openMenu === menu ? null : menu);
      return;
    }

    if (isCollapsed) {
      onToggle();
      setTimeout(() => {
        setOpenMenu(openMenu === menu ? null : menu);
      }, 100);
    } else {
      setOpenMenu(openMenu === menu ? null : menu);
    }
  };

  const closeSidebar = useCallback(() => {
    if (isMobile && !isCollapsed) {
      onToggle();
      setOpenMenu(null);
    }
  }, [isMobile, isCollapsed, onToggle, setOpenMenu]);

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
          title: "مقالات",
          icon: <MdArticle />,
          children: [
            {
              label: "مدیریت مقالات",
              icon: <GrArticle />,
              to: "/dashboard/admin/articles",
            },
            {
              label: "کامنت ها",
              icon: <LiaComment />,
              to: "/dashboard/admin/comments",
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
        { title: "شاگردان", icon: <TbUser />, to: "/dashboard/coach/students" },
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
          icon: <MdOutlineOndemandVideo />,
          to: "/dashboard/coach/videos",
        },
        {
          title: "مقالات",
          icon: <MdArticle />,
          children: [
            {
              label: "مدیریت مقالات",
              icon: <GrArticle />,
              to: "/dashboard/coach/articles",
            },
            {
              label: "کامنت ها",
              icon: <LiaComment />,
              to: "/dashboard/coach/comments",
            },
          ],
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
          icon: <IoFastFood />,
          to: "/dashboard/user/diet-plans",
        },
        {
          title: "ویدیو های آموزشی",
          icon: <MdOutlineOndemandVideo />,
          to: "/dashboard/user/videos",
        },
        {
          title: "کلاس‌ها",
          icon: <MdClass />,
          to: "/dashboard/user/classes",
        },
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

  useEffect(() => {
    if (isMobile && !isCollapsed) {
      const handleClickOutside = (e: MouseEvent) => {
        const sidebar = document.querySelector('[data-sidebar]');
        if (sidebar && !sidebar.contains(e.target as Node)) {
          closeSidebar();
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, isCollapsed, closeSidebar]);

  if (isMobile && isCollapsed) return null;

  return (
    <aside
      data-sidebar
      className={`h-screen fixed right-0 top-0 overflow-y-auto transition-all duration-300 z-50 ${
        isCollapsed ? "w-16 bg-primary" : "w-64 bg-primary"
      } ${isMobile ? "shadow-lg" : ""}`}
    >
      <div
        className={`p-3 md:p-4 border-b border-primary-50 flex items-center justify-between ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        {!isCollapsed && (
          <Link to="/" className="no-underline">
            <h1 className="text-lg font-bold text-primary-foreground truncate">
              فینیکس کلاب
            </h1>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="w-7 h-7 md:w-8 md:h-8 bg-primary-80 rounded-full flex items-center justify-center cursor-pointer text-primary-foreground hover:bg-primary transition-colors text-xs md:text-base"
        >
          {isCollapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="p-2 space-y-1">
        {menuItems.map((item, idx) => (
          <div key={idx}>
            {item.children && item.children.length > 0 ? (
              <button
                onClick={() => toggleMenu(item.title)}
                className={`flex items-center w-full p-2 md:p-3 rounded-lg hover:bg-primary-80 transition-colors text-primary-foreground ${
                  isCollapsed ? "justify-center px-0" : "text-right"
                }
                  ${isMobile && !isCollapsed ? "py-3 text-base" : ""}`}
                title={isCollapsed ? item.title : undefined}
              >
                <span
                  className={`${isCollapsed ? "text-lg md:text-xl" : "text-lg md:text-xl ml-2"}`}
                >
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <>
                    <span className="flex-1 mr-2 text-sm md:text-base">
                      {item.title}
                    </span>
                    <span
                      className={`transform transition-transform text-xs ${
                        openMenu === item.title
                          ? "rotate-180 text-primary-foreground"
                          : "text-primary-foreground-70"
                      }`}
                    >
                      ▼
                    </span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (item.to) {
                    navigate(item.to);
                    closeSidebar();
                  }
                }}
                className={`flex items-center w-full p-2 md:p-3 rounded-lg hover:bg-primary-80 transition-colors text-primary-foreground ${
                  isCollapsed ? "justify-center px-0" : "text-right"
                } ${isMobile && !isCollapsed ? "py-3 text-base" : ""}`}
                title={isCollapsed ? item.title : undefined}
              >
                <span
                  className={`${isCollapsed ? "text-lg md:text-xl" : "text-lg md:text-xl ml-2"}`}
                >
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="flex-1 mr-2 text-sm md:text-base">
                    {item.title}
                  </span>
                )}
              </button>
            )}

            {item.children &&
              item.children.length > 0 &&
              openMenu === item.title &&
              !isCollapsed && (
                <div
                  className="pr-3 md:pr-4 mt-1 space-y-1 mr-2 overflow-hidden bg-primary-80 rounded-xl md:rounded-2xl"
                  style={{
                    maxHeight: openMenu === item.title ? "500px" : "0",
                    opacity: openMenu === item.title ? 1 : 0,
                    transition: "max-height 0.3s ease, opacity 0.2s ease",
                  }}
                >
                  {item.children.map((child, childIdx) => (
                    <button
                      key={childIdx}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(child.to);
                        closeSidebar();
                      }}
                      className={`w-full flex items-center p-2 text-xs md:text-sm rounded hover:bg-primary-90 text-primary-foreground transition-colors text-right ${
                        isMobile ? "py-2 text-base" : ""
                      }`}
                    >
                      <span className="text-base md:text-lg ml-2">
                        {child.icon}
                      </span>
                      <span>{child.label}</span>
                    </button>
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
