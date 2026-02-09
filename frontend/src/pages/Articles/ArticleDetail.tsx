import { useEffect, useState } from "react";
import Footer from "../../components/layout/Footer";
import { HiHome } from "react-icons/hi";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import TopBar from "../../components/layout/TopBar";
import Navbar from "../../components/layout/Navbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import Card from "../../components/ui/Card";

interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  featuredImage?: string;
  category: string;
  readTime: number;
  commentsCount: number;
}

interface Comment {
  _id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  createdAt: string;
  likes: number;
  liked: boolean;
}

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
      fetchComments(id);
    }
  }, [id]);

  const fetchArticle = async (articleId: string) => {
    try {
      const res = await api.get(`/articles/${articleId}`);

      setArticle(res.data.article);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "مقاله یافت نشد");
      navigate("/articles");
    } finally {
      setLoading(false);
    }
  };

  useDocumentTitle(article?.title || "مقاله");

  const fetchComments = async (articleId: string) => {
    try {
      const res = await api.get(`/comments/article/${articleId}`);
      setComments(res.data.comments || []);
    } catch (err: any) {
      toast.error("خطا در بارگذاری کامنت‌ها");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error("لطفاً کامنت خود را وارد کنید");
      return;
    }

    setCommentLoading(true);
    try {
      const res = await api.post("/comments", {
        articleId: id,
        content: newComment.trim(),
      });

      setComments((prev) => [res.data.comment, ...prev]);
      setNewComment("");
      toast.success("کامنت شما با موفقیت ارسال شد");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در ارسال کامنت");
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("fa-IR");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // اینجا می‌تونی API call با پارامتر search انجام بدی
    console.log("Searching for:", search);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!article) {
    return null;
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
          <span className="text-white text-lg font-bold">{article.title}</span>
          <div className="flex text-lg text-white gap-2">
            <Link to="/">
              <HiHome className="font-bold" />
            </Link>
            <MdKeyboardDoubleArrowLeft className="text-gray-300/70" />
            <Link to="/articles" className="text-sm">
              مقالات
            </Link>
            <MdKeyboardDoubleArrowLeft className="text-gray-300/70" />
            <span className="text-sm">جزئیات</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-4">
            {/* Article Header */}
            <div className="mb-8">
              {article.featuredImage && (
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover rounded-xl mb-6"
                />
              )}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={article.author.avatar || "/images/author.png"}
                    alt={article.author.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <div>
                    <div className="font-bold text-gray-800">
                      {article.author.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(article.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 text-sm text-gray-600">
                  <span>⏱️ {article.readTime} دقیقه</span>
                  <span>💬 {article.commentsCount} کامنت</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                {article.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{
                __html: article.content.replace(/\n/g, "<br/>"),
              }}
            />

            {/* Comments Section */}
            <div className="border-t pt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                کامنت‌ها ({comments.length})
              </h2>

              {/* Add Comment Form */}
              <Card className="mb-8 p-6">
                <h3 className="text-lg font-bold mb-4">ارسال کامنت</h3>
                <form onSubmit={handleAddComment}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    placeholder="نظر خود را بنویسید..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={commentLoading}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      {commentLoading ? "در حال ارسال..." : "ارسال کامنت"}
                    </button>
                  </div>
                </form>
              </Card>

              {/* Comments List */}
              {comments.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="font-bold text-gray-800 mb-2">
                    کامنتی وجود ندارد
                  </h3>
                  <p className="text-gray-600">
                    اولین نفری باشید که نظر خود را ثبت می‌کند!
                  </p>
                </Card>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <Card key={comment._id} className="p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={comment.author.avatar || "/images/author.png"}
                          alt={comment.author.name}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-gray-800">
                              {comment.author.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDateTime(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap mb-3">
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-4">
                            <button className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-1">
                              👍 {comment.likes}
                            </button>
                            <button className="text-sm text-gray-600 hover:text-blue-600">
                              پاسخ
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="col-span-2 space-y-6">
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
                {["تغذیه", "تمرین", "سبک زندگی", "انگیزشی", "سلامتی"].map(
                  (category, idx) => (
                    <button
                      key={idx}
                      className="block w-full text-right px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      {category}
                    </button>
                  ),
                )}
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
