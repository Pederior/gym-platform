export const hasFeature = (planId: string | null, feature: string): boolean => {
  const featuresMap: Record<string, string[]> = {
    bronze: ['public-workouts', 'basic-videos', 'ticket-support'],
    silver: ['personal-workout', 'semi-diet', 'chat-coach', 'progress-tracking'],
    gold: ['full-personal', 'vip-support', 'online-consultation', 'body-analysis']
  };

  if (!planId) return false;
  return featuresMap[planId]?.includes(feature) || false;
};

// استفاده در کامپوننت‌ها
// if (hasFeature(user.currentSubscription?.planId, 'chat-coach')) {
//   // نمایش چت
// }