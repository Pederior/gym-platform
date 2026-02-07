import { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'coach' | 'admin';
}

interface Log {
  _id: string;
  user: User;
  action: string;
  description?: string;
  metadata?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  timestamp: string;
}

const actionLabels: Record<string, string> = {
  login: 'ورود',
  logout: 'خروج',
  register: 'ثبت‌نام',
  create_user: 'ایجاد کاربر',
  update_user: 'ویرایش کاربر',
  delete_user: 'حذف کاربر',
  create_subscription: 'خرید اشتراک',
  update_subscription: 'تمدید اشتراک',
  cancel_subscription: 'لغو اشتراک',
  create_workout: 'ایجاد برنامه تمرینی',
  complete_workout: 'تکمیل تمرین',
  update_workout_progress: 'به‌روزرسانی پیشرفت',
  create_diet_plan: 'ایجاد برنامه غذایی',
  complete_diet_plan: 'تکمیل برنامه غذایی',
  create_ticket: 'ایجاد تیکت',
  reply_ticket: 'پاسخ به تیکت',
  close_ticket: 'بستن تیکت',
  create_class: 'ایجاد کلاس',
  reserve_class: 'رزرو کلاس',
  cancel_reservation: 'لغو رزرو',
  upload_video: 'آپلود ویدیو',
  view_video: 'مشاهده ویدیو',
  update_settings: 'به‌روزرسانی تنظیمات',
  payment_success: 'پرداخت موفق',
  payment_failed: 'پرداخت ناموفق'
};

const actionColors: Record<string, string> = {
  login: 'bg-green-100 text-green-800',
  logout: 'bg-gray-100 text-gray-800',
  register: 'bg-blue-100 text-blue-800',
  create_subscription: 'bg-purple-100 text-purple-800',
  payment_success: 'bg-green-100 text-green-800',
  payment_failed: 'bg-red-100 text-red-800',
  create_ticket: 'bg-yellow-100 text-yellow-800',
  complete_workout: 'bg-emerald-100 text-emerald-800'
};

export default function AdminLogs() {
  useDocumentTitle('لاگ‌ها و امنیت');
  
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: '',
    userId: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    fetchLogs();
  }, [filters, pagination.page]);

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.action) params.append('action', filters.action);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());
      
      const res = await api.get(`/admin/logs?${params.toString()}`);
      setLogs(res.data.logs);
      setPagination(res.data.pagination);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در بارگذاری لاگ‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const getActionBadge = (action: string) => {
    const label = actionLabels[action] || action;
    const color = actionColors[action] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const getUserRoleBadge = (role: string) => {
    const config: Record<string, { label: string; color: string }> = {
      admin: { label: 'مدیر', color: 'bg-red-100 text-red-800' },
      coach: { label: 'مربی', color: 'bg-blue-100 text-blue-800' },
      user: { label: 'کاربر', color: 'bg-gray-100 text-gray-800' }
    };
    const { label, color } = config[role] || config.user;
    return <span className={`px-1 py-0.5 rounded text-xs ${color}`}>{label}</span>;
  };

  if (loading) {
    return <div className="p-8 text-center">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">لاگ‌ها و امنیت</h1>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عملیات</label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="">همه عملیات</option>
              {Object.entries(actionLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">کاربر</label>
            <input
              type="text"
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              placeholder="ID کاربر"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">از تاریخ</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تا تاریخ</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-right text-sm text-gray-500 border-b">
                <th className="pb-3">کاربر</th>
                <th className="pb-3">عملیات</th>
                <th className="pb-3">توضیحات</th>
                <th className="pb-3">IP</th>
                <th className="pb-3">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id} className="border-b hover:bg-gray-50">
                  <td>
                    <div className="font-medium">{log.user.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      {log.user.email}
                      {getUserRoleBadge(log.user.role)}
                    </div>
                  </td>
                  <td>{getActionBadge(log.action)}</td>
                  <td className="max-w-xs truncate">
                    {log.description || '-'}
                  </td>
                  <td className="text-xs">
                    {log.ip || '-'}
                    {log.userAgent && (
                      <div className="text-gray-400 mt-1 truncate" title={log.userAgent}>
                        {log.userAgent.substring(0, 30)}...
                      </div>
                    )}
                  </td>
                  <td>{new Date(log.timestamp).toLocaleString('fa-IR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-4 space-x-2 space-x-reverse">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  page === pagination.page
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}