import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import { toast } from 'react-hot-toast';
import { coachService } from '../../../services/coachService';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

interface Article {
  _id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  commentsCount: number;
  createdAt: string;
}

const statusConfig = {
  draft: { label: 'پیش‌نویس', color: 'bg-gray-100 text-gray-800' },
  published: { label: 'منتشر شده', color: 'bg-green-100 text-green-800' },
  archived: { label: 'آرشیو شده', color: 'bg-yellow-100 text-yellow-800' }
};

const categoryLabels: Record<string, string> = {
  nutrition: 'تغذیه',
  workout: 'تمرین',
  lifestyle: 'سبک زندگی',
  motivation: 'انگیزشی',
  health: 'سلامتی'
};

export default function CoachArticles() {
  useDocumentTitle('مقالات من');
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await coachService.getArticles();
      setArticles(data.articles || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در بارگذاری مقالات');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این مقاله را حذف کنید؟')) return;
    
    try {
      await coachService.deleteArticle(id);
      toast.success('مقاله با موفقیت حذف شد');
      fetchArticles();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در حذف مقاله');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مقالات من</h1>
        <Link
          to="/dashboard/coach/articles/create"
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          + ایجاد مقاله جدید
        </Link>
      </div>

      {loading ? (
        <div className="py-8 text-center">در حال بارگذاری...</div>
      ) : articles.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="font-bold text-gray-800 mb-2">مقاله‌ای وجود ندارد</h3>
            <p className="text-gray-600">برای شروع، مقاله جدیدی ایجاد کنید</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map(article => (
            <Card key={article._id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{article.title}</h3>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusConfig[article.status].color}`}>
                      {statusConfig[article.status].label}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {categoryLabels[article.category] || article.category}
                    </span>
                    <span className="text-sm text-gray-600">
                      {article.commentsCount} کامنت
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString('fa-IR')}
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Link
                  to={`/dashboard/coach/articles/${article._id}/edit`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ویرایش
                </Link>
                <button
                  onClick={() => handleDelete(article._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  حذف
                </button>
                {article.status === 'published' && (
                  <Link
                    to={`/articles/${article._id}`}
                    target="_blank"
                    className="text-green-600 hover:text-green-800"
                  >
                    مشاهده
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}