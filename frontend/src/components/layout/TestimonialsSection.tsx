import React from "react";

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "جان کارتر",
      role: "بدنساز",
      image: "/images/t2-1.jpg",
      bg: "/images/t2-2.jpg",
      quote:
        "تناسب اندام در مورد بهتر بودن نسبت به شخص دیگری نیست ... این در مورد بهتر بودن از شماست.",
    },
    {
      name: "لیزا اسمیت",
      role: "بدنساز",
      image: "/images/t1-1.jpg",
      bg: "/images/t1-2.jpg",
      quote:
        "تناسب اندام در مورد بهتر بودن نسبت به شخص دیگری نیست ... این در مورد بهتر بودن از شماست.",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 md:px-8 bg-background">
      <div className="text-center mb-12">
        <h4 className="font-light text-muted-foreground">نظرات مشتریان ما</h4>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mt-4">
          داستان های <span className="text-primary font-bold">موفقیت</span> از زبان خودشان
        </h2>
        <div className="w-10 h-1 bg-primary mx-auto mt-4"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden border-b-4 border-primary shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{
                backgroundImage: `url(${testimonial.bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                aspectRatio: "3/2",
              }}
            >
              <div className="absolute inset-0 bg-linear-to-b from-black/70 to-black/90 flex flex-col p-6 items-center justify-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-primary object-cover shadow-lg mb-4"
                />
                <div className="text-center">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-base font-bold text-white mb-3">
                    <span>{testimonial.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {testimonial.role}
                    </span>
                  </div>
                  <p className="text-sm text-white leading-relaxed text-center">
                    {testimonial.quote}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;