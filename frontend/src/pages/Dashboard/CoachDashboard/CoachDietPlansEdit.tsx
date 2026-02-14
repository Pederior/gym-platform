// ... importها بدون تغییر ...

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

  // ... توابع بدون تغییر ...

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