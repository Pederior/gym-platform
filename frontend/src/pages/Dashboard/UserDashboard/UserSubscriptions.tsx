import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Card from "../../../components/ui/Card";
import {
  userService,
  type UserSubscriptionPlan,
} from "../../../services/userService";
import useDocumentTitle from "../../../hooks/useDocumentTitle";

interface CurrentSubscription {
  _id: string;
  plan: "bronze" | "silver" | "gold";
  duration: "monthly" | "quarterly" | "yearly";
  amount: number;
  expiresAt: string;
}

const PLAN_ORDER = { bronze: 1, silver: 2, gold: 3 };
const DURATION_ORDER = { monthly: 1, quarterly: 2, yearly: 3 };
const DURATION_LABELS = {
  monthly: "ماهانه",
  quarterly: "سه‌ماهه",
  yearly: "سالانه",
};

export default function UserSubscriptions() {
  useDocumentTitle("پلن‌های اشتراک");

  const [selectedDuration, setSelectedDuration] = useState<
    "monthly" | "quarterly" | "yearly"
  >("monthly");
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<UserSubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<CurrentSubscription | null>(null);

  useEffect(() => {
    const fetchCurrentSubscription = async () => {
      try {
        const subscription = await userService.getUserSubscription();
        setCurrentSubscription(subscription);
      } catch (err) {
        console.error("Error fetching current subscription:", err);
        setCurrentSubscription(null);
      }
    };
    fetchCurrentSubscription();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await userService.getSubscriptionPlans();
        setPlans(data);
      } catch (err) {
        console.error("Error fetching plans:", err);
        toast.error("خطا در بارگذاری پلن‌ها");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const getPlanStatus = (planId: "bronze" | "silver" | "gold") => {
    if (!currentSubscription) {
      return {
        status: "available",
        buttonText: `خرید پلن ${getPlanName(planId)}`,
        description: "",
      };
    }

    const currentPlanOrder = PLAN_ORDER[currentSubscription.plan];
    const targetPlanOrder = PLAN_ORDER[planId];
    const currentDurationOrder = DURATION_ORDER[currentSubscription.duration];
    const targetDurationOrder = DURATION_ORDER[selectedDuration];

    if (
      targetPlanOrder === currentPlanOrder &&
      targetDurationOrder === currentDurationOrder
    ) {
      return {
        status: "active",
        buttonText: "فعال",
        description: "اشتراک فعلی شما",
      };
    }

    if (targetPlanOrder < currentPlanOrder) {
      return {
        status: "unavailable",
        buttonText: "در دسترس نیست",
        description: "پلن پایین‌تر از اشتراک فعلی شماست",
      };
    }

    if (
      targetPlanOrder > currentPlanOrder ||
      (targetPlanOrder === currentPlanOrder &&
        targetDurationOrder > currentDurationOrder)
    ) {
      const priceDiff = calculatePriceDifference(planId);
      let upgradeType = "";

      if (
        targetPlanOrder > currentPlanOrder &&
        targetDurationOrder > currentDurationOrder
      ) {
        upgradeType = "پلن و مدت زمان";
      } else if (targetPlanOrder > currentPlanOrder) {
        upgradeType = "پلن";
      } else {
        upgradeType = "مدت زمان";
      }

      return {
        status: "upgrade",
        buttonText: `ارتقا ${upgradeType}`,
        description: `افزایش ${priceDiff.toLocaleString("fa-IR")} تومان`,
        priceDiff,
      };
    }

    return {
      status: "unavailable",
      buttonText: "در دسترس نیست",
      description: "مدت زمان کمتر از اشتراک فعلی شماست",
    };
  };

  const getPlanName = (planId: string) => {
    return plans.find((p) => p.id === planId)?.name || planId;
  };

  const calculatePriceDifference = (
    targetPlanId: "bronze" | "silver" | "gold",
  ) => {
    if (!currentSubscription) return 0;

    const currentPlan = plans.find((p) => p.id === currentSubscription.plan);
    const targetPlan = plans.find((p) => p.id === targetPlanId);

    if (!currentPlan || !targetPlan) return 0;

    const currentPrice = currentPlan.price[currentSubscription.duration];
    const targetPrice = targetPlan.price[selectedDuration];

    return targetPrice - currentPrice;
  };

  const handlePurchase = async (planId: "bronze" | "silver" | "gold") => {
    const planStatus = getPlanStatus(planId);

    if (planStatus.status === "active" || planStatus.status === "unavailable") {
      toast.error(planStatus.description || "این پلن در دسترس نیست");
      return;
    }

    try {
      setLoading(true);
      const res = await userService.createSubscription({
        planId,
        duration: selectedDuration,
      });
      toast.success(res.message);

      const updatedSubscription = await userService.getUserSubscription();
      setCurrentSubscription(updatedSubscription);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response?.data?.message || "خطا در خرید اشتراک");
      console.error("Subscription error:", err);
    }
  };

  const formatPrice = (price: number) =>
    price.toLocaleString("fa-IR") + " تومان";
  const getDiscount = (monthly: number, other: number, months: number) => {
    const equivalentMonthly = other / months;
    const discount = Math.round(
      ((monthly - equivalentMonthly) / monthly) * 100,
    );
    return discount > 0 ? discount : 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">در حال بارگذاری پلن‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Current Subscription */}
        <div className="mb-12">
          {currentSubscription ? (
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 text-center shadow-sm">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-accent">
                  اشتراک فعلی شما
                </h2>
              </div>
              <div className="text-lg font-bold text-foreground mb-2">
                پلن {getPlanName(currentSubscription.plan)} -{" "}
                {DURATION_LABELS[currentSubscription.duration]}
              </div>
              <div className="text-muted-foreground space-x-1 space-x-reverse">
                <span>منقضی می‌شود:</span>
                <span className="font-medium">
                  {new Date(currentSubscription.expiresAt).toLocaleDateString(
                    "fa-IR",
                  )}
                </span>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg shadow">
                  <span className="text-sm text-muted-foreground">مبلغ پرداختی:</span>
                  <span className="font-bold text-primary">
                    {currentSubscription.amount.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg shadow">
                  <span className="text-sm text-muted-foreground">مدت:</span>
                  <span className="font-medium capitalize">
                    {DURATION_LABELS[currentSubscription.duration]}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-6 text-center shadow-sm">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-warning">
                  بدون اشتراک فعال
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                هنوز اشتراکی خریداری نکرده‌اید. پلن مناسب خود را انتخاب کنید!
              </p>
            </div>
          )}
        </div>

        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            پلن‌های اشتراک
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {currentSubscription
              ? "برای ارتقای اشتراک فعلی، پلن بالاتر یا مدت زمان بیشتر را انتخاب کنید"
              : "پلن مناسب خود را انتخاب کنید و بهترین نتایج را بگیرید"}
          </p>
        </div>

        {/* Duration Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-muted p-1 rounded-lg flex flex-wrap justify-center gap-1">
            {(["monthly", "quarterly", "yearly"] as const).map((duration) => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                disabled={loading}
                className={`px-3 sm:px-6 py-2 rounded-md text-sm sm:text-base font-medium transition-colors ${
                  selectedDuration === duration
                    ? "bg-card text-primary shadow-sm border border-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {DURATION_LABELS[duration]}
              </button>
            ))}
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const currentPrice = plan.price[selectedDuration];
            const isMonthly = selectedDuration === "monthly";
            const isQuarterly = selectedDuration === "quarterly";
            const isYearly = selectedDuration === "yearly";
            const planStatus = getPlanStatus(plan.id);

            return (
              <Card
                key={plan.id}
                className={`relative p-6 border-2 ${
                  plan.isPopular
                    ? "border-accent ring-2 ring-accent/20"
                    : planStatus.status === "active"
                      ? "border-success ring-2 ring-success/20"
                      : planStatus.status === "upgrade"
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border"
                } ${plan.isPopular || planStatus.status === "active" ? "scale-105" : ""} 
                hover:shadow-xl transition-all duration-300 ${
                  planStatus.status === "unavailable" ? "opacity-60" : ""
                }`}
              >
                {/* Status Badges */}
                {planStatus.status === "active" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-success text-success-foreground px-4 py-1 rounded-full text-sm font-bold z-10">
                    اشتراک فعلی
                  </div>
                )}

                {planStatus.status === "upgrade" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold z-10">
                    قابل ارتقا
                  </div>
                )}

                {plan.isPopular && planStatus.status !== "active" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-bold z-10">
                    پرفروش‌ترین
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div
                    className={`text-2xl sm:text-3xl font-bold mb-2 ${planStatus.status === "upgrade" ? "text-primary" : "text-primary"}`}
                  >
                    {formatPrice(currentPrice)}
                  </div>

                  {planStatus.status === "upgrade" &&
                    planStatus.priceDiff &&
                    planStatus.priceDiff > 0 && (
                      <div className="text-sm text-primary font-medium mb-1">
                        + {formatPrice(planStatus.priceDiff)} برای ارتقا
                      </div>
                    )}

                  {!isMonthly && (
                    <div className="text-sm text-muted-foreground">
                      {isQuarterly &&
                        `(~${formatPrice(Math.round(plan.price.quarterly / 3))} در ماه)`}
                      {isYearly &&
                        `(~${formatPrice(Math.round(plan.price.yearly / 12))} در ماه)`}
                    </div>
                  )}

                  {/* Discounts */}
                  {selectedDuration !== "monthly" && (
                    <div className="mt-3">
                      {isQuarterly && (
                        <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
                          %
                          {getDiscount(
                            plan.price.monthly,
                            plan.price.quarterly,
                            3,
                          )}{" "}
                          تخفیف
                        </span>
                      )}
                      {isYearly && (
                        <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
                          %
                          {getDiscount(
                            plan.price.monthly,
                            plan.price.yearly,
                            12,
                          )}{" "}
                          تخفیف
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span
                        className={`mr-2 mt-1 ${planStatus.status === "active" ? "text-success" : planStatus.status === "upgrade" ? "text-primary" : "text-success"}`}
                      >
                        ✓
                      </span>
                      <span className="text-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={
                    loading ||
                    planStatus.status === "unavailable" ||
                    planStatus.status === "active"
                  }
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-all ${
                    planStatus.status === "active"
                      ? "bg-success cursor-not-allowed"
                      : planStatus.status === "upgrade"
                        ? "bg-primary hover:bg-primary/80"
                        : planStatus.status === "unavailable"
                          ? "bg-muted cursor-not-allowed"
                          : plan.isPopular
                            ? "bg-accent hover:bg-accent/80 text-foreground"
                            : "bg-primary hover:bg-primary/80"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""} shadow-md hover:shadow-lg`}
                  title={planStatus.description}
                >
                  {loading && planStatus.status !== "active" ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></span>
                      در حال پردازش...
                    </span>
                  ) : (
                    planStatus.buttonText
                  )}
                </button>

                {planStatus.description && planStatus.status !== "active" && (
                  <p
                    className={`text-center mt-3 text-xs ${
                      planStatus.status === "upgrade"
                        ? "text-primary font-medium"
                        : planStatus.status === "unavailable"
                          ? "text-muted-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    {planStatus.description}
                  </p>
                )}
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-muted-foreground max-w-2xl mx-auto p-6 bg-card rounded-xl shadow-sm border border-border">
          <p className="mb-2 font-medium">
            💡 هرچه مدت بیشتری خریداری کنید، تخفیف بیشتری دریافت می‌کنید!
          </p>
          <p className="text-sm">
            پرداخت امن از طریق درگاه‌های معتبر بانکی • لغو اشتراک تا ۲۴ ساعت قبل
            از انقضا
          </p>
        </div>
      </div>
    </div>
  );
}