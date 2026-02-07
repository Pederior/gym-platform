import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import { toast } from 'react-hot-toast';

export default function CoachTrainingVideoCreate() {
  useDocumentTitle('ایجاد ویدیوی آموزشی');
  
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnail: '',
    duration: 0,
    category: 'workout' as 'workout' | 'nutrition' | 'lifestyle' | 'motivation',
    accessLevel: 'gold' as 'bronze' | 'silver' | 'gold'
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.videoUrl.trim()) {
      toast.error('لطفاً عنوان و URL ویدیو را وارد کنید');
      return;
    }

    setLoading(true);
    try {
      await api.post('/coach/videos', formData);
      toast.success('ویدیو با موفقیت ایجاد شد');
      navigate('/dashboard/coach/videos');
    } catch (err: any) {
      console.error('Error creating video:', err);
      toast.error(err.response?.data?.message || 'خطا در ایجاد ویدیو');
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ایجاد ویدیوی آموزشی جدید</h1>
        <button
          onClick={() => navigate('/dashboard/coach/videos')}
          className="text-gray-600 hover:text-gray-800"
        >
          انصراف
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عنوان ویدیو *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="مثلاً: تمرین پرس سینه"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                توضیحات
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="توضیحات اختیاری برای ویدیو..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL ویدیو *
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="https://example.com/video.mp4"
              />
              <p className="text-xs text-gray-500 mt-1">
                لینک مستقیم به فایل ویدیو (MP4, WebM, یا YouTube)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL تصویر بندانگشتی
              </label>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                مدت زمان (ثانیه)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                دسته‌بندی
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {getCategoryOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                سطح دسترسی *
              </label>
              <select
                name="accessLevel"
                value={formData.accessLevel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {getAccessLevelOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                تعیین کنید چه کاربرانی می‌توانند این ویدیو را ببینند
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">💡 نکات مهم:</h4>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• برای ویدیوهای YouTube، لینک مستقیم embed استفاده کنید</li>
                <li>• فرمت‌های پشتیبانی شده: MP4, WebM, OGG</li>
                <li>• اندازه پیشنهادی تصویر بندانگشتی: 16:9</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'در حال ایجاد...' : 'ایجاد ویدیو'}
          </button>
        </div>
      </form>
    </div>
  );
}