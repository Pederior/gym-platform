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
  parent?: {
    _id: string;
    content: string;
    author: {
      name: string;
    };
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
    console.log("Searching for:", search);
  };

  // گروه‌بندی کامنت‌ها بر اساس والد
  const groupComments = () => {
    const topLevelComments: Comment[] = [];
    const replies: Record<string, Comment[]> = {};

    comments.forEach(comment => {
      if (comment.parent) {
        if (!replies[comment.parent._id]) {
          replies[comment.parent._id] = [];
        }
        replies[comment.parent._id].push(comment);
      } else {
        topLevelComments.push(comment);
      }
    });

    return { topLevelComments, replies };
  };

  const { topLevelComments, replies } = groupComments();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">در حال بارگذاری مقاله...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
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
        <div className="max-w-7xl mx-auto relative z-10 px-4">
          <TopBar iconColor="gray-300" textColor="white" />
          <Navbar />
        </div>
        <div className="max-w-7xl mx-auto flex justify-between my-5 pb-5 relative z-10 px-4">
          <div className="flex text-lg text-white gap-2">
            <Link to="/">
              <HiHome className="font-bold" />
            </Link>
            <MdKeyboardDoubleArrowLeft className="text-gray-300/70" />
            <Link to="/articles" className="text-sm text-white hover:text-gray-300">
              مقالات
            </Link>
            <MdKeyboardDoubleArrowLeft className="text-gray-300/70" />
            <span className="text-sm text-white">{article.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            <span className="text-primary">{article.title}</span>
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-4">
            {/* Article Header */}
            <div className="mb-12">
              {article.featuredImage && (
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8 shadow-lg"
                />
              )}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 p-6 bg-card rounded-2xl border border-border">
                <div className="flex items-center gap-4">
                  <img
                    src={article.author.avatar || "/images/author.png"}
                    alt={article.author.name}
                    className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-full border-2 border-border"
                  />
                  <div>
                    <div className="font-bold text-foreground text-base md:text-lg">
                      {article.author.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(article.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 md:gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span>⏱️</span>
                    {article.readTime} دقیقه
                  </span>
                  <span className="flex items-center gap-1">
                    <span>💬</span>
                    {article.commentsCount} کامنت
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground mb-12 leading-relaxed text-base md:text-xl text-center max-w-4xl mx-auto">
                {article.excerpt}
              </p>
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none mb-16 p-6 md:p-8 bg-card rounded-2xl border border-border"
              dangerouslySetInnerHTML={{
                __html: article.content.replace(/\n/g, "<br/>"),
              }}
            />

            {/* Comments Section */}
            <div className="border-t-2 border-border pt-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                کامنت‌ها ({comments.length})
              </h2>

              {/* Add Comment Form */}
              <Card className="mb-8 p-6 bg-linear-to-r from-card to-primary/10">
                <h3 className="text-xl font-bold mb-4 text-center text-foreground">نظر خود را ثبت کنید</h3>
                <form onSubmit={(e) => handleAddComment(e)}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    placeholder="نظر خود را درباره این مقاله بنویسید..."
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground text-base"
                    required
                  />
                  <div className="mt-4 flex justify-center">
                    <button
                      type="submit"
                      disabled={commentLoading}
                      className="bg-primary text-primary-foreground px-6 md:px-8 py-3 rounded-xl hover:bg-primary/80 disabled:opacity-50 font-semibold text-base md:text-lg shadow hover:shadow-md transition-all duration-300"
                    >
                      {commentLoading ? "در حال ارسال..." : "ثبت نظر"}
                    </button>
                  </div>
                </form>
              </Card>

              {/* Comments List */}
              {topLevelComments.length === 0 ? (
                <Card className="p-12 text-center bg-linear-to-br from-card to-muted">
                  <div className="text-8xl mb-6 text-muted-foreground">💬</div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    هنوز نظری ثبت نشده است
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    اولین نفری باشید که درباره این مقاله نظر خود را ثبت می‌کند!
                  </p>
                </Card>
              ) : (
                <div className="space-y-8">
                  {topLevelComments.map((comment) => (
                    <div key={comment._id}>
                      {/* Parent Comment */}
                      <Card className="p-6 bg-card border border-border hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <img
                            src={comment.author.avatar || "/images/author.png"}
                            alt={comment.author.name}
                            className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full border-2 border-border"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="font-bold text-foreground text-base md:text-lg">
                                {comment.author.name}
                              </span>
                              <span className="text-xs md:text-sm text-muted-foreground">
                                {formatDateTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-muted-foreground whitespace-pre-wrap text-base md:text-lg leading-relaxed mb-4">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </Card>

                      {/* Replies */}
                      {replies[comment._id] && (
                        <div className="mr-6 md:mr-8 mt-6 space-y-4 border-r-2 border-border pr-6">
                          {replies[comment._id].map((reply) => (
                            <Card 
                              key={reply._id} 
                              className="p-4 md:p-5 bg-muted/30 border border-border"
                            >
                              <div className="flex items-start gap-3">
                                <img
                                  src={reply.author.avatar || "/images/author.png"}
                                  alt={reply.author.name}
                                  className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full border border-border"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-semibold text-foreground text-sm md:text-base">
                                      {reply.author.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDateTime(reply.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground whitespace-pre-wrap text-sm md:text-base">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
              <h3 className="font-bold text-lg mb-4 text-foreground pb-3 border-b-2 border-primary">
                مقالات مرتبط
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((idx) => (
                  <div key={idx} className="flex gap-3 cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors">
                    <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground text-base md:text-lg">📝</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm md:text-base line-clamp-2">
                        عنوان مقاله مرتبط {idx}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        نویسنده نمونه
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* تبلیغات */}
            <div className="bg-linear-to-r from-primary to-accent p-6 rounded-2xl text-center text-primary-foreground">
              <p className="font-bold text-lg mb-2">تبلیغات ویژه</p>
              <p className="text-primary-foreground/80 mb-4">
                برنامه تمرینی شخصی با بهترین مربیان
              </p>
              <button className="bg-primary-foreground text-primary px-6 py-2 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors">
                همین حالا ثبت‌نام کنید
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}