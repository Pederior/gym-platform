import { useEffect, useState } from 'react';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  supervisedUsers: number;
  createdWorkouts: number;
  activeClasses: number;
}

export default function CoachDashboard() {
  useDocumentTitle('داشبورد مربی');
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/coach/summary');
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">داشبورد مربی</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-600 text-sm font-medium mb-2">کاربران زیر نظر</h3>
          <p className="text-3xl font-bold text-gray-800">{stats?.supervisedUsers || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-600 text-sm font-medium mb-2">برنامه‌های ایجاد شده</h3>
          <p className="text-3xl font-bold text-gray-800">{stats?.createdWorkouts || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-600 text-sm font-medium mb-2">کلاس‌های فعال</h3>
          <p className="text-3xl font-bold text-gray-800">{stats?.activeClasses || 0}</p>
        </div>
      </div>

      {/* Action Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <h2 className="font-bold text-lg text-gray-800">برنامه‌های تمرینی</h2>
          <button 
            onClick={() => navigate('/dashboard/coach/workouts/create')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            ایجاد برنامه جدید
          </button>
        </div>
        <p className="text-gray-600 text-sm">
          شما می‌توانید برنامه‌های تمرینی شخصی‌سازی‌شده برای کاربران خود طراحی و مدیریت کنید.
        </p>
      </div>
    </div>
  );
}