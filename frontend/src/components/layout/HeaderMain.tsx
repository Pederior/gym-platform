import Navbar from "./Navbar";
import TopBar from "./TopBar";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import { useAppSelector } from "../../store/hook";
export default function HeaderMain() {
  const { user, token } = useAppSelector((state) => state.auth);
  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center flex flex-col items-center "
        style={{ backgroundImage: "url('/images/HeaderBg.jpg')" }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <TopBar textColor="gray-300" iconColor="white" />
          <Navbar />
        </div>
        <div className="min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <span className="text-5xl">
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .typeString("بدنت رو بساز. زندگی‌ات رو عوض کن.")
                    .start()
                    .pauseFor(2000)
                    .deleteAll()
                    .typeString("فینیکس کلاب - زیبایی‌ات رو از درون بساز.")
                    .start()
                    .pauseFor(2000);
                }}
                options={{
                  loop: true,
                }}
              />
            </span>
            <p className="text-lg md:text-xl max-w-2xl mx-auto my-8">
              بهترین مربیان، جدیدترین تجهیزات، و برنامه‌های شخصی‌سازی شده برای
              شما
            </p>
            <Link
              to={user ? "/classes" : "/register"}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-500 no-underline"
            >
              {token && user ? (
                <span>پیش به سوی بی نهایت</span>
              ) : (
                <span> همین الان عضو شوید!</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
