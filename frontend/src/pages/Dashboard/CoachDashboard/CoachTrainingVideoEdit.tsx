import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import { toast } from 'react-hot-toast';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

interface TrainingVideo {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  category: 'workout' | 'nutrition' | 'lifestyle' | 'motivation';
  accessLevel: 'bronze' | 'silver' | 'gold';
  isActive: boolean;
}

export default function CoachTrainingVideoEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnail: '',
    duration: 0,
    category: 'workout' as 'workout' | 'nutrition' | 'lifestyle' | 'motivation',
    accessLevel: 'gold' as 'bronze' | 'silver' | 'gold',
    isActive: true
  });

  useDocumentTitle(formData.title ? `ویرایش: ${formData.title}` : 'ویرایش ویدیوی آموزشی');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchVideo(id);
    }
  }, [id]);

  const fetchVideo = async (videoId: string) => {
    try {
      const res = await api.get(`/coach/videos/${videoId}`);
      const video: TrainingVideo = res.data.data;
      
      setFormData({
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        thumbnail: video.thumbnail,
        duration: video.duration,
        category: video.category,
        accessLevel: video.accessLevel,
        isActive: video.isActive
      });
      
    } catch (err) {
      console.error('Error fetching video:', err);
      toast.error('خطا در بارگذاری ویدیو');
      navigate('/dashboard/coach/videos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    
    if (target.type === 'checkbox') {
      const checkbox = target as HTMLInputElement;
      setFormData(prev => ({ 
        ...prev, 
        [target.name]: checkbox.checked 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [target.name]: target.value 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.videoUrl.trim()) {
      toast.error('لطفاً عنوان و URL ویدیو را وارد کنید');
      return;
    }

    setSubmitting(true);
    try {
      await api.put(`/coach/videos/${id}`, formData);
      toast.success('ویدیو با موفقیت به‌روزرسانی شد');
      navigate('/dashboard/coach/videos');
    } catch (err: any) {
      console.error('Error updating video:', err);
      toast.error(err.response?.data?.message || 'خطا در به‌روزرسانی ویدیو');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryOptions = () => [
    { value: 'workout', label: 'تمرین' },
    { value: 'nutrition', label: 'تغذیه' },
    { value: 'lifestyle', label: 'سبک زندگی' },
    { value: 'motivation', label: 'انگیزشی' }
  ];

  const getAccessLevelOptions = () => [
    { value: 'bronze', label: 'برنز (همه کاربران)' },
    { value: 'silver', label: 'نقره‌ای و طلایی' },
    { value: 'gold', label: 'فقط طلایی' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">ویرایش ویدیوی آموزشی</h1>
        <button
          onClick={() => navigate('/dashboard/coach/videos')}
          className="text-muted-foreground hover:text-foreground"
        >
          انصراف
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-card p-4 sm:p-6 rounded-xl shadow border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                عنوان ویدیو *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
                placeholder="مثلاً: تمرین پرس سینه"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                توضیحات
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
                placeholder="توضیحات اختیاری برای ویدیو..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                URL ویدیو *
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
                placeholder="https://example.com/video.mp4"
              />
              <p className="text-xs text-muted-foreground mt-1">
                لینک مستقیم به فایل ویدیو (MP4, WebM, یا YouTube)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                URL تصویر بندانگشتی
              </label>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                مدت زمان (ثانیه)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
                placeholder="300"
              />
            </div>

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
                {getCategoryOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                سطح دسترسی *
              </label>
              <select
                name="accessLevel"
                value={formData.accessLevel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              >
                {getAccessLevelOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                تعیین کنید چه کاربرانی می‌توانند این ویدیو را ببینند
              </p>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-border text-primary"
                />
                <span className="mr-2 text-sm text-foreground">فعال باشد</span>
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                اگر غیرفعال باشد، کاربران نمی‌توانند آن را ببینند
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/coach/videos')}
            className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-medium hover:bg-secondary/80"
          >
            انصراف
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی ویدیو'}
          </button>
        </div>
      </form>
    </div>
  );
}