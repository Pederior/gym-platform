// src/pages/Home.tsx
import HeaderMain from "../components/layout/HeaderMain";
import HeroCard from "../components/Features/HeroCard";
import ExerciseSection from "../components/layout/ExerciseSection";
import MuscleBuilding from "../components/layout/MuscleBuilding";
import ClassSection from "../components/layout/ClassSection";
import PricingSection from "../components/layout/PricingSection";
import TestimonialsSection from "../components/layout/TestimonialsSection";
import ImageFitnessSection from "../components/layout/ImageFitnessSection";
import Footer from "../components/layout/Footer";
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Home() {
  useDocumentTitle('صفحه اصلی');
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <HeaderMain />

      {/* Hero Cards */}
      <div className="flex justify-center gap-5 -mt-24">
        <HeroCard
        fadeTitle="فیتنس"
          title="برای زنان"
          description="تمرینات شدت بالا یکی از بهترین راه‌ها برای چربی‌سوزی هستند"
          buttonText="اطلاعات بیشتر"
          backgroundImage="/images/women-fitness.jpg"
          width={600}
          height={350}
          titleSize="text-3xl"
          descriptionSize="text-base"
          buttonSize="text-base"
          backGroundFade="bg-gradient-to-t from-red-500/50 to-black/50"
        />
        <HeroCard
        fadeTitle="عضله"
          title="برای مردان"
          description="ترکیبی از انفوزیون های شدید قلب با استفاده از فاصله های خفیف تا دور شدن ..."
          buttonText="اطلاعات بیشتر"
          backgroundImage="/images/men-fitness.jpg"
          width={600}
          height={350}
          titleSize="text-3xl"
          descriptionSize="text-base"
          buttonSize="text-base"
          backGroundFade="bg-gradient-to-t from-red-500/50 to-black/50"
        />
      </div>

      {/* Welcome Part */}
      <ExerciseSection />

      {/* MuscleBuilding Part */}
      <MuscleBuilding />

      {/* لیست کلاس‌ها */}
      <ClassSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* TestimonialsSection */}
      <TestimonialsSection />

      {/* ImageFitnessSection */}
      <ImageFitnessSection />

      {/* Footer */}
      <Footer />
      
    </div>
  );
}
