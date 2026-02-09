import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import { toast } from 'react-hot-toast';
import { adminService } from '../../../services/adminService';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

interface Article {
  title: string;
  content: string;
  excerpt: string;
  category: 'nutrition' | 'workout' | 'lifestyle' | 'motivation' | 'health';
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  readTime: number;
  featuredImage?: string;
}

export default function AdminArticleEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  useDocumentTitle('ویرایش مقاله');
  
  const [formData, setFormData] = useState<Article>({
    title: '',
    content: '',
    excerpt: '',
    category: 'health',
    status: 'draft',
    tags: [''],
    readTime: 5,
    featuredImage: undefined
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const data = await adminService.getArticle(id!);
      setFormData({
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        status: data.status,
        tags: data.tags.length > 0 ? data.tags : [''],
        readTime: data.readTime,
        featuredImage: data.featuredImage || undefined
      });
      if (data.featuredImage) {
        setImagePreview(data.featuredImage);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در بارگذاری مقاله');
      navigate('/dashboard/admin/articles');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('فقط فایل‌های تصویری مجاز هستند');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم فایل نباید بیشتر از 5MB باشد');
        return;
      }
      
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      
      try {
        const res = await adminService.uploadImage(formDataUpload);
        setFormData(prev => ({ ...prev, featuredImage: res.imageUrl }));
        setImagePreview(res.imageUrl);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'خطا در آپلود تصویر');
      }
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, featuredImage: url || undefined }));
    setImagePreview(url || null);
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));
  };

  const removeTag = (index: number) => {
    if (formData.tags.length > 1) {
      const newTags = [...formData.tags];
      newTags.splice(index, 1);
      setFormData(prev => ({ ...prev, tags: newTags }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.excerpt.trim()) {
      toast.error('عنوان، محتوا و خلاصه الزامی هستند');
      return;
    }
    
    const validTags = formData.tags.filter(tag => tag.trim()).map(tag => tag.trim());
    
    setSubmitting(true);
    try {
      await adminService.updateArticle(id!, {
        ...formData,
        tags: validTags
      });
      toast.success('مقاله با موفقیت به‌روز شد');
      navigate('/dashboard/admin/articles');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در ذخیره مقاله');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: 'nutrition', label: 'تغذیه' },
    { value: 'workout', label: 'تمرین' },
    { value: 'lifestyle', label: 'سبک زندگی' },
    { value: 'motivation', label: 'انگیزشی' },
    { value: 'health', label: 'سلامتی' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'پیش‌نویس' },
    { value: 'published', label: 'منتشر شده' },
    { value: 'archived', label: 'آرشیو شده' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ویرایش مقاله</h1>
        <button
          onClick={() => navigate('/dashboard/admin/articles')}
          className="text-gray-600 hover:text-gray-800"
        >
          انصراف
        </button>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عنوان مقاله *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="عنوان جذابی برای مقاله خود انتخاب کنید"
                required
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              خلاصه مقاله *
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="خلاصه‌ای کوتاه از مقاله (حداکثر 200 کاراکتر)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              محتوای مقاله *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="محتوای کامل مقاله را اینجا بنویسید..."
              required
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تصویر شاخص
            </label>
            
            <div className="mb-4">
              <label className="block text-xs text-gray-600 mb-2">آپلود تصویر</label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">فرمت‌های مجاز: JPG, PNG, GIF (حداکثر 5MB)</p>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-2">یا URL تصویر</label>
              <input
                type="url"
                name="featuredImage"
                value={formData.featuredImage || ''}
                onChange={handleImageUrlChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            {(imagePreview || formData.featuredImage) && (
              <div className="mt-4">
                <label className="block text-xs text-gray-600 mb-2">پیش‌نمایش تصویر</label>
                <img
                  src={imagePreview || formData.featuredImage!}
                  alt="پیش‌نمایش تصویر شاخص"
                  className="max-w-xs max-h-48 object-contain border rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وضعیت
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                زمان خواندن (دقیقه)
              </label>
              <input
                type="number"
                name="readTime"
                value={formData.readTime}
                onChange={handleInputChange}
                min="1"
                max="60"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تگ‌ها
            </label>
            <div className="space-y-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="تگ را وارد کنید..."
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="bg-red-500 text-white px-3 rounded-lg hover:bg-red-600"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="text-blue-600 hover:text-blue-800 mt-2"
              >
                + افزودن تگ
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {submitting ? 'در حال ذخیره...' : 'به‌روزرسانی مقاله'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/admin/articles')}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              انصراف
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}