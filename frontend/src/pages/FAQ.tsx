import { useState } from "react";
import Footer from "../components/layout/Footer";
import { HiHome } from "react-icons/hi";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import TopBar from "../components/layout/TopBar";
import Navbar from "../components/layout/Navbar";
import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "چگونه می‌توانم عضو باشوم؟",
    answer:
      "برای عضویت، کافی است به صفحه ثبت‌نام مراجعه کرده و اطلاعات خود را وارد کنید. پس از تأیید ایمیل، حساب شما فعال خواهد شد.",
  },
  {
    id: 2,
    question: "هزینه عضویت چقدر است؟",
    answer:
      "ما برنامه‌های مختلفی داریم: برنامه برنز (۱۹۹,۰۰۰ تومان)، برنامه نقره‌ای (۳۹۹,۰۰۰ تومان) و برنامه طلایی (۶۹۹,۰۰۰ تومان). هر برنامه مزایای خاص خود را دارد.",
  },
  {
    id: 3,
    question: "آیا می‌توانم قبل از خرید اشتراک، از خدمات نمونه استفاده کنم؟",
    answer:
      "بله! ما یک دوره رایگان ۷ روزه برای تمام کاربران جدید ارائه می‌دهیم تا بتوانند از کیفیت خدمات ما اطمینان حاصل کنند.",
  },
  {
    id: 4,
    question: "چگونه می‌توانم برنامه تمرینی شخصی دریافت کنم؟",
    answer:
      "پس از ثبت‌نام و انتخاب اشتراک مناسب، می‌توانید از طریق بخش «داشبورد» درخواست برنامه تمرینی شخصی دهید. مربی اختصاصی شما با شما تماس خواهد گرفت.",
  },
  {
    id: 5,
    question: "آیا امکان لغو اشتراک وجود دارد؟",
    answer:
      "بله، شما می‌توانید اشتراک خود را در هر زمان لغو کنید. با این حال، مبلغ پرداختی قابل استرداد نیست.",
  },
  {
    id: 6,
    question: "آیا کلاس‌های آنلاین زنده برگزار می‌شوند؟",
    answer:
      "بله، ما هر هفته کلاس‌های آنلاین زنده با مربیان مجرب برگزار می‌کنیم. زمان‌بندی کلاس‌ها در بخش «کلاس‌ها» قابل مشاهده است.",
  },
  {
    id: 7,
    question: "چگونه می‌توانم با مربی خود تماس بگیرم؟",
    answer:
      "در بخش «داشبورد» می‌توانید از طریق سیستم چت مستقیماً با مربی خود ارتباط برقرار کنید.",
  },
  {
    id: 8,
    question: "آیا مقالات آموزشی رایگان هستند؟",
    answer:
      "بله، تمام مقالات آموزشی در بخش «مقالات» به صورت رایگان در دسترس همه کاربران قرار دارد.",
  },
  {
    id: 9,
    question: "روش‌های پرداخت چیست؟",
    answer:
      "ما از تمامی درگاه‌های پرداخت معتبر داخلی پشتیبانی می‌کنیم شامل: کارت‌های بانکی، پرداخت آنلاین و کیف پول الکترونیکی.",
  },
  {
    id: 10,
    question: "آیا امکان تغییر مربی وجود دارد؟",
    answer:
      "بله، اگر از مربی فعلی خود رضایت ندارید، می‌توانید از طریق بخش «پشتیبانی» درخواست تغییر مربی دهید.",
  },
];

export default function FAQ() {
  useDocumentTitle("سوالات متداول");

  const [openId, setOpenId] = useState<number | null>(null);

  const toggleQuestion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div
        className="w-full bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/bg-header.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <TopBar iconColor="gray-300" textColor="white" />
          <Navbar />
        </div>
        <div className="max-w-7xl mx-auto flex justify-between my-5 pb-5 relative z-10">
          <div className="flex text-lg text-white gap-2">
            <Link to="/">
              <HiHome className="font-bold" />
            </Link>
            <MdKeyboardDoubleArrowLeft className="text-gray-300/70" />
            <span className="text-sm">سوالات متداول</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            سوالات <span className="text-red-500">متداول</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            پاسخ به مهم‌ترین سوالات شما درباره خدمات و امکانات فینیکس کلاب
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqData.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(faq.id)}
                  className="w-full p-6 text-right flex justify-between items-center focus:outline-none"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {faq.question}
                  </h3>
                  <span
                    className={`transform transition-transform duration-300 ${openId === faq.id ? "rotate-180" : ""}`}
                  >
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                {openId === faq.id && (
                  <div className="px-6 pb-6 pt-2 text-gray-600 animate-fade-in">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <div className="bg-linear-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">سوال دیگری دارید؟</h2>
              <p className="mb-6 text-red-100">
                اگر سوال شما در لیست بالا پاسخ داده نشده است، با ما تماس بگیرید.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="bg-white text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  تماس با پشتیبانی
                </Link>
                <a
                  href="tel:02133457890"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-red-600 transition-colors"
                >
                  ☎️ ۰۲۱۳۳۴۵۷۸۹۰
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
