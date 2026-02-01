import React from "react";
import { FiExternalLink } from "react-icons/fi";
const PricingSection: React.FC = () => {
  const plans = [
    {
      fadeTitle: "عضلات",
      title: "ساخت عضلات",
      price: "۵۰ ه ت",
      duration: "/ ماهیانه",
      features: [
        "تمرین جدید استقامت عضلانی خود را به چالش می‌کشد و اضافه کردن برخی از اندازه به قاب خود، تمرینات عضلانی سه بعدی ممکن است برای شما مناسب باشد!",
      ],
    },
    {
      fadeTitle: "فیتنس",
      title: "پکیج فیتنس",
      price: "۶۰ ه ت",
      duration: "/ ماهیانه",
      features: [
        "شانه‌های بدن بیشتر نادیده گرفته شده برای زنان است. این سه حرکات شانه برای فرم دادن به کلی و قدرت عملکرد بسیار عالی است. ورزش برای تناسب اندام",
      ],
    },
    {
      fadeTitle: "هیبرید",
      title: "هیبرید نهایی",
      price: "۷۹ ه ت",
      duration: "/ ماهیانه",
      features: [
        "با استفاده از این برنامه تمرینی که در تمرینات سنگین سخت می‌شود، قدرت پای خود و پایه‌های پایه را بسازید، اما در نتیجه ارائه نتایج بسیار موثر است.",
      ],
    },
  ];

  return (
    <section
      className="relative py-16 px-4 md:px-8 text-white "
      style={{
        backgroundImage: `url('/images/Pricing.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 max-w-7xl mx-auto md:w-11/12">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
          <div className="lg:w-1/5 space-y-6">
            <h4 className="text-white font-thin text-lg">برنامه و</h4>
            <h2 className="text-3xl md:text-4xl font-light leading-normal">
              پلن برای{" "}
              <span className="text-5xl mt-3 text-red-500 block font-bold">
                هرکسی
              </span>
            </h2>
            <div className="w-10 h-1 bg-red-500 mt-4 mb-6"></div>
            <p className="text-gray-200 leading-relaxed">
              هدف این است که در ماه جاری یک جرم جدی ایجاد شود؟ اگر شما در عرض
              چند ماه آینده برای رسیدن به توده عضلانی، این تمرین حجم بالا برای
              شما مناسب است.
            </p>
          </div>

          {/* <div className="md:h-[400px] lg:w-3/4 grid grid-cols-1  sm:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div className="h-full transition-shadow duration-300 hover:shadow-2xl hover:animate-hoverFloat ">
                <div
                  key={index}
                  className="h-full bg-gradient-to-b from-black/90 to-black/10 rounded-md p-6"
                >
                  <h3 className="md:text-4xl text-5xl text-red-500/20 font-bold -mb-5 mr-2">
                    {plan.fadeTitle}
                  </h3>

                  {plan.title.split(" ").length > 0 ? (
                    <>
                      <span className="text-3xl md:text-xl text-red-500 font-bold inline-block ml-1 mr-2 border-b border-dashed border-red-500">
                        {plan.title.split(" ")[0]}
                      </span>
                      <span className="text-lg text-gray-200">
                        {plan.title.split(" ").slice(1).join(" ")}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg text-red-500">{plan.title}</span>
                  )}

                  <div className="my-14 flex items-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-gray-400 block">
                      {plan.duration}
                    </span>
                  </div>

                  <ul className="space-y-2 text-sm text-gray-200  list-none">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="leading-relaxed">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="w-full bg-red-500 hover:bg-white text-white hover:text-red-500 py-3 px-4 flex items-center justify-center gap-2 transition-colors cursor-pointer">
                جزئیات بیشتر <FiExternalLink />
                </button>
                <div className="w-full h-1 bg-red-500 rounded-b-sm"></div>
              </div>
            ))}
          </div> */}
          <div className="md:h-[500px] lg:w-3/4 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="flex flex-col h-full transition-shadow duration-300 hover:shadow-2xl hover:animate-hoverFloat "
              >
                {/* Main content with gradient */}
                <div className="flex-1 bg-gradient-to-b from-black/90 to-black/10 rounded-t-md p-6 ">
                  <h3 className="md:text-5xl text-5xl text-red-500/20 font-bold -mb-5 mr-2 text-center sm:text-right">
                    {plan.fadeTitle}
                  </h3>
                  <div className="text-center sm:text-right">
                    {plan.title.split(" ").length > 0 ? (
                      <>
                        <span className="text-3xl md:text-3xl text-red-500 font-bold inline-block ml-1 mr-2 border-b border-dashed border-red-500">
                          {plan.title.split(" ")[0]}
                        </span>
                        <span className="text-2xl text-gray-200">
                          {plan.title.split(" ").slice(1).join(" ")}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg text-red-500">{plan.title}</span>
                    )}
                  </div>
                  <div className="my-14 flex items-center justify-center md:justify-start">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-gray-400 block">
                      {plan.duration}
                    </span>
                  </div>

                  <ul className="space-y-2 text-sm text-gray-200 list-none mb-10">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="leading-relaxed">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <button className="w-full bg-red-500 hover:bg-white text-white hover:text-red-500 py-3 px-4 flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-b-md text-base">
                  جزئیات بیشتر <FiExternalLink />
                </button>

                {/* Bottom accent line */}
                <div className="w-full h-1 bg-red-500 rounded-b-sm -mt-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
