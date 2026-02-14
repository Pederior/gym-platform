import React from "react";

const ClassSection: React.FC = () => {
  const classes = [
    {
      title: "حرفه ای",
      subtitle: "تمرینات آی بی اس",
      image: "/images/c1-1.jpg",
    },
    {
      title: "مبتدی",
      subtitle: "بدنسازی",
      image: "/images/c1-2.jpg",
    },
    {
      title: "شخصی",
      subtitle: "تمرینات پایه",
      image: "/images/c1-3.jpg",
    },
    {
      title: "اختصاصی",
      subtitle: "هر تمرینی",
      image: "/images/c1-4.jpg",
    },
    {
      title: "سطح بالا",
      subtitle: "تمرینات بازو",
      image: "/images/c1-5.jpg",
    },
    {
      title: "هرجا",
      subtitle: "تمرینات سرعتی",
      image: "/images/c1-6.jpg",
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 md:px-8 bg-background">
      {/* هدر */}
      <div className="text-center mb-16">
        <h4 className="font-light pb-7 mt-12 text-muted-foreground">کلاسهای تمرین</h4>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-foreground">
          برخی <span className="text-primary font-bold">کلاس ها</span> در هر سطحی
        </h2>
        <div className="w-12 h-1 bg-primary mx-auto mt-4"></div>
      </div>

      {/* شبکه کارت‌ها */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls, index) => (
            <div
              key={index}
              className="relative rounded-xl group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
              style={{
                backgroundImage: `url(${cls.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                aspectRatio: "3/2",
              }}
            >
              {/* Overlay تیره */}
              <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center p-6 transition-all duration-300 group-hover:bg-black/70">
                <div className="relative flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-4xl text-primary/30 font-bold -mb-2">
                    {cls.title}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    {cls.title}
                  </span>
                </div>
                <div className="w-12 h-0.5 bg-white mb-4"></div>
                <p className="text-sm text-gray-200 mb-4 text-center">
                  {cls.subtitle}
                </p>
                <button className="text-base bg-primary hover:bg-primary/80 hover:text-primary-foreground text-primary-foreground py-2 px-6 rounded-lg font-medium transition-all duration-300 cursor-pointer">
                  ثبت نام
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClassSection;