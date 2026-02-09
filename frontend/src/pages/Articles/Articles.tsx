import { useState, useEffect } from "react";
import Footer from "../../components/layout/Footer";
import { HiHome } from "react-icons/hi";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import TopBar from "../../components/layout/TopBar";
import Navbar from "../../components/layout/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import useDocumentTitle from '../../hooks/useDocumentTitle';
import api from "../../services/api";
import { toast } from "react-hot-toast";

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
  useDocumentTitle('مقالات');
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await api.get('/articles/public');
      setArticles(res.data.articles || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در بارگذاری مقالات');
    } finally {
      setLoading(false);
    }
  };
  console.log(articles)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // اینجا می‌تونی API call با پارامتر search انجام بدی
    console.log('Searching for:', search);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

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
          <span className="text-white text-lg font-bold">مقالات</span>
          <div className="flex text-lg text-white gap-2">
            <Link to="/">
              <HiHome className="font-bold" />
            </Link>
            <MdKeyboardDoubleArrowLeft className="text-gray-300/70" />
            <span className="text-sm">مقالات</span>
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-4">
            <div className="space-y-6">
              {articles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="font-bold text-gray-800 mb-2">مقاله‌ای وجود ندارد</h3>
                  <p className="text-gray-600">در حال حاضر مقاله‌ای برای نمایش وجود ندارد</p>
                </div>
              ) : (
                articles.map((article) => (
                  <article
                    key={article._id}
                    className="bg-linear-to-r from-white to-red-50 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="md:flex p-6">
                      {article.featuredImage && (
                        <div className="md:w-1/3 mb-4 md:mb-0">
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      <div className={`md:w-2/3 ${article.featuredImage ? 'md:pl-6' : ''}`}>
                        <h3 
                          className="text-xl font-bold text-gray-800 mb-3 hover:text-red-600 cursor-pointer"
                          onClick={() => navigate(`/articles/${article._id}`)}
                        >
                          {article.title}
                        </h3>
                        
                        <div className="flex gap-3 items-center mb-3">
                          <img
                            src={article.author.avatar || "/images/author.png"}
                            alt={article.author.name}
                            className="w-10 h-10 object-cover rounded-full"
                          />
                          <div className="flex-col flex items-start">
                            <span className="text-sm font-bold hover:text-red-600 cursor-pointer">
                              {article.author.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(article.createdAt)}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>

                        <div className="flex justify-end">
                          <button
                            onClick={() => navigate(`/articles/${article._id}`)}
                            className="text-sm bg-red-600 font-light text-white px-4 py-2 hover:text-red-600 hover:bg-white border border-red-600 flex gap-2 items-center rounded-lg transition-colors"
                          >
                            <FaLongArrowAltLeft />
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
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <form onSubmit={handleSearch}>
                <div className="flex">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جستجو در مقالات..."
                    className="flex-1 border border-gray-300 rounded-r-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button 
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-l-lg hover:bg-red-700"
                  >
                    جستجو
                  </button>
                </div>
              </form>
            </div>

            {/* دسته‌بندی‌ها */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-gray-800 pb-2 border-b-2 border-red-500">
                دسته‌بندی‌ها
              </h3>
              <div className="space-y-2">
                {['تغذیه', 'تمرین', 'سبک زندگی', 'انگیزشی', 'سلامتی'].map((category, idx) => (
                  <button
                    key={idx}
                    className="block w-full text-right px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    {category}
                  </button>
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
};

export default Articles;