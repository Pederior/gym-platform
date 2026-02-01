import React from "react";

const ClassSection: React.FC = () => {
  const classes = [
    {
      title: "حرفه ای",
      subtitle: "تمرینات آی بی اس",
      image: "/images/c1-1.jpg", // جایگزین کن با لینک واقعی عکس
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
    <section className="py-12 px-4 md:px-8 bg-white">
      {/* هدر */}
      <div className="text-center mb-20">
        <h4 className="font-light pb-7 mt-12 text-gray-400">کلاسهای تمرین</h4>
        <h2 className="text-2xl md:text-5xl font-light text-gray-800">
          برخی <span className="text-red-500 font-bold">کلاس ها</span> در هر
          سطحی
        </h2>
        <div className="w-12 h-1 bg-red-500 mx-auto mt-4"></div>
      </div>

      {/* شبکه کارت‌ها */}
      <div className="flex justify-center w-full px-4">
        <div className="w-11/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
          {classes.map((cls, index) => (
            <div
              key={index}
              className="relative rounded-sm group cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-2xl hover:animate-hoverFloat"
              style={{
                backgroundImage: `url(${cls.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "220px",
              }}
            >
              {/* Overlay تیره */}
              <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center p-6 transition-opacity group-hover:bg-black/70">
                <div className="relative flex flex-col items-center justify-center">
                  <span className="text-4xl text-red-500/50 font-bold -mb-3">{cls.title}</span>
                  <span className="text-3xl font-bold text-white mb-2">
                    {cls.title}
                  </span>
                </div>
                <div className="w-12 h-0.5 bg-white mb-4"></div>
                <p className="text-sm text-gray-200 mb-4 text-center">
                  {cls.subtitle}
                </p>
                <button className="text-lg bg-red-500 hover:bg-white hover:text-red-500 text-white py-2 px-5  transition-colors cursor-pointer">
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
