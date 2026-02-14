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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">مدیریت پلن‌های اشتراک</h1>
        <button
          onClick={() => openEditModal()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80"
        >
          ایجاد پلن جدید
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">در حال بارگذاری...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan._id} className="border border-border rounded-lg p-4 bg-card">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(plan)}
                    className="text-primary hover:text-primary/80"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    حذف
                  </button>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm mb-3">{plan.description}</p>
              
              <div className="mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  plan.isActive ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'
                }`}>
                  {plan.isActive ? 'فعال' : 'غیرفعال'}
                </span>
                {plan.isPopular && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent mr-2">
                    پرفروش
                  </span>
                )}
              </div>
              
              <div className="text-sm text-foreground">
                <div>ماهانه: {plan.price.monthly.toLocaleString()} تومان</div>
                <div>سه‌ماهه: {plan.price.quarterly.toLocaleString()} تومان</div>
                <div>سالانه: {plan.price.yearly.toLocaleString()} تومان</div>
              </div>
              
              <div className="mt-3">
                <h4 className="font-medium text-foreground mb-2">امکانات:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  {plan.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal ویرایش */}
      {isModalOpen && editingPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                {editingPlan._id ? 'ویرایش پلن' : 'ایجاد پلن جدید'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">شناسه *</label>
                  <select
                    value={editingPlan.id}
                    onChange={(e) => setEditingPlan({...editingPlan, id: e.target.value as any})}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    disabled={!!editingPlan._id}
                  >
                    <option value="bronze">برنز</option>
                    <option value="silver">نقره‌ای</option>
                    <option value="gold">طلایی</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">ترتیب نمایش</label>
                  <input
                    type="number"
                    value={editingPlan.order}
                    onChange={(e) => setEditingPlan({...editingPlan, order: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">نام پلن *</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">توضیحات *</label>
                <input
                  type="text"
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">ماهانه (تومان)</label>
                  <input
                    type="number"
                    value={editingPlan.price.monthly}
                    onChange={(e) => setEditingPlan({
                      ...editingPlan, 
                      price: {...editingPlan.price, monthly: parseInt(e.target.value) || 0}
                    })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">سه‌ماهه (تومان)</label>
                  <input
                    type="number"
                    value={editingPlan.price.quarterly}
                    onChange={(e) => setEditingPlan({
                      ...editingPlan, 
                      price: {...editingPlan.price, quarterly: parseInt(e.target.value) || 0}
                    })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">سالانه (تومان)</label>
                  <input
                    type="number"
                    value={editingPlan.price.yearly}
                    onChange={(e) => setEditingPlan({
                      ...editingPlan, 
                      price: {...editingPlan.price, yearly: parseInt(e.target.value) || 0}
                    })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">امکانات</label>
                {editingPlan.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      placeholder="امکانات پلن..."
                    />
                    {editingPlan.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="bg-destructive text-destructive-foreground px-3 rounded-lg hover:bg-destructive/80"
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-primary hover:text-primary/80 mt-2"
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
                    className="rounded border-border text-primary"
                  />
                  <span className="mr-2 text-sm text-foreground">فعال باشد</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingPlan.isPopular}
                    onChange={(e) => setEditingPlan({...editingPlan, isPopular: e.target.checked})}
                    className="rounded border-border text-accent"
                  />
                  <span className="mr-2 text-sm text-foreground">پرفروش باشد</span>
                </label>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80"
                >
                  ذخیره پلن
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80"
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