import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';
import Card from '../../../components/ui/Card';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

interface Ticket {
  _id: string;
  title: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  user: {
    name: string;
    email: string;
  };
  admin?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function AdminTickets() {
  useDocumentTitle('مدیریت تیکت‌ها');
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all'
  });

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.category !== 'all') queryParams.append('category', filters.category);
      if (filters.priority !== 'all') queryParams.append('priority', filters.priority);
      
      const url = `/admin/tickets${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const res = await api.get(url);
      setTickets(res.data.tickets || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در بارگذاری تیکت‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      open: { label: 'باز', color: 'bg-blue-100 text-blue-800' },
      in_progress: { label: 'در حال بررسی', color: 'bg-yellow-100 text-yellow-800' },
      resolved: { label: 'حل شده', color: 'bg-green-100 text-green-800' },
      closed: { label: 'بسته شده', color: 'bg-gray-100 text-gray-800' }
    };
    const { label, color } = config[status] || config.open;
    return <span className={`px-2 py-1 rounded-full text-xs ${color}`}>{label}</span>;
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { label: string; color: string }> = {
      low: { label: 'پایین', color: 'bg-green-100 text-green-800' },
      medium: { label: 'متوسط', color: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'بالا', color: 'bg-orange-100 text-orange-800' },
      urgent: { label: 'فوری', color: 'bg-red-100 text-red-800' }
    };
    const { label, color } = config[priority] || config.medium;
    return <span className={`px-2 py-1 rounded-full text-xs ${color}`}>{label}</span>;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      technical: 'فنی',
      financial: 'مالی',
      subscription: 'اشتراک',
      other: 'سایر'
    };
    return labels[category] || category;
  };

  if (loading) {
    return <div className="p-8 text-center">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت تیکت‌ها</h1>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="all">همه</option>
              <option value="open">باز</option>
              <option value="in_progress">در حال بررسی</option>
              <option value="resolved">حل شده</option>
              <option value="closed">بسته شده</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="all">همه</option>
              <option value="technical">فنی</option>
              <option value="financial">مالی</option>
              <option value="subscription">اشتراک</option>
              <option value="other">سایر</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اولویت</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="all">همه</option>
              <option value="low">پایین</option>
              <option value="medium">متوسط</option>
              <option value="high">بالا</option>
              <option value="urgent">فوری</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎫</div>
            <h3 className="font-bold text-gray-800 mb-2">تیکتی یافت نشد</h3>
            <p className="text-gray-600">با توجه به فیلترهای اعمال شده، تیکتی وجود ندارد</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <Card key={ticket._id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{ticket.title}</h3>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                    <span className="text-sm text-gray-600">
                      {getCategoryLabel(ticket.category)}
                    </span>
                  </div>
                  <div className="mt-3 text-sm">
                    <div className="text-gray-700">
                      <strong>کاربر:</strong> {ticket.user.name} ({ticket.user.email})
                    </div>
                    {ticket.admin && (
                      <div className="text-gray-700 mt-1">
                        <strong>ادمین:</strong> {ticket.admin.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString('fa-IR')}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Link
                  to={`/dashboard/admin/tickets/${ticket._id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  مشاهده جزئیات
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}