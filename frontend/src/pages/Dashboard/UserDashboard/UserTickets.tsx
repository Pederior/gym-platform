// components/UserTickets.tsx
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
  createdAt: string;
}

export default function UserTickets() {
  useDocumentTitle('تیکت‌های من');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets');
      console.log(res)
      setTickets(res.data.tickets || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در بارگذاری تیکت‌ها');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return <div className="p-8 text-center">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">تیکت‌های من</h1>
        <Link
          to="/dashboard/user/tickets/create"
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          + ایجاد تیکت جدید
        </Link>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎫</div>
            <h3 className="font-bold text-gray-800 mb-2">تیکتی وجود ندارد</h3>
            <p className="text-gray-600">برای شروع، تیکت جدیدی ایجاد کنید</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <Card key={ticket._id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{ticket.title}</h3>
                  <div className="flex gap-2 mt-2">
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString('fa-IR')}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Link
                  to={`/dashboard/user/tickets/${ticket._id}`}
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