import { useState, useEffect, useRef, useCallback } from "react";
import Card from "../../../components/ui/Card";
import { toast } from "react-hot-toast";
import api from "../../../services/api";
import { useSocket } from "../../../components/Chat/SocketContext";
import { useAppSelector } from "../../../store/hook";

interface Coach {
  _id: string;
  name: string;
}

interface Message {
  _id: string;
  sender: "user" | "coach";
  content: string;
  timestamp: string;
  read: boolean;
}

export default function UserChat() {
  const { socket, isConnected } = useSocket();
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  // ✅ فقط یک بار لود می‌شه
  const loadInitialData = useCallback(async () => {
    try {
      const [coachesRes, messagesRes] = await Promise.all([
        api.get("/chat/coaches"), // ✅ لیست مربیان
        selectedCoach
          ? api.get(`/chat/${selectedCoach._id}`)
          : Promise.resolve({ data: { messages: [] } }),
      ]);

      setCoaches(coachesRes.data.coaches);
      if (coachesRes.data.coaches.length > 0 && !selectedCoach) {
        const firstCoach = coachesRes.data.coaches[0];
        setSelectedCoach(firstCoach);
        // بارگذاری پیام‌ها برای اولین مربی
        const msgs = await api.get(`/chat/${firstCoach._id}`);
        setMessages(msgs.data.messages);
      }
      if (selectedCoach && messagesRes.data.messages) {
        setMessages(messagesRes.data.messages);
      }
    } catch (err: any) {
      toast.error("خطا در بارگذاری داده‌ها");
    } finally {
      setLoading(false);
    }
  }, [selectedCoach]);

  // ✅ فقط یک بار در ابتدا اجرا می‌شه
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // ✅ تغییر مربی از طریق event handler
  const handleSelectCoach = async (coach: Coach) => {
    setSelectedCoach(coach);
    try {
      const res = await api.get(`/chat/${coach._id}`);
      setMessages(res.data.messages);
    } catch (err: any) {
      toast.error("خطا در بارگذاری پیام‌ها");
    }
  };

  // مدیریت eventهای socket
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleReceiveMessage = (message: Message) => {
      // فقط پیام‌های مربی رو نشون بده
      if (message.sender === "coach") {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleMessageSent = (message: Message) => {
      // پیام‌های ارسالی کاربر
      if (message.sender === "user") {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_sent", handleMessageSent);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_sent", handleMessageSent);
    };
  }, [socket, isConnected, selectedCoach]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedCoach || !socket || !isConnected) return;

    const messageData = {
      senderId: currentUser?._id,
      receiverId: selectedCoach._id,
      content: newMessage,
    };

    if (socket) {
      socket.emit("send_message", messageData);
      setNewMessage("");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="p-8">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">چت با مربی</h1>

      <div className="flex gap-6">
        {/* لیست مربی‌ها */}
        <div className="w-1/3">
          <Card>
            <h2 className="font-bold mb-4">مربی‌ها</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {coaches.map((coach) => (
                <button
                  key={coach._id}
                  onClick={() => handleSelectCoach(coach)}
                  className={`w-full text-right p-3 rounded-lg transition ${
                    selectedCoach?._id === coach._id
                      ? "bg-red-100 text-red-800"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {coach.name}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* چت */}
        <div className="flex-1">
          {selectedCoach ? (
            <Card>
              <div className="border-b pb-3 mb-4">
                <h2 className="font-bold">چت با {selectedCoach.name}</h2>
              </div>

              <div className="h-96 overflow-y-auto mb-4 pl-2.5">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`mb-3 ${
                      message.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg max-w-xs  ${
                        message.sender === "user"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.content}
                    </div>
                    <div
                      className={`text-xs text-gray-500 mt-1 ${
                        message.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {formatDate(message.timestamp)}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="پیام خود را بنویسید..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !isConnected}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  ارسال
                </button>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-12 text-gray-500">
                لطفاً یک مربی را از لیست انتخاب کنید
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
