import TopBar from "../components/layout/TopBar";
import Navbar from "../components/layout/Navbar";
import { HiHome } from "react-icons/hi";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import Card from "../components/ui/Card";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import Footer from "../components/layout/Footer";

export default function AboutUs() {
  const stats = [
    { value: "۷۵", label: "سال تجربه" },
    { value: "۱,۴۰۰", label: "عضو" },
    { value: "۹۲", label: "مربی کارشناس" },
    { value: "۸۰۰+", label: "برنده جهانی" },
  ];

  const trainers = [
    { name: "مربی فیتنس", title: "مربی فيتنس", img: "coach1.jpg" },
    { name: "مربی", title: "مربی", img: "coach2.jpg" },
    { name: "مربی", title: "مربی", img: "coach3.jpg" },
    { name: "مربی", title: "مربی", img: "coach4.jpg" },
    { name: "مربی", title: "مربی", img: "coach1.jpg" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div
        className="w-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bg-header.jpg')",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <TopBar iconColor="gray-300" textColor="white" />
          <Navbar />
        </div>
        <div className="max-w-7xl mx-auto flex justify-between my-5 pb-5">
          <span className="text-white text-lg font-bold">درباره ما</span>
          <div className="flex text-lg text-white gap-2">
            <Link to="/">
              <HiHome className="font-bold" />
            </Link>
            <MdKeyboardDoubleArrowLeft className="text-gray-300/70" />
            <span className="text-sm">درباره ما</span>
          </div>
        </div>
      </div>

      {/* Body */}

      <div className="w-full mx-auto py-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 mb-36">
          <div className="lg:w-1/2 text-right">
            <div className="text-gray-500 text-sm mb-4">درباره تیم ما</div>

            <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-6">
              <span className="text-black font-medium">چرا</span> انتخاب ما؟
            </h1>

            <div className="w-16 h-1 bg-myred mb-8"></div>

            <p className="text-gray-700 leading-relaxed space-y-4">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
              استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنام و مجله در
              ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز
              و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد.
              <br />
              <br />
              کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان
              جامعه و متخصصان را می‌طلبد تا با نرم افزارها شناخت بیشتری را برای
              طراحان رایانه ای علی الخصوص طراحان و فرهنگ پیشرو در زبان فارسی
              ایجاد کرد. در این صورت می‌توان.
            </p>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <img
              src="/images/tools-1-1.jpg"
              alt="Weightlifting Equipment"
              className="w-full max-w-md h-auto object-contain"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <Card
              key={idx}
              className="px-6 py-12 text-center border border-gray-200 hover:border-red-300 transition-colors"
            >
              <div className="text-4xl md:text-7xl font-bold text-myred mb-2">
                {stat.value}
              </div>
              <div className="text-gray-700 font-light text-xl mt-5">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        <div className="max-w-7xl mx-auto text-center mb-12 mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            مربیان حرفه‌ای ما
          </h2>
          <div className="w-20 h-1 bg-myred mx-auto mt-2"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-6 ">
          {trainers.map((trainer, idx) => (
            <div key={idx} className="group">
              <div
                className="aspect-1/2 rounded-lg overflow-hidden bg-gray-200
                         transition-all duration-300
                         group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105
                         grayscale-100 brightness-[0.7]"
                style={{
                  backgroundImage: `url('/images/${trainer.img}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="mt-4 text-center">
                <div className="font-bold text-gray-800">{trainer.name}</div>
                <div className="text-sm text-gray-500">{trainer.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div
          className=" w-full h-140 bg-cover flex items-center lg:justify-start justify-center mt-20"
          style={{
            backgroundImage: "url('/images/offer1.jpg')",
          }}
        >
          <div className="max-w-7xl relative z-10 text-white mr-8 lg:mr-20 lg:flex-none lg:items-start md:flex-none flex-col flex items-center justify-center">
            <p className="text-lg md:text-2xl font-bold mb-2">
              کلاس‌های بدنسازی تابستان امسال
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-myred mb-4">
              <span className="border-b border-dashed border-myred">
                ۴۰٪ تخفیف
              </span>{" "}
              برای همه پلن‌ها
            </h1>

            <Link
              to="/classes"
              className="lg:w-1/4 w-3/5 mt-28 flex items-center justify-center gap-2 bg-myred text-white px-6 py-3 font-sm hover:bg-white hover:text-myred transition-colors"
            >
              <FaRegUser />
              ثبت نام کنید
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 flex ">
            <div className="relative max-w-142.5 h-full">
              <img
                src="/images/skills-1.jpg"
                alt="مربی در حال تمرین"
                className="w-full h-full shadow-xl"
              />
            </div>
          </div>
          <div className="relative lg:w-1/2 bg-white mx-4 p-2.5 px-5">
            <span className="text-right font-light text-gray-700/50">نابرده رنج گنج میسر نمی شود</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-right mt-5">
             <span className="text-myred">مهارت های </span>ما
             <div className="bg-myred md:w-13 w-10 h-1 mt-4"></div>
            </h2>

            <div className="w-full my-6">
              <span className="block text-base font-semibold text-gray-700">
                فیتنس
              </span>
              <div className="h-2 w-full  mt-1.5 bg-black/10">
                <span className="relative block h-full w-[88%] bg-linear-to-l from-crimson via-red-800 to-black animate-progress opacity-0">
                  <span className="absolute -left-1 -top-8 text-2xl font-extralight text-crimson p-0.5 px-1.5 z-10">
                    ۸۸%
                  </span>
                </span>
              </div>
            </div>

            <div className="w-full my-6">
              <span className="block text-base font-semibold text-gray-700">
                بدنسازی
              </span>
              <div className="h-2 w-full mt-1.5 bg-black/10">
                <span className="relative block h-full w-[92%] bg-linear-to-l from-crimson via-red-800 to-black animate-progress opacity-0 delay-100">
                  <span className="absolute -left-1 -top-8 text-2xl font-extralight text-crimson p-0.5 px-1.5 z-10">
                    ۹۲%
                  </span>
                </span>
              </div>
            </div>

            <div className="w-full my-6">
              <span className="block text-base font-semibold text-gray-700">
                آموزش شخصی
              </span>
              <div className="h-2 w-full mt-1.5 bg-black/10">
                <span className="relative block h-full w-[94%] bg-linear-to-l from-crimson via-red-800 to-black animate-progress opacity-0 delay-200">
                  <span className="absolute -left-1 -top-8 text-2xl font-extralight text-crimson p-0.5 px-1.5 z-10">
                    ۹۴%
                  </span>
                </span>
              </div>
            </div>

            <div className="w-full my-6">
              <span className="block text-base font-semibold text-gray-700">
                رژیم غذایی
              </span>
              <div className="h-2 w-full mt-1.5 bg-black/10">
                <span className="relative block h-full w-[78%] bg-linear-to-l from-crimson via-red-800 to-black animate-progress opacity-0 delay-300">
                  <span className="absolute -left-1 -top-8 text-2xl font-extralight text-crimson p-0.5 px-1.5 z-10">
                    ۷۸%
                  </span>
                </span>
              </div>
            </div>

            <div className="w-full my-6">
              <span className="block text-base font-semibold text-gray-700">
                ماساژ ورزشی
              </span>
              <div className="h-2 w-full mt-1.5 bg-black/10">
                <span className="relative block h-full w-[86%] bg-linear-to-l from-crimson via-red-800 to-black animate-progress opacity-0 delay-300">
                  <span className="absolute -left-1 -top-8 text-2xl font-extralight text-crimson p-0.5 px-1.5 z-10">
                    ۸۶%
                  </span>
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
