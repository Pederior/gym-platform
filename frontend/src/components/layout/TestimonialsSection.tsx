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
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="text-center mb-12">
        <h4 className="font-light text-gray-500">نظرات مشتریان ما</h4>
        <h2 className="text-3xl md:text-4xl font-light mt-4">
          داستان های <span className="text-red-500 font-bold text-5xl">موفقیت</span> از زبان خودشان
        </h2>
        <div className="w-10 h-1 bg-red-500 mx-auto mt-4"></div>
      </div>

      <div className="w-10/12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="relative rounded-sm overflow-hidden border-b-4 border-red-500"
            style={{
              backgroundImage: `url(${testimonial.bg})`,
              backgroundSize: "cover",
              backgroundPosition: "top",
              backgroundRepeat: "no-repeat",
              height: "200px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-red-950/70 to-black/70 flex flex-col p-6 items-center justify-center">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-20 h-20 rounded-full border-4 border-red-500 object-cover shadow-lg mb-5"
              />
              <div>
                <div className="flex items-center gap-2 text-md font-bold text-white mb-3">
                  <span>{testimonial.name}</span>
                  <span className="text-sm font-thin text-gray-300/50">
                    {testimonial.role}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed text-center">
                {testimonial.quote}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
