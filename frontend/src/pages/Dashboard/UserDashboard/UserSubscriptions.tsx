import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Card from "../../../components/ui/Card";
import { userService, type Subscription } from "../../../services/userService";

interface SubscriptionPlan {
  id: 'bronze' | 'silver' | 'gold';
  name: string;
  description: string;
  price: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  features: string[];
  isPopular?: boolean;
}

// تعریف ترتیب پلن‌ها برای ارتقا
const PLAN_ORDER: { [key in 'bronze' | 'silver' | 'gold']: number } = {
  bronze: 1,
  silver: 2,
  gold: 3
};

// تعریف ترتیب مدت زمان‌ها
const DURATION_ORDER: { [key in 'monthly' | 'quarterly' | 'yearly']: number } = {
  monthly: 1,
  quarterly: 2,
  yearly: 3
};

// ترجمه مدت زمان‌ها
const DURATION_LABELS: { [key in 'monthly' | 'quarterly' | 'yearly']: string } = {
  monthly: 'ماهانه',
  quarterly: 'سه‌ماهه',
  yearly: 'سالانه'
};

export default function UserSubscriptions() {
  const [selectedDuration, setSelectedDuration] = useState<
    "monthly" | "quarterly" | "yearly"
  >("monthly");
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  const mockPlans: SubscriptionPlan[] = [
    {
      id: "bronze",
      name: "پلن برنزی",
      description: "اقتصادی – جذب کاربر",
      price: {
        monthly: 199000,
        quarterly: 549000,
        yearly: 1999000,
      },
      features: [
        "دسترسی به برنامه تمرینی عمومی (PDF یا داخل سایت)",
        "برنامه بدنسازی پایه (۳–۴ روز در هفته)",
        "دسترسی به ویدیوهای آموزشی پایه",
        "پشتیبانی محدود (تیکت یا کامنت)",
        "بدون برنامه غذایی اختصاصی",
      ],
    },
    {
      id: "silver",
      name: "پلن نقره‌ای",
      description: "پرفروش‌ترین",
      price: {
        monthly: 399000,
        quarterly: 1099000,
        yearly: 3999000,
      },
      features: [
        "برنامه تمرینی شخصی‌سازی‌شده",
        "برنامه غذایی نیمه‌اختصاصی",
        "آپدیت برنامه ماهی ۱ بار",
        "دسترسی کامل به ویدیوها",
        "پشتیبانی سریع‌تر (چت یا واتساپ محدود)",
        "پیگیری پیشرفت (وزن، عکس، رکوردها)",
      ],
      isPopular: true,
    },
    {
      id: "gold",
      name: "پلن طلایی",
      description: "VIP – حرفه‌ای",
      price: {
        monthly: 699000,
        quarterly: 1999000,
        yearly: 6999000,
      },
      features: [
        "برنامه تمرینی کاملاً اختصاصی",
        "برنامه غذایی کاملاً شخصی",
        "آپدیت برنامه هر ۲ هفته",
        "پشتیبانی مستقیم و VIP",
        "مشاوره آنلاین (ماهانه ۱ یا ۲ جلسه)",
        "آنالیز بدن + اصلاح فرم حرکات",
        "دسترسی زودتر به امکانات جدید",
      ],
    },
  ];

  // دریافت اشتراک فعلی کاربر
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const subscription = await userService.getUserSubscription();
        setCurrentSubscription(subscription);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setCurrentSubscription(null);
      } finally {
        setSubscriptionLoading(false);
      }
    };
    fetchSubscription();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setPlans(mockPlans);
      setLoading(false);
    }, 500);
  }, []);

  const getPlanStatus = (planId: 'bronze' | 'silver' | 'gold') => {
    if (subscriptionLoading || !currentSubscription) {
      return { 
        status: 'available', 
        buttonText: `خرید پلن ${getPlanName(planId)}`,
        description: ''
      };
    }

    const currentPlanOrder = PLAN_ORDER[currentSubscription.plan as 'bronze' | 'silver' | 'gold'];
    const targetPlanOrder = PLAN_ORDER[planId];
    const currentDurationOrder = DURATION_ORDER[currentSubscription.duration as 'monthly' | 'quarterly' | 'yearly'];
    const targetDurationOrder = DURATION_ORDER[selectedDuration];

    // اگه هم پلن و هم مدت زمان یکسان باشه → فعال
    if (targetPlanOrder === currentPlanOrder && targetDurationOrder === currentDurationOrder) {
      return { 
        status: 'active', 
        buttonText: 'فعال', 
        description: 'اشتراک فعلی شما' 
      };
    }

    // اگه پلن پایین‌تر باشه → غیرفعال
    if (targetPlanOrder < currentPlanOrder) {
      return { 
        status: 'unavailable', 
        buttonText: 'در دسترس نیست',
        description: 'پلن پایین‌تر از اشتراک فعلی شماست' 
      };
    }

    // اگه پلن بالاتر باشه یا هم پلن ولی مدت زمان بیشتر → قابل ارتقا
    if (targetPlanOrder > currentPlanOrder || (targetPlanOrder === currentPlanOrder && targetDurationOrder > currentDurationOrder)) {
      const priceDiff = calculatePriceDifference(planId);
      let upgradeType = '';
      
      if (targetPlanOrder > currentPlanOrder && targetDurationOrder > currentDurationOrder) {
        upgradeType = 'پلن و مدت زمان';
      } else if (targetPlanOrder > currentPlanOrder) {
        upgradeType = 'پلن';
      } else {
        upgradeType = 'مدت زمان';
      }

      return { 
        status: 'upgrade', 
        buttonText: `ارتقا ${upgradeType}`,
        description: `افزایش ${priceDiff.toLocaleString('fa-IR')} تومان`,
        priceDiff
      };
    }

    // اگه هم پلن ولی مدت زمان کمتر → غیرفعال
    return { 
      status: 'unavailable', 
      buttonText: 'در دسترس نیست',
      description: 'مدت زمان کمتر از اشتراک فعلی شماست' 
    };
  };

  const getPlanName = (planId: string) => {
    return mockPlans.find(p => p.id === planId)?.name || planId;
  };

  const calculatePriceDifference = (targetPlanId: 'bronze' | 'silver' | 'gold') => {
    if (!currentSubscription) return 0;
    
    const currentPlan = mockPlans.find(p => p.id === currentSubscription.plan);
    const targetPlan = mockPlans.find(p => p.id === targetPlanId);
    
    if (!currentPlan || !targetPlan) return 0;
    
    // قیمت فعلی بر اساس مدت زمان فعلی
    const currentPrice = currentPlan.price[currentSubscription.duration as 'monthly' | 'quarterly' | 'yearly'];
    // قیمت هدف بر اساس مدت زمان انتخاب شده
    const targetPrice = targetPlan.price[selectedDuration];
    
    return targetPrice - currentPrice;
  };

  const handlePurchase = async (planId: 'bronze' | 'silver' | 'gold') => {
    const planStatus = getPlanStatus(planId);
    
    if (planStatus.status === 'active' || planStatus.status === 'unavailable') {
      toast.error(planStatus.description || 'این پلن در دسترس نیست');
      return;
    }

    try {
      setLoading(true);
      const res = await userService.createSubscription({
        planId,
        duration: selectedDuration,
      });

      toast.success(res.message);

      // رفرش اشتراک فعلی بعد از خرید
      const updatedSubscription = await userService.getUserSubscription();
      setCurrentSubscription(updatedSubscription);

      // اسکرول به بالا برای نمایش پیام موفقیت
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response?.data?.message || "خطا در خرید اشتراک");
      console.error('Subscription error:', err);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR") + " تومان";
  };

  const getDiscount = (monthly: number, other: number, months: number) => {
    const equivalentMonthly = other / months;
    const discount = Math.round(
      ((monthly - equivalentMonthly) / monthly) * 100,
    );
    return discount > 0 ? discount : 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری پلن‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* نمایش اشتراک فعلی */}
        {!subscriptionLoading && (
          <div className="mb-12">
            {currentSubscription ? (
              <div className="bg-linear-to-r from-green-50 to-emerald-100 border border-green-200 rounded-xl p-6 text-center shadow-sm">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h2 className="text-2xl font-bold text-green-800">اشتراک فعلی شما</h2>
                </div>
                <div className="text-lg font-bold text-gray-800 mb-2">
                  پلن {getPlanName(currentSubscription.plan)} - {DURATION_LABELS[currentSubscription.duration as 'monthly' | 'quarterly' | 'yearly']}
                </div>
                <div className="text-gray-700 space-x-1 space-x-reverse">
                  <span>منقضی می‌شود:</span>
                  <span className="font-medium">
                    {new Date(currentSubscription.expiresAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
                    <span className="text-sm text-gray-600">مبلغ پرداختی:</span>
                    <span className="font-bold text-red-600">
                      {currentSubscription.amount.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
                    <span className="text-sm text-gray-600">مدت:</span>
                    <span className="font-medium capitalize">
                      {DURATION_LABELS[currentSubscription.duration as 'monthly' | 'quarterly' | 'yearly']}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-linear-to-r from-yellow-50 to-amber-100 border border-yellow-200 rounded-xl p-6 text-center shadow-sm">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-yellow-800">بدون اشتراک فعال</h2>
                </div>
                <p className="text-gray-700 text-lg">
                  هنوز اشتراکی خریداری نکرده‌اید. پلن مناسب خود را انتخاب کنید!
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            پلن‌های اشتراک
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {currentSubscription 
              ? 'برای ارتقای اشتراک فعلی، پلن بالاتر یا مدت زمان بیشتر را انتخاب کنید' 
              : 'پلن مناسب خود را انتخاب کنید و بهترین نتایج را بگیرید'}
          </p>
        </div>

        {/* انتخاب مدت زمان */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            {(
              [
                { key: "monthly", label: "ماهانه" },
                { key: "quarterly", label: "۳ ماهه" },
                { key: "yearly", label: "سالانه" },
              ] as const
            ).map((duration) => (
              <button
                key={duration.key}
                onClick={() => {
                  setSelectedDuration(duration.key);
                  // رفرش وضعیت پلن‌ها بعد از تغییر مدت زمان
                  if (currentSubscription) {
                    setCurrentSubscription({...currentSubscription});
                  }
                }}
                disabled={loading}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  selectedDuration === duration.key
                    ? "bg-white text-red-600 shadow-sm border border-red-200"
                    : "text-gray-600 hover:text-gray-800"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {duration.label}
              </button>
            ))}
          </div>
        </div>

        {/* کارت‌های پلن */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const currentPrice = plan.price[selectedDuration];
            const isMonthly = selectedDuration === "monthly";
            const isQuarterly = selectedDuration === "quarterly";
            const isYearly = selectedDuration === "yearly";
            const planStatus = getPlanStatus(plan.id as 'bronze' | 'silver' | 'gold');

            return (
              <Card
                key={plan.id}
                className={`relative p-6 border-2 ${
                  plan.isPopular
                    ? "border-yellow-500 ring-2 ring-yellow-200"
                    : planStatus.status === 'active'
                    ? "border-green-500 ring-2 ring-green-200"
                    : planStatus.status === 'upgrade'
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200"
                } ${plan.isPopular || planStatus.status === 'active' ? "scale-105" : ""} 
                hover:shadow-xl transition-all duration-300 ${
                  planStatus.status === 'unavailable' ? 'opacity-60' : ''
                }`}
              >
                {/* برچسب وضعیت */}
                {planStatus.status === 'active' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold z-10">
                    اشتراک فعلی
                  </div>
                )}
                
                {planStatus.status === 'upgrade' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold z-10">
                    قابل ارتقا
                  </div>
                )}
                
                {plan.isPopular && planStatus.status !== 'active' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold z-10">
                    پرفروش‌ترین
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                {/* قیمت */}
                <div className="text-center mb-6">
                  <div className={`text-3xl font-bold mb-2 ${
                    planStatus.status === 'upgrade' ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {formatPrice(currentPrice)}
                  </div>
                  
                  {planStatus.status === 'upgrade' && planStatus.priceDiff && planStatus.priceDiff > 0 && (
                    <div className="text-sm text-blue-700 font-medium mb-1">
                      + {formatPrice(planStatus.priceDiff)} برای ارتقا
                    </div>
                  )}
                  
                  {!isMonthly && (
                    <div className="text-sm text-gray-500">
                      {isQuarterly &&
                        `(~${formatPrice(Math.round(plan.price.quarterly / 3))} در ماه)`}
                      {isYearly &&
                        `(~${formatPrice(Math.round(plan.price.yearly / 12))} در ماه)`}
                    </div>
                  )}

                  {/* تخفیف */}
                  {selectedDuration !== "monthly" && (
                    <div className="mt-3">
                      {isQuarterly && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          %{getDiscount(plan.price.monthly, plan.price.quarterly, 3)} تخفیف
                        </span>
                      )}
                      {isYearly && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          %{getDiscount(plan.price.monthly, plan.price.yearly, 12)} تخفیف
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* امکانات */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className={`mr-2 mt-1 ${
                        planStatus.status === 'active' ? 'text-green-500' :
                        planStatus.status === 'upgrade' ? 'text-blue-500' : 'text-green-500'
                      }`}>✓</span>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* دکمه خرید/ارتقا */}
                <button
                  onClick={() => handlePurchase(plan.id as 'bronze' | 'silver' | 'gold')}
                  disabled={loading || planStatus.status === 'unavailable' || planStatus.status === 'active'}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-all ${
                    planStatus.status === 'active'
                      ? "bg-green-500 cursor-not-allowed"
                      : planStatus.status === 'upgrade'
                      ? "bg-blue-600 hover:bg-blue-700"
                      : planStatus.status === 'unavailable'
                      ? "bg-gray-300 cursor-not-allowed"
                      : plan.isPopular
                      ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                      : "bg-red-600 hover:bg-red-700"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""} shadow-md hover:shadow-lg`}
                  title={planStatus.description}
                >
                  {loading && planStatus.status !== 'active' ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      در حال پردازش...
                    </span>
                  ) : (
                    planStatus.buttonText
                  )}
                </button>
                
                {/* توضیحات وضعیت */}
                {planStatus.description && planStatus.status !== 'active' && (
                  <p className={`text-center mt-3 text-xs ${
                    planStatus.status === 'upgrade' ? 'text-blue-600 font-medium' :
                    planStatus.status === 'unavailable' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {planStatus.description}
                  </p>
                )}
              </Card>
            );
          })}
        </div>

        {/* توضیحات تخفیف */}
        <div className="mt-16 text-center text-gray-600 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm">
          <p className="mb-2 font-medium">
            💡 هرچه مدت بیشتری خریداری کنید، تخفیف بیشتری دریافت می‌کنید!
          </p>
          <p className="text-sm">
            پرداخت امن از طریق درگاه‌های معتبر بانکی • لغو اشتراک تا ۲۴ ساعت قبل از انقضا
          </p>
        </div>
      </div>
    </div>
  );
}