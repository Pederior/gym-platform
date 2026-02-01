import React, { useState } from "react";
import { FaClock } from "react-icons/fa";
import VideoOverlay from "./VideoOverlay";

type TabType = "muscle" | "routine" | "tips" | "cardio";

const MuscleBuilding: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("muscle");

  const renderContent = () => {
    switch (activeTab) {
      case "muscle":
        return (
          <>
            <p className="text-base mb-6 leading-7 bg-black/50 p-2 rounded-md">
              این ساختار عضلانی، مدار پیشرفته ممکن است با یک تمرین معمولی آغاز
              شود: دمبل چانه را پاک می کند، همچنین به عنوان حرکتی که شما را به
              قفسه کشیدن دمبل سنگین پس از یک مجموعه خسته کننده از فر ها می
              دانید. تحول شما به عنوان یک نتیجه از این روال خواهید دید.
            </p>

            <div className="flex gap-4 items-center bg-gray-800 p-4 rounded-lg shadow-md mt-6">
              <FaClock className="text-red-500 text-xl mr-4" />
              <div>
                <p className="font-bold">دمبل پیشرفته</p>
                <p className="text-sm text-gray-300">۴۵ دقیقه روزانه</p>
              </div>
            </div>
          </>
        );

      case "routine":
        return (
          <>
            <p className="text-base mb-6 leading-7 bg-black/50 p-2 rounded-md">
              ابتدا ابتدا با دمبل پاك كردن قبل از رفتن به سكوي هاليبريد و تميز
              كردن، كه چهارچوبهاي خود را، همسترينگ و گلوتاتيو را سخت تر ميكند،
              اولين بار شروع ميشود. پایان دادن به مجموعه با یک دمبل چانه زدن
              تمیز و اسکوات و مطبوعات برای آوردن دایره کامل پیشرفت ...
            </p>
            <div className="flex gap-4 items-center bg-gray-800 p-4 rounded-lg shadow-md mt-6">
              <FaClock className="text-red-500 text-xl mr-4" />
              <div>
                <p className="font-bold">۵ تمرین با شدت بالا</p>
                <p className="text-sm text-gray-300">تمرینات شدید طوفانی</p>
              </div>
            </div>
          </>
        );

      case "tips":
        return (
          <>
            <p className="text-base mb-6 leading-7 bg-black/50 p-2 rounded-md">
              مهمترین قسمت فشار دادن نیمکت فقط می تواند تنظیم شما باشد. هنگامی
              که روی نیمکت نشسته اید، اطمینان حاصل کنید که چشمان خود را مستقیما
              در زیر نوار قرار دهید. این به دو دلیل کمک می کند. اول، به شما این
              امکان را می دهد که نوار را به جلو بکشید، شانه های خود را باز کنید
              و در موقعیت قفسه مناسب قرار بگیرید.
            </p>
            <div className="flex gap-4 items-center bg-gray-800 p-4 rounded-lg shadow-md mt-6">
              <FaClock className="text-red-500 text-xl mr-4" />
              <div>
                <p className="font-bold">افزایش پرس سینه</p>
                <p className="text-sm text-gray-300">
                  برخی از نکات جدید برای افزایش مطبوعات
                </p>
              </div>
            </div>
          </>
        );

      case "cardio":
        return (
          <>
            <p className="text-base mb-6 leading-7 bg-black/50 p-2 rounded-md">
              اجرا در یک مسیر یا فیلد توجه داشته باشید یک نقطه در مسیر است که ۲۰
              متر به سمت یک طرف شما و یکی که ۲۰ متر به طرف مقابل است. روشن کردن
              و اجرای ۲۰ متر به یک نشانگر. توقف، جهت دیگر را روشن کنید، و تمام
              مسیر را به عقب بر گردانید تا نشانگر دوم را بزنید.
            </p>
            <div className="flex gap-4 items-center bg-gray-800 p-4 rounded-lg shadow-md mt-6">
              <FaClock className="text-red-500 text-xl mr-4" />
              <div>
                <p className="font-bold">۱،۰۰۰ متر شاتل اجرا</p>
                <p className="text-sm text-gray-300">چهار روز هر هفته</p>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="relative bg-black text-white h-screen flex md:flex-row flex-col px-7 items-center bg-cover"
      style={{ backgroundImage: "url('/images/HeaderBg.jpg')" }}
    >
      <div className="min-h-[350px] md:w-1/2 w-full mt-10 md:mt-0 md:pr-16">
        <nav className=" w-full flex justify-start gap-6 px-6 mb-6 text-base border-b-4 border-gray-500/70">
          <span
            onClick={() => setActiveTab("muscle")}
            className={`cursor-pointer inline-block pb-2 border-b-4 transition-colors duration-300 ${
              activeTab === "muscle"
                ? "text-red-500 border-red-500 font-bold"
                : "text-white border-transparent"
            }`}
            // style={{borderBottom: '6px solid red'}}
          >
            ساخت عضله
          </span>

          <span
            onClick={() => setActiveTab("routine")}
            className={`cursor-pointer inline-block pb-2 border-b-4 transition-colors duration-300 ${
              activeTab === "routine"
                ? "text-red-500 border-red-500 font-bold"
                : "border-transparent"
            }`}
          >
            تمرینات روتین
          </span>

          <span
            onClick={() => setActiveTab("tips")}
            className={`cursor-pointer inline-block pb-2 border-b-4 transition-colors duration-300 ${
              activeTab === "tips"
                ? "text-red-500 border-red-500 font-bold"
                : "border-transparent"
            }`}
          >
            نکات حرفه ای
          </span>

          <span
            onClick={() => setActiveTab("cardio")}
            className={`cursor-pointer inline-block pb-2 border-b-4 transition-colors duration-300 ${
              activeTab === "cardio"
                ? "text-red-500 border-red-500 font-bold "
                : "border-transparent"
            }`}
          >
            تمرینات هوازی
          </span>
        </nav>
        {renderContent() && (
          <div key={activeTab} className="animate-fade-in-up min-h-[180px] flex flex-col justify-start">{renderContent()}</div>
        )}
      </div>

      {/* Right: play Button */}
      <div className=" md:w-1/2 w-full flex justify-center">
        <VideoOverlay />
      </div>
    </div>
  );
};

export default MuscleBuilding;
