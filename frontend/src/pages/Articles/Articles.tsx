import { useState } from "react";
import Footer from "../../components/layout/Footer";
import { HiHome } from "react-icons/hi";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import TopBar from "../../components/layout/TopBar";
import Navbar from "../../components/layout/Navbar";
import { Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
const tags = [
  "آموزش",
  "فیتنس",
  "تغذیه",
  "روانشناسی ورزشی",
  "تکنیک‌ها",
  "عکاسی ورزشی",
  "ورزش کودکان",
  "ماساژ",
  "توصیه‌های پزشکی",
  "WP",
];

const articles = [
  {
    id: 1,
    title: "چرا انتخاب ما؟",
    excerpt:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است...",
    author: "آموزش",
    authorimg: "/images/author.png",
    date: "۱۴۰۳/۰۲/۲۱",
    image: "/images/a1-1.jpg",
  },
  {
    id: 2,
    title: "پیشرفت در بدنسازی",
    excerpt:
      "با تمرین منظم و برنامه‌ریزی صحیح، می‌توانید در ۳ ماه اول به نتایج قابل توجهی برسید...",
    author: "فیتنس",
    authorimg: "/images/author.png",
    date: "۱۴۰۳/۰۲/۲۰",
    image: "/images/a2-1.jpg",
  },
  {
    id: 3,
    title: "تغذیه ورزشی برای مبتدیان",
    excerpt:
      "در این مقاله به بررسی موارد اصلی تغذیه ورزشی برای شروع می‌پردازیم...",
    author: "تغذیه",
    authorimg: "/images/author.png",
    date: "۱۴۰۳/۰۲/۱۹",
    image: "/images/a3-1.jpg",
  },
  {
    id: 4,
    title: "تغذیه ورزشی برای مبتدیان",
    excerpt:
      "در این مقاله به بررسی موارد اصلی تغذیه ورزشی برای شروع می‌پردازیم...",
    author: "تغذیه",
    authorimg: "/images/author.png",
    date: "۱۴۰۳/۰۲/۱۹",
    image: "/images/a4-1.jpg",
  },
];
export default function Articles() {
  const [search, setSearch] = useState("");

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
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-4">
            <div className="space-y-6 ">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-linear-to-r from-white  to-red-100 "
                >
                  <div className="md:flex p-10">
                    <div className="md:w-1/3">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="md:w-2/3 px-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-red-500 cursor-pointer">
                        {article.title}
                      </h3>
                      <div className="flex gap-2 items-center">
                        <img
                          src={article.authorimg}
                          alt={article.author}
                          className="w-10 h-10 object-cover"
                        />
                        <div className="flex-col flex items-start mb-2">
                          <span className="text-sm font-bold hover:text-red-500 cursor-pointer">
                            {article.author}
                          </span>
                          <span className="text-xs text-gray-500">
                            {article.date}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>

                      <div className="flex justify-between items-center">
                        <Link
                          to={`/articles/${article.id}`}
                          className="text-sm bg-red-600 font-light text-white px-4 py-2 hover:text-red-600 hover:bg-white border border-red-600 flex gap-2 items-center"
                        >
                          <FaLongArrowAltLeft />
                          ادامه مطلب
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            {/* جستجو */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="...جستجو"
                  className="flex-1 border border-gray-300 rounded-r-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button className="bg-red-600 text-white px-4 py-2 rounded-l-lg hover:bg-red-700 ">
                  جستجو
                </button>
              </div>
            </div>

            {/* برچسب‌ها */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-gray-800 pb-5">
                <span className="pb-4 border-b-3 border-red-500">برچسب‌ها</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-red-100 hover:text-red-700 cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* تبلیغات */}
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-red-800 font-medium">تبلیغات</p>
              <div className="mt-2 h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                بنر تبلیغاتی
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
