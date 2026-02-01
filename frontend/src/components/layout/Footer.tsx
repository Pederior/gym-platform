import React from "react";
import { Link } from "react-router-dom";
import UnderLine from "../Features/UnderLine";
import { FaRegClock } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";

interface NewsItem {
  title: string;
  date: string;
  imageSrc: string;
}

const Footer: React.FC = () => {
  const newsItems: NewsItem[] = [
    {
      title: "از امروز شروع کنید",
      date: " ۲۱ خرداد ۱۴۰۳ ",
      imageSrc: "/images/f1-1.jpg",
    },
    {
      title: "چگونه بدن خود را بسازیم",
      date: " ۲۱ خرداد ۱۴۰۳",
      imageSrc: "/images/f1-2.jpg",
    },
    {
      title: "سخت کار کنید",
      date: "۲۱ خرداد ۱۴۰۳ ",
      imageSrc: "/images/f1-3.jpg",
    },
  ];

  return (
    <footer
      className=" text-white py-8 px-6 md:px-12 lg:px-24 relative"
      style={{
        backgroundImage: "url(/images/footer.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0 bg-black opacity-70 z-0"
        aria-hidden="true"
      ></div>
      {/* Main Content */}
      <div className="relative z-10 mt-5 w-11/12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h2 className="text-base font-bold mb-4 flex items-center">
              درباره باشگاه بدنسازی
            </h2>
            <UnderLine />
            <p className="mb-6 text-gray-300 leading-relaxed">
              این یک متن آزمایشی است. لورم ایپسوم متن ساختگی با تولید سادگی
              نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.
            </p>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>• تماس: ۰۲۱۱۲۳۴۵۶۷۸۹</p>
              <p>• ایمیل: gym@xtra.com</p>
              <p>• تهران، خ آزادی، خ یهودی، ساختمان ۱۱</p>
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold mb-4 flex items-center">
              آخرین اخبار
            </h2>
            <UnderLine />
            <div className="space-y-4">
              {newsItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 space-x-reverse"
                >
                  <div className="relative w-16 h-16 cursor-pointer group overflow-hidden ml-2">
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-sm transition-transform duration-300 group-hover:scale-105 group-hover:blur-[2px]"
                    />

                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-70 transition-opacity duration-300 z-10"></div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <FaLink className="text-white text-xl transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* بخش متن */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-400 flex items-center mt-1">
                      <FaRegClock className="ml-2" />
                      {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold mb-4 flex items-center">
              گالری تصاویر
            </h2>
            <UnderLine />
            <div className="grid grid-cols-2 gap-2">
              {[
                { src: "/images/f2-1.jpg", alt: "گالری ۱" },
                { src: "/images/f2-2.jpg", alt: "گالری ۲" },
              ].map((img, index) => (
                <div
                  key={index}
                  className="relative w-full h-52 overflow-hidden rounded-sm cursor-pointer group"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FaPlus className="text-white text-2xl scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 pt-6 pb-4 "></div>
      <div className="flex flex-col md:flex-row justify-between items-center text-sm z-10 relative">
        <div className="text-center md:text-right text-white">
          © کلیهٔ حقوق این سایت متعلق به{" "}
          <span className="text-red-500 font-bold">باشگاه بدنسازی فینیکس</span>{" "}
          (FynixClub) بوده و هرگونه کپی‌برداری پیگرد قانونی دارد. ۱۴۰۴
        </div>
        <div className="my-2 md:my-0">
          <Link to="#" className="text-white hover:text-red-500 no-underline">
            قوانین سایت
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
