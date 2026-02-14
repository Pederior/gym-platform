import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import { toast } from 'react-hot-toast';
import { adminService } from '../../../services/adminService';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

interface Article {
  _id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  author: { name: string; email: string };
  commentsCount: number;
  createdAt: string;
}

const statusConfig = {
  draft: { label: 'پیش‌نویس', color: 'bg-muted/50 text-muted-foreground' },
  published: { label: 'منتشر شده', color: 'bg-green-500/10 text-green-500' },
  archived: { label: 'آرشیو شده', color: 'bg-yellow-500/10 text-yellow-500' }
};

const categoryLabels: Record<string, string> = {
  nutrition: 'تغذیه',
  workout: 'تمرین',
  lifestyle: 'سبک زندگی',
  motivation: 'انگیزشی',
  health: 'سلامتی'
};

export default function AdminArticles() {
  useDocumentTitle('مدیریت مقالات');
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });

  useEffect(() => {
    fetchArticles();
  }, [filters]);

  const fetchArticles = async () => {
    try {
      const data = await adminService.getArticles(filters);
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
      await adminService.deleteArticle(id);
      toast.success('مقاله با موفقیت حذف شد');
      fetchArticles();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در حذف مقاله');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">مدیریت مقالات</h1>
        <Link
          to="/dashboard/admin/articles/create"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80"
        >
          + ایجاد مقاله جدید
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">وضعیت</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground text-center"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="draft">پیش‌نویس</option>
              <option value="published">منتشر شده</option>
              <option value="archived">آرشیو شده</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">دسته‌بندی</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground text-center"
            >
              <option value="">همه دسته‌بندی‌ها</option>
              <option value="nutrition">تغذیه</option>
              <option value="workout">تمرین</option>
              <option value="lifestyle">سبک زندگی</option>
              <option value="motivation">انگیزشی</option>
              <option value="health">سلامتی</option>
            </select>
          </div>
          
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">جستجو</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              placeholder="عنوان یا نویسنده..."
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>
        </div>
      </Card>

      {/* Articles List */}
      {loading ? (
        <div className="py-8 text-center text-muted-foreground">در حال بارگذاری...</div>
      ) : articles.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <div className="text-4xl mb-4 text-muted-foreground">📝</div>
            <h3 className="font-bold text-foreground mb-2">مقاله‌ای یافت نشد</h3>
            <p className="text-muted-foreground">با فیلترهای فعلی مقاله‌ای وجود ندارد</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map(article => (
            <Card key={article._id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground">{article.title}</h3>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[article.status].color}`}>
                      {statusConfig[article.status].label}
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {categoryLabels[article.category] || article.category}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {article.commentsCount} کامنت
                    </span>
                  </div>
                  <div className="mt-3 text-sm">
                    <div className="text-foreground">
                      <strong>نویسنده:</strong> {article.author.name} ({article.author.email})
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(article.createdAt).toLocaleDateString('fa-IR')}
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Link
                  to={`/dashboard/admin/articles/${article._id}/edit`}
                  className="text-primary hover:text-primary/80"
                >
                  ویرایش
                </Link>
                <button
                  onClick={() => handleDelete(article._id)}
                  className="text-destructive hover:text-destructive/80"
                >
                  حذف
                </button>
                <Link
                  to={`/articles/${article._id}`}
                  target="_blank"
                  className="text-accent hover:text-accent/80"
                >
                  مشاهده
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}