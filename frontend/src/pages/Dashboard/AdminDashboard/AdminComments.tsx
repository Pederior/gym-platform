import { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import { toast } from 'react-hot-toast';
import { adminService } from '../../../services/adminService';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

interface Comment {
  _id: string;
  content: string;
  article: { title: string; _id: string };
  author: { name: string; email: string; role: string };
  parent?: { content: string; author: { name: string } };
  likes: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const statusConfig = {
  pending: { label: 'در انتظار تأیید', color: 'bg-yellow-500/10 text-yellow-500' },
  approved: { label: 'تأیید شده', color: 'bg-green-500/10 text-green-500' },
  rejected: { label: 'رد شده', color: 'bg-destructive/10 text-destructive' }
};

export default function AdminComments() {
  useDocumentTitle('مدیریت کامنت‌ها');
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState<{ 
    isOpen: boolean; 
    comment?: Comment 
  }>({ isOpen: false });
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const data = await adminService.getComments();
      setComments(data.comments || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در بارگذاری کامنت‌ها');
    } finally {
      setLoading(false);
    }
  };

  const openReplyModal = (comment: Comment) => {
    setReplyModal({ isOpen: true, comment });
    setReplyContent('');
  };

  const closeReplyModal = () => {
    setReplyModal({ isOpen: false });
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !replyModal.comment) return;
    
    try {
      await adminService.replyToComment(replyModal.comment._id, replyContent);
      toast.success('پاسخ با موفقیت ارسال شد');
      fetchComments();
      closeReplyModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در ارسال پاسخ');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این کامنت را حذف کنید؟')) return;
    
    try {
      await adminService.deleteComment(id);
      toast.success('کامنت با موفقیت حذف شد');
      fetchComments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در حذف کامنت');
    }
  };

  const getRoleBadge = (role: string) => {
    const config: Record<string, { label: string; color: string }> = {
      admin: { label: 'مدیر', color: 'bg-destructive/10 text-destructive' },
      coach: { label: 'مربی', color: 'bg-primary/10 text-primary' },
      user: { label: 'کاربر', color: 'bg-muted/50 text-muted-foreground' }
    };
    const { label, color } = config[role] || config.user;
    return <span className={`px-1 py-0.5 rounded text-xs font-medium ${color}`}>{label}</span>;
  };

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6">مدیریت کامنت‌ها</h1>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">در حال بارگذاری...</div>
      ) : comments.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <div className="text-4xl mb-4 text-muted-foreground">💬</div>
            <h3 className="font-bold text-foreground mb-2">کامنتی یافت نشد</h3>
            <p className="text-muted-foreground">کامنتی برای نمایش وجود ندارد</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <Card key={comment._id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
                <div>
                  <div className="font-bold text-foreground">{comment.author.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                    {comment.author.email}
                    {getRoleBadge(comment.author.role)}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[comment.status].color}`}>
                  {statusConfig[comment.status].label}
                </span>
              </div>
              
              <div className="mb-3">
                <p className="text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
              </div>
              
              {/* Parent comment (if reply) */}
              {comment.parent && (
                <div className="bg-muted p-3 rounded-lg mb-3">
                  <div className="text-sm text-muted-foreground">
                    <strong>پاسخ به:</strong> {comment.parent.author.name}
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">{comment.parent.content}</p>
                </div>
              )}
              
              <div className="text-sm text-muted-foreground mb-3">
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <span>مقاله: {comment.article.title}</span>
                  <span>{new Date(comment.createdAt).toLocaleDateString('fa-IR')}</span>
                </div>
                <div className="mt-1">
                  لایک‌ها: {comment.likes}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => openReplyModal(comment)}
                  className="text-primary hover:text-primary/80"
                >
                  پاسخ دادن
                </button>
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-destructive hover:text-destructive/80"
                >
                  حذف
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {replyModal.isOpen && replyModal.comment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg w-full max-w-2xl border border-border">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">پاسخ به کامنت</h2>
              <p className="text-sm text-muted-foreground mt-1">
                مقاله: {replyModal.comment.article.title}
              </p>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Original comment */}
              <div className="bg-muted p-3 rounded-lg">
                <div className="font-bold text-foreground mb-1">
                  {replyModal.comment.author.name}
                </div>
                <p className="text-muted-foreground">{replyModal.comment.content}</p>
              </div>
              
              {/* Reply form */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  پاسخ شما
                </label>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="پاسخ خود را بنویسید..."
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80 disabled:opacity-50"
                >
                  ارسال پاسخ
                </button>
                <button
                  onClick={closeReplyModal}
                  className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}