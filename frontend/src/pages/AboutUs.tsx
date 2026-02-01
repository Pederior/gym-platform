import TopBar from "../components/layout/TopBar";
import Navbar from "../components/layout/Navbar";
import { HiHome } from "react-icons/hi";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import Card from "../components/ui/Card";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import Footer from "../components/layout/Footer";
import { useEffect, useState } from "react";

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

  const [progress, setProgress] = useState({
    fitness: 0,
    expertise: 0,
    workout: 0,
    strength: 0,
    endurance: 0,
  });

  const targets = {
    fitness: 88,
    expertise: 92,
    workout: 94,
    strength: 78,
    endurance: 86,
  };

  useEffect(() => {
    const timers = Object.entries(targets).map(([key, target]) => {
      return setTimeout(
        () => {
          setProgress((prev) => ({
            ...prev,
            [key]: target,
          }));
        },
        300 + parseInt(key, 36) * 100,
      );
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const progressData = [
    { key: "fitness", label: "فیتنس", value: progress.fitness },
    { key: "expertise", label: "بدنسازی", value: progress.expertise },
    { key: "workout", label: "آموزش شخصی", value: progress.workout },
    { key: "strength", label: "دروس شناگری", value: progress.strength },
    { key: "endurance", label: "ماساژ ورزشی", value: progress.endurance },
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

            <div className="w-16 h-1 bg-red-500 mb-8"></div>

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
              <div className="text-4xl md:text-7xl font-bold text-red-500 mb-2">
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
          <div className="w-20 h-1 bg-red-500 mx-auto mt-2"></div>
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

            <h1 className="text-4xl md:text-6xl font-bold text-red-500 mb-4">
              <span className="border-b border-dashed border-red-500">
                ۴۰٪ تخفیف
              </span>{" "}
              برای همه پلن‌ها
            </h1>

            <Link
              to="/classes"
              className="lg:w-1/4 w-3/5 mt-28 flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 font-sm hover:bg-white hover:text-red-500 transition-colors"
            >
              <FaRegUser />
              ثبت نام کنید
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <img
                src="/images/skills-1.jpg"
                alt="مربی در حال تمرین"
                className="w-full h-auto shadow-xl"
              />
            </div>
          </div>
          {/* //! FIX MEEEEEEEEEEEEEEEEE */}
          <div className="lg:w-1/2">
          <span>نابرده رنج گنج میسر نمی شود</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-right">
              مهارت‌های ما
            </h2>

            <div className="space-y-6">
              {progressData.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <div className="text-right w-32">
                    <div className="text-xl font-bold text-red-600">
                      {item.value}%
                    </div>
                    <div className="text-gray-700">{item.label}</div>
                  </div>

                  <div className="w-full max-w-xs">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-red-600 h-3 rounded-full transition-all duration-1500 ease-out"
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
