import { useState, useEffect } from 'react';
import { adminService, type AdminSubscriptionPlan } from '../../../services/adminService';
import { toast } from 'react-hot-toast';
import useDocumentTitle from '../../../hooks/useDocumentTitle'

export default function AdminSubscriptionPlans() {
  useDocumentTitle('پلن‌های اشتراک')
  const [plans, setPlans] = useState<AdminSubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AdminSubscriptionPlan | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await adminService.getSubscriptionPlans();
      setPlans(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در بارگذاری پلن‌ها');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (plan: AdminSubscriptionPlan | null = null) => {
    setEditingPlan(plan || {
      _id: '',
      id: 'bronze',
      name: '',
      description: '',
      isPopular: false,
      isActive: true,
      features: [''],
      price: { monthly: 0, quarterly: 0, yearly: 0 },
      order: plans.length + 1
    });
    setIsModalOpen(true);
  };

  const handleFeatureChange = (index: number, value: string) => {
    if (editingPlan) {
      const newFeatures = [...editingPlan.features];
      newFeatures[index] = value;
      setEditingPlan({ ...editingPlan, features: newFeatures });
    }
  };

  const addFeature = () => {
    if (editingPlan) {
      setEditingPlan({ ...editingPlan, features: [...editingPlan.features, ''] });
    }
  };

  const removeFeature = (index: number) => {
    if (editingPlan && editingPlan.features.length > 1) {
      const newFeatures = [...editingPlan.features];
      newFeatures.splice(index, 1);
      setEditingPlan({ ...editingPlan, features: newFeatures });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      await adminService.upsertSubscriptionPlan(editingPlan);
      toast.success('پلن با موفقیت ذخیره شد');
      fetchPlans();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در ذخیره پلن');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟ این عمل غیرقابل بازگشت است.')) return;
    
    try {
      await adminService.deleteSubscriptionPlan(id);
      toast.success('پلن با موفقیت حذف شد');
      fetchPlans();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در حذف پلن');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت پلن‌های اشتراک</h1>
        <button
          onClick={() => openEditModal()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          ایجاد پلن جدید
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center">در حال بارگذاری...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan._id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(plan)}
                    className="text-blue-600"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="text-red-600"
                  >
                    حذف
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{plan.description}</p>
              
              <div className="mb-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {plan.isActive ? 'فعال' : 'غیرفعال'}
                </span>
                {plan.isPopular && (
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 mr-2">
                    پرفروش
                  </span>
                )}
              </div>
              
              <div className="text-sm">
                <div>ماهانه: {plan.price.monthly.toLocaleString()} تومان</div>
                <div>سه‌ماهه: {plan.price.quarterly.toLocaleString()} تومان</div>
                <div>سالانه: {plan.price.yearly.toLocaleString()} تومان</div>
              </div>
              
              <div className="mt-3">
                <h4 className="font-medium text-gray-700 mb-2">امکانات:</h4>
                <ul className="text-xs space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-gray-600">• {feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal ویرایش */}
      {isModalOpen && editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">
                {editingPlan._id ? 'ویرایش پلن' : 'ایجاد پلن جدید'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">شناسه *</label>
                  <select
                    value={editingPlan.id}
                    onChange={(e) => setEditingPlan({...editingPlan, id: e.target.value as any})}
                    className="w-full px-3 py-2 border rounded-lg"
                    disabled={!!editingPlan._id}
                  >
                    <option value="bronze">برنز</option>
                    <option value="silver">نقره‌ای</option>
                    <option value="gold">طلایی</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ترتیب نمایش</label>
                  <input
                    type="number"
                    value={editingPlan.order}
                    onChange={(e) => setEditingPlan({...editingPlan, order: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام پلن *</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات *</label>
                <input
                  type="text"
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ماهانه (تومان)</label>
                  <input
                    type="number"
                    value={editingPlan.price.monthly}
                    onChange={(e) => setEditingPlan({
                      ...editingPlan, 
                      price: {...editingPlan.price, monthly: parseInt(e.target.value) || 0}
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">سه‌ماهه (تومان)</label>
                  <input
                    type="number"
                    value={editingPlan.price.quarterly}
                    onChange={(e) => setEditingPlan({
                      ...editingPlan, 
                      price: {...editingPlan.price, quarterly: parseInt(e.target.value) || 0}
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">سالانه (تومان)</label>
                  <input
                    type="number"
                    value={editingPlan.price.yearly}
                    onChange={(e) => setEditingPlan({
                      ...editingPlan, 
                      price: {...editingPlan.price, yearly: parseInt(e.target.value) || 0}
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">امکانات</label>
                {editingPlan.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg"
                      placeholder="امکانات پلن..."
                    />
                    {editingPlan.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="bg-red-500 text-white px-3 rounded-lg"
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-blue-600 mt-2"
                >
                  + افزودن امکانات
                </button>
              </div>
              
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingPlan.isActive}
                    onChange={(e) => setEditingPlan({...editingPlan, isActive: e.target.checked})}
                    className="rounded border-gray-300 text-red-600"
                  />
                  <span className="mr-2 text-sm">فعال باشد</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingPlan.isPopular}
                    onChange={(e) => setEditingPlan({...editingPlan, isPopular: e.target.checked})}
                    className="rounded border-gray-300 text-yellow-600"
                  />
                  <span className="mr-2 text-sm">پرفروش باشد</span>
                </label>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  ذخیره پلن
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}