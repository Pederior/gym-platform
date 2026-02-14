import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../../services/api";
import Card from "../../../components/ui/Card";
import useDocumentTitle from "../../../hooks/useDocumentTitle";

interface TicketMessage {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin" | "coach";
  };
  message: string;
  timestamp: string;
}

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: "technical" | "financial" | "subscription" | "other";
  messages: TicketMessage[];
  createdAt: string;
}

export default function UserTicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTicket(id);
    }
  }, [id]);

  const fetchTicket = async (ticketId: string) => {
    try {
      const res = await api.get(`/tickets/${ticketId}`);
      setTicket(res.data.ticket);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در بارگذاری تیکت");
      navigate("/dashboard/user/tickets");
    } finally {
      setLoading(false);
    }
  };

  useDocumentTitle(`تیکت: ${ticket?.title}`);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      toast.error("پیام نمی‌تواند خالی باشد");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/tickets/${id}/messages`, {
        message: newMessage.trim(),
      });
      setTicket(res.data.ticket);
      setNewMessage("");
      toast.success("پیام شما ارسال شد");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در ارسال پیام");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این تیکت را ببندید؟")) return;

    try {
      await api.put(`/tickets/${id}/close`);
      toast.success("تیکت با موفقیت بسته شد");
      fetchTicket(id!);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در بستن تیکت");
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      technical: "فنی",
      financial: "مالی",
      subscription: "اشتراک",
      other: "سایر",
    };
    return labels[category] || category;
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { label: string; color: string }> = {
      low: { label: "پایین", color: "bg-success/10 text-success" },
      medium: { label: "متوسط", color: "bg-warning/10 text-warning" },
      high: { label: "بالا", color: "bg-orange-500/10 text-orange-500" },
      urgent: { label: "فوری", color: "bg-destructive/10 text-destructive" },
    };
    const { label, color } = config[priority] || config.medium;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>
    );
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      open: { label: "باز", color: "bg-primary/10 text-primary" },
      in_progress: {
        label: "در حال بررسی",
        color: "bg-warning/10 text-warning",
      },
      resolved: { label: "حل شده", color: "bg-success/10 text-success" },
      closed: { label: "بسته شده", color: "bg-muted/50 text-muted-foreground" },
    };
    const { label, color } = config[status] || config.open;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-4xl mb-4 text-destructive">❌</div>
          <h3 className="font-bold text-foreground mb-2">تیکت یافت نشد</h3>
          <button
            onClick={() => navigate("/dashboard/user/tickets")}
            className="text-primary hover:text-primary/80"
          >
            بازگشت به لیست تیکت‌ها
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">جزئیات تیکت</h1>
        <button
          onClick={() => navigate("/dashboard/user/tickets")}
          className="text-muted-foreground hover:text-foreground"
        >
          بازگشت
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Header */}
          <Card>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  {ticket.title}
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getStatusBadge(ticket.status)}
                  {getPriorityBadge(ticket.priority)}
                </div>
              </div>
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium text-foreground mb-2">توضیحات اولیه:</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          </Card>

          {/* Messages */}
          <Card>
            <h3 className="text-lg font-bold text-foreground mb-4">گفتگو</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {ticket.messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.sender.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md p-4 rounded-2xl ${
                      message.sender.role === "user"
                        ? "bg-primary/10 rounded-tl-none text-left"
                        : "bg-muted rounded-tr-none text-right"
                    }`}
                  >
                    {/* Header with sender info and timestamp */}
                    <div
                      className={`flex items-center gap-2 mb-2 ${
                        message.sender.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div className="font-medium text-foreground text-sm">
                        {message.sender.name}
                      </div>
                      {message.sender.role === "admin" && (
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                          ادمین
                        </span>
                      )}
                      {message.sender.role === "user" && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          کاربر
                        </span>
                      )}
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(message.timestamp).toLocaleTimeString(
                          "fa-IR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </div>
                    </div>

                    {/* Message content */}
                    <p
                      className={`text-muted-foreground whitespace-pre-wrap wrap-break-word ${
                        message.sender.role === "user"
                          ? "text-left"
                          : "text-right"
                      }`}
                    >
                      {message.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Reply Form */}
          {ticket.status !== "closed" && (
            <Card>
              <h3 className="text-lg font-bold text-foreground mb-4">پاسخ به تیکت</h3>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="پیام خود را بنویسید..."
                  disabled={submitting}
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    disabled={submitting || !newMessage.trim()}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80 disabled:opacity-50"
                  >
                    {submitting ? "در حال ارسال..." : "ارسال پیام"}
                  </button>
                </div>
              </form>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Info */}
          <Card>
            <h3 className="text-lg font-bold text-foreground mb-4">اطلاعات تیکت</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">وضعیت:</span>
                <div className="mt-1">{getStatusBadge(ticket.status)}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">اولویت:</span>
                <div className="mt-1">{getPriorityBadge(ticket.priority)}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">دسته‌بندی:</span>
                <div className="mt-1 font-medium text-foreground">
                  {getCategoryLabel(ticket.category)}
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">تاریخ ایجاد:</span>
                <div className="mt-1">
                  {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          {ticket.status !== "closed" && (
            <Card>
              <h3 className="text-lg font-bold text-foreground mb-4">عملیات</h3>
              <button
                onClick={handleCloseTicket}
                className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80"
              >
                بستن تیکت
              </button>
            </Card>
          )}

          {/* Status Guide */}
          <Card>
            <h3 className="text-lg font-bold text-foreground mb-4">راهنما</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <div>
                • <strong>باز:</strong> تیکت دریافت شده، منتظر پاسخ
              </div>
              <div>
                • <strong>در حال بررسی:</strong> ادمین در حال پاسخگویی است
              </div>
              <div>
                • <strong>حل شده:</strong> مشکل شما حل شده است
              </div>
              <div>
                • <strong>بسته شده:</strong> تیکت بسته شده و قابل پاسخ نیست
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}