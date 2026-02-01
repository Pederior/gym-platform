import { useState, useEffect, useRef, useCallback } from "react";
import Card from "../../../components/ui/Card";
import { toast } from "react-hot-toast";
import api from "../../../services/api";
import { useSocket } from "../../../components/Chat/SocketContext";
import { useAppSelector } from "../../../store/hook";
interface User {
  _id: string;
  name: string;
}

interface Message {
  _id: string;
  sender: "coach" | "user";
  content: string;
  timestamp: string;
  read: boolean;
}

export default function CoachChat() {
  const { socket, isConnected } = useSocket();
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // ✅ تعریف loadMessages با useCallback
  const loadMessages = useCallback(async (userId: string) => {
    try {
      const res = await api.get(`/chat/${userId}`);
      setMessages(res.data.messages);
    } catch (err: any) {
      toast.error("خطا در بارگذاری پیام‌ها");
    }
  }, []);

  // بارگذاری لیست کاربران (یک‌بار در ابتدا)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/chat/users");
        setUsers(res.data.users);
        if (res.data.users.length > 0) {
          setSelectedUser(res.data.users[0]);
          // ✅ لود پیام‌ها همین‌جا
          loadMessages(res.data.users[0]._id);
        }
      } catch (err: any) {
        toast.error("خطا در بارگذاری لیست کاربران");
      }
    };
    fetchUsers();
  }, [loadMessages]); // ⚠️ loadMessages dependency هست

  // ✅ تغییر selectedUser → لود پیام‌ها
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    loadMessages(user._id); // ✅ مستقیم در event handler
  };

  // مدیریت eventهای socket
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleReceiveMessage = (message: Message) => {
      // فقط پیام‌های کاربر رو نشون بده
      if (message.sender === "user") {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleMessageSent = (message: Message) => {
      // پیام‌های ارسالی مربی
      if (message.sender === "coach") {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_sent", handleMessageSent);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_sent", handleMessageSent);
    };
  }, [socket, isConnected, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser || !socket || !isConnected) return;

    const messageData = {
      senderId: currentUser?._id,
      receiverId: selectedUser._id,
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">چت با کاربران</h1>

      <div className="flex gap-6">
        {/* لیست کاربران */}
        <div className="w-1/3">
          <Card>
            <h2 className="font-bold mb-4">کاربران</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {users.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleSelectUser(user)} // ✅ تغییر اینجا
                  className={`w-full text-right p-3 rounded-lg transition ${
                    selectedUser?._id === user._id
                      ? "bg-red-100 text-red-800"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {user.name}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* چت */}
        <div className="flex-1">
          {selectedUser ? (
            <Card>
              <div className="border-b pb-3 mb-4">
                <h2 className="font-bold">چت با {selectedUser.name}</h2>
              </div>

              <div className="h-96 overflow-y-auto mb-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`mb-3 ${
                      message.sender === "coach" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg max-w-xs ${
                        message.sender === "coach"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.content}
                    </div>
                    <div
                      className={`text-xs text-gray-500 mt-1 ${
                        message.sender === "coach" ? "text-right" : "text-left"
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
                لطفاً یک کاربر را از لیست انتخاب کنید
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
