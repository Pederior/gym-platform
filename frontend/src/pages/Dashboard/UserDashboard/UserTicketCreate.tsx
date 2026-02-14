import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';
import Card from '../../../components/ui/Card';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

export default function UserTicketCreate() {
  useDocumentTitle('ایجاد تیکت جدید');
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other' as 'technical' | 'financial' | 'subscription' | 'other',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('لطفاً عنوان و توضیحات را پر کنید');
      return;
    }

    setLoading(true);
    try {
      await api.post('/tickets', formData);
      toast.success('تیکت شما با موفقیت ایجاد شد');
      navigate('/dashboard/user/tickets');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در ایجاد تیکت');
    } finally {
      setLoading(false);
    }
  };

  // const getCategoryLabel = (category: string) => {
  //   const labels: Record<string, string> = {
  //     technical: 'فنی',
  //     financial: 'مالی',
  //     subscription: 'اشتراک',
  //     other: 'سایر'
  //   };
  //   return labels[category] || category;
  // };

  // const getPriorityLabel = (priority: string) => {
  //   const labels: Record<string, string> = {
  //     low: 'پایین',
  //     medium: 'متوسط',
  //     high: 'بالا',
  //     urgent: 'فوری'
  //   };
  //   return labels[priority] || priority;
  // };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">ایجاد تیکت جدید</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              عنوان تیکت *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="مشکل من در مورد..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              توضیحات *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="لطفاً مشکل خود را به طور کامل توضیح دهید..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                دسته‌بندی
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              >
                <option value="technical">فنی</option>
                <option value="financial">مالی</option>
                <option value="subscription">اشتراک</option>
                <option value="other">سایر</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                اولویت
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              >
                <option value="low">پایین</option>
                <option value="medium">متوسط</option>
                <option value="high">بالا</option>
                <option value="urgent">فوری</option>
              </select>
            </div>
          </div>

          <div className="bg-accent/10 p-4 rounded-lg">
            <h4 className="font-medium text-accent mb-2">💡 نکات مهم:</h4>
            <ul className="text-xs text-accent space-y-1">
              <li>• لطفاً مشکل خود را به طور کامل و دقیق توضیح دهید</li>
              <li>• تصاویر یا اطلاعات اضافی را در توضیحات ذکر کنید</li>
              <li>• پاسخ تیکت‌ها معمولاً ظرف 24-48 ساعت ارسال می‌شود</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/user/tickets')}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'در حال ایجاد...' : 'ایجاد تیکت'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}