import { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import { toast } from 'react-hot-toast';
import { coachService } from '../../../services/coachService';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

interface Comment {
  _id: string;
  content: string;
  article: { title: string; _id: string };
  author: { name: string; email: string };
  parent?: { content: string; author: { name: string } };
  likes: number;
  createdAt: string;
}

export default function CoachComments() {
  useDocumentTitle('کامنت‌های مقالات من');
  
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
      const data = await coachService.getComments();
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
      await coachService.replyToComment(replyModal.comment._id, replyContent);
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
      await coachService.deleteComment(id);
      toast.success('کامنت با موفقیت حذف شد');
      fetchComments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در حذف کامنت');
    }
  };

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6">کامنت‌های مقالات من</h1>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">در حال بارگذاری...</div>
      ) : comments.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <div className="text-4xl mb-4 text-muted-foreground">💬</div>
            <h3 className="font-bold text-foreground mb-2">کامنتی وجود ندارد</h3>
            <p className="text-muted-foreground">برای مقالات شما کامنتی ثبت نشده است</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <Card key={comment._id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                <div>
                  <div className="font-bold text-foreground">{comment.author.name}</div>
                  <div className="text-sm text-muted-foreground">{comment.author.email}</div>
                </div>
                <div className="text-right text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
                </div>
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
                <span>مقاله: {comment.article.title}</span>
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