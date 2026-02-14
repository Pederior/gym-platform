import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import api from '../../../services/api';

interface FoodItem {
  name: string;
  portion: string;
  calories?: number;
}

interface DietMeal {
  name: string;
  time: string;
  foods: FoodItem[];
  notes?: string;
}

interface DietPlan {
  _id: string;
  title: string;
  description: string;
  duration: number;
  diets: DietMeal[];
  completedDays: number;
  totalDays: number;
}

export default function UserDietPlans() {
  useDocumentTitle('برنامه‌های غذایی');
  
  const navigate = useNavigate();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchDietPlans = async () => {
    try {
      const res = await api.get('/users/diet-plans/current');
      setDietPlans(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error('Error fetching diet plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (plan: DietPlan) => {
    return Math.round((plan.completedDays / plan.totalDays) * 100);
  };

  const formatTime = (timeString: string) => {
    return timeString.replace(/:/g, ':');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentPlans = dietPlans.filter(plan => plan.completedDays < plan.totalDays);
  const completedPlans = dietPlans.filter(plan => plan.completedDays >= plan.totalDays);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">برنامه‌های غذایی</h1>
        
        {/* Tab Navigation */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'current'
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            برنامه‌های فعال
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            تاریخچه
          </button>
        </div>
      </div>

      {/* Empty State */}
      {((activeTab === 'current' && currentPlans.length === 0) || 
        (activeTab === 'history' && completedPlans.length === 0)) && (
        <div className="bg-card p-8 rounded-xl shadow border border-border text-center">
          <div className="text-6xl mb-4 text-muted-foreground">🥗</div>
          <h3 className="font-bold text-foreground mb-2">
            {activeTab === 'current' 
              ? 'برنامه غذایی فعالی وجود ندارد' 
              : 'تاریخچه‌ای وجود ندارد'}
          </h3>
          <p className="text-muted-foreground">
            {activeTab === 'current'
              ? 'منتظر اختصاص برنامه غذایی توسط مربی خود باشید'
              : 'هنوز برنامه‌ای به پایان نرسیده است'}
          </p>
        </div>
      )}

      {/* Diet Plans List */}
      {(activeTab === 'current' ? currentPlans : completedPlans).map((plan) => (
        <div key={plan._id} className="bg-card rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden border border-border">
          {/* Header with Progress */}
          <div className="p-6 border-b border-border">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">{plan.title}</h2>
                <p className="text-muted-foreground mt-1">{plan.description}</p>
                <div className="flex flex-wrap gap-4 mt-3">
                  <span className="text-sm text-muted-foreground">
                    مدت زمان: {plan.duration} روز
                  </span>
                  <span className="text-sm text-muted-foreground">
                    پیشرفت: {plan.completedDays} از {plan.totalDays} روز
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full md:w-64">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>پیشرفت</span>
                  <span>{getProgressPercentage(plan)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage(plan)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Meals Section */}
          <div className="p-6">
            <h3 className="font-bold text-foreground mb-4">وعده‌های غذایی</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plan.diets.map((meal, index) => (
                <div key={index} className="border border-border rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-foreground">{meal.name}</h4>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      {formatTime(meal.time)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {meal.foods.map((food, foodIndex) => (
                      <div key={foodIndex} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                        <div>
                          <span className="font-medium text-foreground">{food.name}</span>
                          <span className="text-muted-foreground text-sm ml-2">({food.portion})</span>
                        </div>
                        {food.calories && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {food.calories} کالری
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {meal.notes && (
                    <div className="mt-3 p-2 bg-accent/10 rounded text-sm text-foreground">
                      📝 {meal.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-muted border-t border-border">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(`/dashboard/user/diet-plans/${plan._id}`)}
                className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                مشاهده جزئیات
              </button>
              <button
                onClick={() => {/* ثبت مصرف */}}
                className="flex-1 border border-primary text-primary hover:bg-primary/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                ثبت مصرف امروز
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Quick Actions */}
      <div className="bg-card p-6 rounded-xl shadow border border-border">
        <h3 className="font-bold text-foreground mb-3">اقدامات سریع</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/dashboard/user/progress')}
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary transition-colors"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              📊
            </div>
            <div className="text-right">
              <div className="font-medium text-foreground">پیگیری پیشرفت</div>
              <div className="text-sm text-muted-foreground">مشاهده آمار مصرف غذا</div>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/dashboard/user/chat')}
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary transition-colors"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              💬
            </div>
            <div className="text-right">
              <div className="font-medium text-foreground">تماس با مربی</div>
              <div className="text-sm text-muted-foreground">درخواست تغییر برنامه غذایی</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}