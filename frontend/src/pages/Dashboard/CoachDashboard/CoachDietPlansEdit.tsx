import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import useDocumentTitle from '../../../hooks/useDocumentTitle';
import api from '../../../services/api';
import { toast } from 'react-hot-toast';

interface DietMeal {
  name: string;
  time: string;
  foods: {
    name: string;
    portion: string;
    calories: number;
  }[];
  notes: string;
}

interface DietPlan {
  _id: string;
  title: string;
  description: string;
  duration: number;
  diets: DietMeal[];
}
export default function CoachDietPlansEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 7
  });
  
  const [meals, setMeals] = useState<DietMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDietPlan(id);
    }
  }, [id]);

  const fetchDietPlan = async (planId: string) => {
    try {
      const res = await api.get(`/diet-plans/${planId}`);
      const plan: DietPlan = res.data.data;
      
      setFormData({
        title: plan.title,
        description: plan.description,
        duration: plan.duration
      });
      
      setMeals(plan.diets);
    } catch (err: any) {
      console.error('Fetch diet plan error:', err);
      toast.error('خطا در بارگذاری برنامه غذایی');
      navigate('/dashboard/coach/diet-plans');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }));
  };

  const addFoodToMeal = (mealIndex: number) => {
    const newMeals = [...meals];
    newMeals[mealIndex].foods.push({ name: '', portion: '', calories: 0 });
    setMeals(newMeals);
  };

  const removeFoodFromMeal = (mealIndex: number, foodIndex: number) => {
    if (meals[mealIndex].foods.length <= 1) return;
    
    const newMeals = [...meals];
    newMeals[mealIndex].foods.splice(foodIndex, 1);
    setMeals(newMeals);
  };

  const handleFoodChange = (mealIndex: number, foodIndex: number, field: string, value: string | number) => {
    const newMeals = [...meals];
    newMeals[mealIndex].foods[foodIndex] = {
      ...newMeals[mealIndex].foods[foodIndex],
      [field]: value
    };
    setMeals(newMeals);
  };

  const handleMealFieldChange = (mealIndex: number, field: string, value: string) => {
    const newMeals = [...meals];
    newMeals[mealIndex] = {
      ...newMeals[mealIndex],
      [field]: value
    };
    setMeals(newMeals);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('لطفاً عنوان برنامه را وارد کنید');
      return;
    }

    // اعتبارسنجی وعده‌ها
    for (let i = 0; i < meals.length; i++) {
      if (!meals[i].name.trim() || !meals[i].time.trim()) {
        toast.error(`لطفاً اطلاعات وعده ${i + 1} را کامل کنید`);
        return;
      }
      
      for (let j = 0; j < meals[i].foods.length; j++) {
        if (!meals[i].foods[j].name.trim() || !meals[i].foods[j].portion.trim()) {
          toast.error(`لطفاً اطلاعات غذای ${j + 1} در وعده ${i + 1} را کامل کنید`);
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      await api.put(`/diet-plans/${id}`, {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        diets: meals
      });

      toast.success('برنامه غذایی با موفقیت به‌روزرسانی شد');
      navigate('/dashboard/coach/diet-plans');
    } catch (err: any) {
      console.error('Update diet plan error:', err);
      toast.error(err.response?.data?.message || 'خطا در به‌روزرسانی برنامه غذایی');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">ویرایش برنامه غذایی</h1>
        <button
          onClick={() => navigate('/dashboard/coach/diet-plans')}
          className="text-muted-foreground hover:text-foreground"
        >
          انصراف
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-card p-4 sm:p-6 rounded-xl shadow border border-border">
        {/* Basic Info */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              عنوان برنامه *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="مثلاً: برنامه کاهش وزن"
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
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="توضیحات اختیاری برای برنامه..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              مدت زمان (روز)
            </label>
            <select
              value={formData.duration}
              onChange={handleDurationChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            >
              <option value={7}>7 روز</option>
              <option value={14}>14 روز</option>
              <option value={21}>21 روز</option>
              <option value={30}>30 روز</option>
            </select>
          </div>
        </div>

        {/* Meals Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">وعده‌های غذایی</h2>
          
          {meals.map((meal, mealIndex) => (
            <div key={mealIndex} className="border border-border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    نام وعده *
                  </label>
                  <input
                    type="text"
                    value={meal.name}
                    onChange={(e) => handleMealFieldChange(mealIndex, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    placeholder="صبحانه، ناهار، شام"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    زمان *
                  </label>
                  <input
                    type="time"
                    value={meal.time}
                    onChange={(e) => handleMealFieldChange(mealIndex, 'time', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-foreground mb-2">
                  مواد غذایی
                </label>
                
                {meal.foods.map((food, foodIndex) => (
                  <div key={foodIndex} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <input
                      type="text"
                      value={food.name}
                      onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'name', e.target.value)}
                      className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      placeholder="نام غذا"
                    />
                    <input
                      type="text"
                      value={food.portion}
                      onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'portion', e.target.value)}
                      className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      placeholder="مقدار (مثلاً 2 عدد)"
                    />
                    <input
                      type="number"
                      value={food.calories}
                      onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'calories', parseInt(e.target.value) || 0)}
                      className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      placeholder="کالری"
                    />
                    <div className="flex items-center">
                      {meal.foods.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFoodFromMeal(mealIndex, foodIndex)}
                          className="text-destructive hover:text-destructive/80 px-3 py-2 bg-destructive/10 rounded-lg"
                        >
                          حذف
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addFoodToMeal(mealIndex)}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  + افزودن غذای جدید
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  یادداشت‌ها
                </label>
                <textarea
                  value={meal.notes}
                  onChange={(e) => handleMealFieldChange(mealIndex, 'notes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="یادداشت‌های اختیاری..."
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی برنامه'}
          </button>
        </div>
      </form>
    </div>
  );
}