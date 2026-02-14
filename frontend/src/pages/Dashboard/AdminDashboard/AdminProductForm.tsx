import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ProductFormData, ProductType, PlanType, ProductStatus } from '../../../types/index';
import { productService } from '../../../services/productService';
import { toast } from 'react-hot-toast';
import { FaArrowRight } from 'react-icons/fa';
import useDocumentTitle from '../../../hooks/useDocumentTitle'

export default function AdminProductForm() {
  useDocumentTitle('افزودن محصول جدید');
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    type: 'supplement',
    category: '',
    description: '',
    image: undefined,
    compatiblePlans: [],
    bundles: [],
    status: 'active',
  });

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getById(id!);
      setFormData({
        name: data.name,
        price: data.price,
        type: data.type,
        category: data.category,
        description: data.description,
        image: data.image,
        compatiblePlans: data.compatiblePlans || [],
        bundles: data.bundles || [],
        status: data.status || 'active',
      });
      if (data.image) {
        setPreviewImage(data.image);
      }
    } catch (err) {
      toast.error('خطا در دریافت اطلاعات محصول');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('type', formData.type);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('status', formData.status || 'active');

      if (formData.compatiblePlans?.length) {
        formData.compatiblePlans.forEach((plan) => {
          formDataToSend.append('compatiblePlans[]', plan);
        });
      }

      if (formData.bundles?.length) {
        formData.bundles.forEach((bundle) => {
          formDataToSend.append('bundles[]', bundle);
        });
      }

      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      if (isEdit) {
        await productService.update(id!, formDataToSend);
        toast.success('محصول با موفقیت به‌روزرسانی شد');
      } else {
        await productService.create(formDataToSend);
        toast.success('محصول با موفقیت ایجاد شد');
      }

      navigate('/dashboard/admin/products');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در ثبت محصول');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handlePlanToggle = (plan: PlanType) => {
    const currentPlans = formData.compatiblePlans || [];
    const newPlans = currentPlans.includes(plan)
      ? currentPlans.filter((p) => p !== plan)
      : [...currentPlans, plan];
    setFormData({ ...formData, compatiblePlans: newPlans });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          {isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید'}
        </h1>
        <button
          onClick={() => navigate('/dashboard/admin/products')}
          className="text-muted-foreground hover:text-foreground transition flex items-center gap-2 cursor-pointer"
        >
          بازگشت به لیست
          <FaArrowRight className="rotate-180" />
        </button>
      </div>

      <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                نام محصول *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
                placeholder="مثلاً: پروتئین وی"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                قیمت (تومان) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
                min="0"
                className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
                placeholder="مثلاً: 500000"
              />
            </div>
          </div>

          {/* Type and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                نوع محصول *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ProductType })}
                required
                className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              >
                <option value="supplement">مکمل</option>
                <option value="clothing">پوشاک</option>
                <option value="accessory">لوازم جانبی</option>
                <option value="digital">محصول دیجیتال</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                دسته‌بندی *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
                placeholder="مثلاً: پروتئین‌ها"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              توضیحات *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="توضیحات کامل محصول..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              تصویر محصول
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center">
              {previewImage ? (
                <div className="space-y-4">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mx-auto max-h-48 sm:max-h-64 rounded-lg"
                  />
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-block px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 cursor-pointer transition"
                    >
                      تغییر تصویر
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                      <span className="text-primary text-2xl sm:text-3xl">+</span>
                    </div>
                    <p className="text-muted-foreground mb-1 sm:mb-2">کلیک کنید یا فایل را اینجا بکشید</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF (حداکثر 5MB)</p>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Compatible Plans */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              پلن‌های سازگار
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              {(['bronze', 'silver', 'gold'] as PlanType[]).map((plan) => (
                <label
                  key={plan}
                  className={`flex items-center gap-2 p-2 sm:p-3 border rounded-lg cursor-pointer transition ${
                    formData.compatiblePlans?.includes(plan)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.compatiblePlans?.includes(plan)}
                    onChange={() => handlePlanToggle(plan)}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-primary rounded focus:ring-primary"
                  />
                  <span className="capitalize font-medium text-sm sm:text-base">
                    {plan === 'bronze' ? 'برنز' : plan === 'silver' ? 'نقره‌ای' : 'طلایی'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              وضعیت *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
              required
              className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            >
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
              <option value="draft">پیش‌نویس</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-border">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-primary text-primary-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-primary/80 transition flex items-center justify-center gap-2 cursor-pointer ${
                submitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? (
                <>
                  <span className="animate-spin text-sm">⏳</span>
                  <span>در حال ثبت...</span>
                </>
              ) : (
                <>
                  <span>ثبت محصول</span>
                  <FaArrowRight className="rotate-180" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}