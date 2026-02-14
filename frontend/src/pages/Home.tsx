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
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Home() {
  useDocumentTitle("صفحه اصلی");
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <HeaderMain />

      {/* Hero Cards */}
      <div className="px-4 lg:-mt-24 md:-mt-12 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          <HeroCard
            fadeTitle="فیتنس"
            title="برای زنان"
            description="تمرینات شدت بالا یکی از بهترین راه‌ها برای چربی‌سوزی هستند"
            buttonText="اطلاعات بیشتر"
            backgroundImage="/images/women-fitness.jpg"
          />
          <HeroCard
            fadeTitle="عضله"
            title="برای مردان"
            description="ترکیبی از انفوزیون های شدید قلب با استفاده از فاصله های خفیف تا دور شدن ..."
            buttonText="اطلاعات بیشتر"
            backgroundImage="/images/men-fitness.jpg"
          />
        </div>
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
