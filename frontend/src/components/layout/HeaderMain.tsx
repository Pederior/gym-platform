import Navbar from "./Navbar";
import TopBar from "./TopBar";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import { useAppSelector } from "../../store/hook";
import { useEffect, useState } from "react";

export default function HeaderMain() {
  const { user, token } = useAppSelector((state) => state.auth);
  const [fontSize, setFontSize] = useState("text-4xl");

  useEffect(() => {
    const updateFontSize = () => {
      if (window.innerWidth < 640) {
        setFontSize("text-xl");
      } else if (window.innerWidth < 768) {
        setFontSize("text-2xl");
      } else if (window.innerWidth < 1024) {
        setFontSize("text-3xl");
      } else {
        setFontSize("text-4xl");
      }
    };

    updateFontSize();
    window.addEventListener("resize", updateFontSize);
    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center flex flex-col items-center"
        style={{ backgroundImage: "url('/images/HeaderBg.jpg')" }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <TopBar textColor="gray-300" iconColor="white" />
          <Navbar />
        </div>
        <div className="min-h-screen flex items-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <div 
              className={`font-bold ${fontSize} leading-relaxed mb-6 sm:mb-8 transition-all duration-300`}
              style={{
                minHeight: '120px', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .typeString("قدرتت رو بیدار کن.<br>امروز شروع کن.")
                    .pauseFor(2000)
                    .deleteAll()
                    .typeString("فینیکس کلاب —<br>تولد دوباره‌ی بهترین نسخه‌ی تو.")
                    .pauseFor(2000)
                    .deleteAll()
                    .typeString("اینجا جاییه که<br>تغییر واقعی شروع می‌شه.")
                    .pauseFor(2000)
                    .start();
                }}
                options={{
                  loop: true,
                  delay: 30,
                  deleteSpeed: 20,
                  wrapperClassName: 'typewriter-wrapper',
                  cursorClassName: 'typewriter-cursor'
                }}
              />
            </div>
            
            <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-8">
              بهترین مربیان، جدیدترین تجهیزات، و برنامه‌های شخصی‌سازی شده برای
              شما
            </p>
            
            <Link
              to={user ? "/classes" : "/register"}
              className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-red-500 no-underline inline-block"
            >
              {token && user ? (
                <span>پیش به سوی بی نهایت</span>
              ) : (
                <span>همین الان عضو شوید!</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}