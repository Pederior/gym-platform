import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import api from '../../../services/api';
import { toast } from 'react-hot-toast';

interface DietMeal {
  name: string;        // صبحانه، ناهار، شام
  time: string;        // "08:00"
  foods: {
    name: string;
    portion: string;
    calories: number;
  }[];
  notes: string;
}

export default function CoachDietPlansCreate() {
  useDocumentTitle('ایجاد برنامه غذایی');
  
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 7
  });
  
  const [meals, setMeals] = useState<DietMeal[]>([
    { name: 'صبحانه', time: '08:00', foods: [{ name: '', portion: '', calories: 0 }], notes: '' },
    { name: 'ناهار', time: '13:00', foods: [{ name: '', portion: '', calories: 0 }], notes: '' },
    { name: 'شام', time: '19:00', foods: [{ name: '', portion: '', calories: 0 }], notes: '' }
  ]);
  
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      await api.post('/diet-plans', {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        diets: meals
      });

      toast.success('برنامه غذایی با موفقیت ایجاد شد');
      navigate('/dashboard/coach/diet-plans');
    } catch (err: any) {
      console.error('Create diet plan error:', err);
      toast.error(err.response?.data?.message || 'خطا در ایجاد برنامه غذایی');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">ایجاد برنامه غذایی جدید</h1>
        <button
          onClick={() => navigate('/dashboard/coach/diet-plans')}
          className="text-gray-600 hover:text-gray-800"
        >
          انصراف
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow">
        {/* Basic Info */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان برنامه *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="مثلاً: برنامه کاهش وزن"
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
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="توضیحات اختیاری برای برنامه..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              مدت زمان (روز)
            </label>
            <select
              value={formData.duration}
              onChange={handleDurationChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
          <h2 className="text-xl font-bold text-gray-800">وعده‌های غذایی</h2>
          
          {meals.map((meal, mealIndex) => (
            <div key={mealIndex} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نام وعده *
                  </label>
                  <input
                    type="text"
                    value={meal.name}
                    onChange={(e) => handleMealFieldChange(mealIndex, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="صبحانه، ناهار، شام"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    زمان *
                  </label>
                  <input
                    type="time"
                    value={meal.time}
                    onChange={(e) => handleMealFieldChange(mealIndex, 'time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مواد غذایی
                </label>
                
                {meal.foods.map((food, foodIndex) => (
                  <div key={foodIndex} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <input
                      type="text"
                      value={food.name}
                      onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="نام غذا"
                    />
                    <input
                      type="text"
                      value={food.portion}
                      onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'portion', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="مقدار (مثلاً 2 عدد)"
                    />
                    <input
                      type="number"
                      value={food.calories}
                      onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'calories', parseInt(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="کالری"
                    />
                    <div className="flex items-center">
                      {meal.foods.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFoodFromMeal(mealIndex, foodIndex)}
                          className="text-red-600 hover:text-red-800 px-3 py-2 bg-red-50 rounded-lg"
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
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + افزودن غذای جدید
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  یادداشت‌ها
                </label>
                <textarea
                  value={meal.notes}
                  onChange={(e) => handleMealFieldChange(mealIndex, 'notes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'در حال ایجاد...' : 'ایجاد برنامه'}
          </button>
        </div>
      </form>
    </div>
  );
}