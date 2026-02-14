import { useState, useEffect, type JSX } from "react";
import Footer from "../../components/layout/Footer";
import { HiHome } from "react-icons/hi";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import TopBar from "../../components/layout/TopBar";
import Navbar from "../../components/layout/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft, FaBook, FaNewspaper } from "react-icons/fa";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { FaAppleAlt, FaDumbbell, FaHeart, FaBolt, FaHeartbeat } from "react-icons/fa";
import { useAppSelector } from "../../store/hook";

interface Article {
  _id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  featuredImage?: string;
  category: string;
}

const Articles = () => {
  useDocumentTitle("مقالات");
  const { user, token } = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await api.get("/articles/public");
      setArticles(res.data.articles || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در بارگذاری مقالات");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, JSX.Element> = {
      تغذیه: <FaAppleAlt className="text-green-500" />,
      تمرین: <FaDumbbell className="text-blue-500" />,
      "سبک زندگی": <FaHeart className="text-purple-500" />,
      انگیزشی: <FaBolt className="text-yellow-500" />,
      سلامتی: <FaHeartbeat className="text-red-500" />
    };
    return icons[category] || <FaBook className="text-gray-500" />;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", search);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">در حال بارگذاری مقالات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div
        className="w-full bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/bg-header.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-7xl mx-auto relative px-4">
          <TopBar iconColor="gray-300" textColor="white" />
          <Navbar />
        </div>
        <div className="max-w-7xl mx-auto flex justify-between my-5 pb-5 relative px-4">
          <div className="flex text-lg text-white gap-2">
            <Link to="/">
              <HiHome className="font-bold" />
            </Link>
            <MdKeyboardDoubleArrowLeft className="text-gray-300/70" />
            <span className="text-sm">مقالات</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="text-sm font-medium">دانش و آموزش</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            <span className="text-primary">مقالات آموزشی</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            بهترین مقالات آموزشی در زمینه‌های مختلف ورزش، تغذیه و سلامتی
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-4">
            <div className="space-y-8">
              {articles.length === 0 ? (
                <div className="text-center py-24 bg-card rounded-2xl shadow-sm border border-border">
                  <div className="text-8xl mb-8 text-muted-foreground">
                    <FaNewspaper />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    مقاله‌ای وجود ندارد
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    در حال حاضر مقاله‌ای برای نمایش وجود ندارد. به زودی مقالات جدیدی اضافه خواهد شد.
                  </p>
                </div>
              ) : (
                articles.map((article) => (
                  <article
                    key={article._id}
                    className="bg-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-border hover:border-primary"
                  >
                    <div className="md:flex">
                      {/* Featured Image or Placeholder */}
                      <div className="md:w-1/3">
                        {article.featuredImage ? (
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 md:h-full bg-muted flex items-center justify-center">
                            <div className="text-center p-4">
                              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FaBook className="text-primary text-2xl" />
                              </div>
                              <p className="text-muted-foreground text-sm font-medium">
                                بدون تصویر
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={`md:w-2/3 p-6 ${article.featuredImage ? "md:pl-6" : ""}`}>
                        {/* Category Badge */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-muted-foreground">دسته‌بندی:</span>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                            {getCategoryIcon(article.category)}
                            {article.category}
                          </span>
                        </div>

                        <h3
                          className="text-xl md:text-2xl font-bold text-foreground mb-4 hover:text-primary cursor-pointer transition-colors"
                          onClick={() => navigate(`/articles/${article._id}`)}
                        >
                          {article.title}
                        </h3>

                        <div className="flex gap-3 items-center mb-4">
                          <img
                            src={article.author.avatar || "/images/author.png"}
                            alt={article.author.name}
                            className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full border-2 border-border"
                          />
                          <div className="flex-col flex items-start">
                            <span className="text-base font-semibold text-foreground hover:text-primary cursor-pointer transition-colors">
                              {article.author.name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(article.createdAt)}
                            </span>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-6 line-clamp-3 text-base md:text-lg leading-relaxed">
                          {article.excerpt}
                        </p>

                        <div className="flex justify-end">
                          <button
                            onClick={() => navigate(`/articles/${article._id}`)}
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-primary/80 shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300"
                          >
                            <FaLongArrowAltLeft className="text-base md:text-lg" />
                            ادامه مطلب
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* جستجو */}
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
              <h3 className="font-bold text-lg mb-4 text-foreground">جستجو در مقالات</h3>
              <form onSubmit={handleSearch}>
                <div className="flex">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="عنوان یا کلمه کلیدی..."
                    className="flex-1 border border-border rounded-r-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground px-4 md:px-6 py-3 rounded-l-xl hover:bg-primary/80 transition-colors font-medium"
                  >
                    جستجو
                  </button>
                </div>
              </form>
            </div>

            {/* دسته‌بندی‌ها */}
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
              <h3 className="font-bold text-lg mb-4 text-foreground pb-3 border-b-2 border-primary">
                دسته‌بندی‌ها
              </h3>
              <div className="space-y-3">
                {[
                  { name: "تغذیه", icon: "🍎" },
                  { name: "تمرین", icon: "💪" },
                  { name: "سبک زندگی", icon: "🧘" },
                  { name: "انگیزشی", icon: "⚡" },
                  { name: "سلامتی", icon: "❤️" }
                ].map((category, idx) => (
                  <button
                    key={idx}
                    className="w-full flex items-center gap-3 p-3 text-right text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* محبوب‌ترین مقالات */}
            {articles.length > 0 && (
              <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                <h3 className="font-bold text-lg mb-4 text-foreground pb-3 border-b-2 border-primary">
                  محبوب‌ترین مقالات
                </h3>
                <div className="space-y-4">
                  {articles.slice(0, 3).map((article, idx) => (
                    <div 
                      key={idx} 
                      className="flex gap-3 cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors"
                      onClick={() => navigate(`/articles/${article._id}`)}
                    >
                      <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 bg-muted rounded-lg flex items-center justify-center">
                        <FaBook className="text-muted-foreground text-base md:text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm md:text-base line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {article.author.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* تبلیغات */}
            <div className="bg-linear-to-r from-primary to-accent p-6 rounded-2xl text-center text-primary-foreground">
              <p className="font-bold text-lg mb-2">تبلیغات ویژه</p>
              <p className="text-primary-foreground/80 mb-4">
                برنامه تمرینی شخصی با بهترین مربیان
              </p>
              <Link to={token && user?.role === 'user' ? "/dashboard/user/workouts" : "/register"} className="bg-primary-foreground text-primary px-6 py-2 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors">
                همین حالا ثبت‌نام کنید
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Articles;