import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../store/hook";
import KpiCard from "./KpiCard";
import { TbMoneybag, TbCalendarEvent, TbShoppingCart } from "react-icons/tb";
import { IoPeopleSharp } from "react-icons/io5";
import api from "../../../services/api";
import useDocumentTitle from '../../../hooks/useDocumentTitle';

interface DashboardSummary {
  activeUsers: number;
  monthlyRevenue: number;
  activeClasses: number;
  newOrders: number;
  recentActivities: Array<{
    type: string;
    message: string;
    time: string;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAppSelector((state) => state.auth);
  useDocumentTitle('داشبورد ادمین');
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/admin/summary');
        setSummary(response.data.data);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4 text-gray-500">📊</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          خطای بارگذاری داده‌ها
        </h3>
        <p className="text-gray-500">لطفاً صفحه را رفرش کنید</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="text-lg font-semibold text-gray-800">خلاصه عملکرد</div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
          >
            <svg
              className="w-5 h-5 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0-2a8.003 8.003 0 00-15.356-2m15.356 2H15"
              />
            </svg>
            به‌روزرسانی
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="کاربران فعال"
          value={summary.activeUsers.toLocaleString("fa-IR")}
          icon={<IoPeopleSharp className="w-8 h-8" />}
          color="bg-blue-500"
        />
        <KpiCard
          title="درآمد ماه جاری"
          value={`${summary.monthlyRevenue.toLocaleString("fa-IR")} تومان`}
          icon={<TbMoneybag className="w-8 h-8" />}
          color="bg-green-500"
        />
        <KpiCard
          title="کلاس‌های فعال"
          value={summary.activeClasses.toString()}
          icon={<TbCalendarEvent className="w-8 h-8" />}
          color="bg-purple-500"
        />
        <KpiCard
          title="سفارشات جدید"
          value={summary.newOrders.toString()}
          icon={<TbShoppingCart className="w-8 h-8" />}
          color="bg-orange-500"
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          فعالیت‌های اخیر
        </h3>
        <div className="space-y-4">
          {summary.recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 rtl:space-x-reverse"
            >
              <div className="shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2 ml-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
