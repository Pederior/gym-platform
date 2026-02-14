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
    thumbnailUrl: '',
    videoFile: null as File | null,
    thumbnailFile: null as File | null,
    duration: 0,
    category: 'workout' as 'workout' | 'nutrition' | 'lifestyle' | 'motivation',
    accessLevel: 'gold' as 'bronze' | 'silver' | 'gold'
  });
  
  const [uploadType, setUploadType] = useState<'url' | 'file'>('url');
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'video' | 'thumbnail') => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (fileType === 'video' && !file.type.startsWith('video/')) {
        toast.error('لطفاً فایل ویدیو معتبر انتخاب کنید');
        return;
      }
      
      if (fileType === 'thumbnail' && !file.type.startsWith('image/')) {
        toast.error('لطفاً فایل تصویر معتبر انتخاب کنید');
        return;
      }
      
      const maxSize = fileType === 'video' ? 100 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(fileType === 'video' 
          ? 'حجم ویدیو نباید بیشتر از 100MB باشد' 
          : 'حجم تصویر نباید بیشتر از 5MB باشد');
        return;
      }
      
      if (fileType === 'video') {
        setFormData(prev => ({ ...prev, videoFile: file }));
        setVideoPreview(URL.createObjectURL(file));
      } else {
        setFormData(prev => ({ ...prev, thumbnailFile: file }));
        setThumbnailPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('لطفاً عنوان ویدیو را وارد کنید');
      return;
    }

    if (uploadType === 'url') {
      if (!formData.videoUrl.trim()) {
        toast.error('لطفاً URL ویدیو را وارد کنید');
        return;
      }
    } else {
      if (!formData.videoFile) {
        toast.error('لطفاً فایل ویدیو را انتخاب کنید');
        return;
      }
    }

    setLoading(true);
    try {
      const payload: any = {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        category: formData.category,
        accessLevel: formData.accessLevel
      };

      if (uploadType === 'url') {
        payload.videoUrl = formData.videoUrl;
        payload.thumbnail = formData.thumbnailUrl || null;
        
        await api.post('/coach/videos', payload);
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('duration', formData.duration.toString());
        formDataToSend.append('category', formData.category);
        formDataToSend.append('accessLevel', formData.accessLevel);
        
        if (formData.videoFile) {
          formDataToSend.append('video', formData.videoFile);
        }
        
        if (formData.thumbnailFile) {
          formDataToSend.append('thumbnail', formData.thumbnailFile);
        }

        await api.post('/coach/videos/upload', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 60000
        });
      }

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">ایجاد ویدیوی آموزشی جدید</h1>
        <button
          onClick={() => navigate('/dashboard/coach/videos')}
          className="text-muted-foreground hover:text-foreground"
        >
          انصراف
        </button>
      </div>

      {/* Toggle Upload Type */}
      <div className="bg-card p-4 rounded-xl shadow border border-border">
        <div className="flex space-x-2 sm:space-x-4 rtl:space-x-reverse">
          <button
            onClick={() => setUploadType('url')}
            className={`flex-1 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              uploadType === 'url'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            استفاده از URL
          </button>
          <button
            onClick={() => setUploadType('file')}
            className={`flex-1 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              uploadType === 'file'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            آپلود فایل
          </button>
        </div>
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

            {/* Video Input - Dynamic based on upload type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {uploadType === 'url' ? 'URL ویدیو *' : 'فایل ویدیو *'}
              </label>
              
              {uploadType === 'url' ? (
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="https://example.com/video.mp4"
                />
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileChange(e, 'video')}
                    className="hidden"
                    id="video-upload"
                  />
                  <label 
                    htmlFor="video-upload" 
                    className="cursor-pointer text-primary hover:text-primary/80"
                  >
                    {formData.videoFile ? formData.videoFile.name : 'انتخاب فایل ویدیو'}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    فرمت‌های پشتیبانی شده: MP4, WebM, OGG (حداکثر 100MB)
                  </p>
                  
                  {videoPreview && (
                    <div className="mt-2">
                      <video 
                        src={videoPreview} 
                        controls 
                        className="w-full max-h-32 object-contain rounded"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail Input - Dynamic based on upload type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {uploadType === 'url' ? 'URL تصویر بندانگشتی' : 'تصویر بندانگشتی'}
              </label>
              
              {uploadType === 'url' ? (
                <input
                  type="url"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'thumbnail')}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label 
                    htmlFor="thumbnail-upload" 
                    className="cursor-pointer text-primary hover:text-primary/80"
                  >
                    {formData.thumbnailFile ? formData.thumbnailFile.name : 'انتخاب تصویر'}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    فرمت‌های پشتیبانی شده: JPG, PNG, GIF (حداکثر 5MB)
                  </p>
                  
                  {thumbnailPreview && (
                    <div className="mt-2">
                      <img 
                        src={thumbnailPreview} 
                        alt="پیش‌نمایش تصویر"
                        className="w-full max-h-32 object-contain rounded"
                      />
                    </div>
                  )}
                </div>
              )}
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

            <div className="bg-accent/10 p-4 rounded-lg">
              <h4 className="font-medium text-accent mb-2">💡 نکات مهم:</h4>
              <ul className="text-xs text-accent space-y-1">
                <li>• برای YouTube، لینک embed استفاده کنید</li>
                <li>• آپلود فایل برای ویدیوهای خصوصی مناسب‌تر است</li>
                <li>• تصویر بندانگشتی بهبود ظاهر لیست را فراهم می‌کند</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'در حال پردازش...' : 'ایجاد ویدیو'}
          </button>
        </div>
      </form>
    </div>
  );
}