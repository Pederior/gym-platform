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
      setTickets(res.data.tickets || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در بارگذاری تیکت‌ها');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      open: { label: 'باز', color: 'bg-primary/10 text-primary' },
      in_progress: { label: 'در حال بررسی', color: 'bg-warning/10 text-warning' },
      resolved: { label: 'حل شده', color: 'bg-success/10 text-success' },
      closed: { label: 'بسته شده', color: 'bg-muted/50 text-muted-foreground' }
    };
    const { label, color } = config[status] || config.open;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>;
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { label: string; color: string }> = {
      low: { label: 'پایین', color: 'bg-success/10 text-success' },
      medium: { label: 'متوسط', color: 'bg-warning/10 text-warning' },
      high: { label: 'بالا', color: 'bg-orange-500/10 text-orange-500' },
      urgent: { label: 'فوری', color: 'bg-destructive/10 text-destructive' }
    };
    const { label, color } = config[priority] || config.medium;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>;
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">تیکت‌های من</h1>
        <Link
          to="/dashboard/user/tickets/create"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80"
        >
          + ایجاد تیکت جدید
        </Link>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <div className="text-4xl mb-4 text-muted-foreground">🎫</div>
            <h3 className="font-bold text-foreground mb-2">تیکتی وجود ندارد</h3>
            <p className="text-muted-foreground">برای شروع، تیکت جدیدی ایجاد کنید</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <Card key={ticket._id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground">{ticket.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(ticket.createdAt).toLocaleDateString('fa-IR')}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Link
                  to={`/dashboard/user/tickets/${ticket._id}`}
                  className="text-primary hover:text-primary/80"
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