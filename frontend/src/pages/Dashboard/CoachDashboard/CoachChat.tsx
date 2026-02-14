import { useState, useEffect, useRef, useCallback } from "react";
import Card from "../../../components/ui/Card";
import { toast } from "react-hot-toast";
import api from "../../../services/api";
import { useSocket } from "../../../components/Chat/SocketContext";
import { useAppSelector } from "../../../store/hook";
import useDocumentTitle from '../../../hooks/useDocumentTitle';

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface Message {
  _id: string;
  sender: "coach" | "user";
  content: string;
  timestamp: string;
  read: boolean;
}

export default function CoachChat() {
  useDocumentTitle("چت");
  const { socket, isConnected } = useSocket();
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async (studentId: string) => {
    try {
      const res = await api.get(`/chat/${studentId}`);
      setMessages(res.data.messages || []);
    } catch (err: any) {
      toast.error("خطا در بارگذاری پیام‌ها");
    }
  }, []);

  // بارگذاری لیست شاگردها
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/coach/students");
        setStudents(res.data.data || []);
        if (res.data.data?.length > 0) {
          setSelectedStudent(res.data.data[0]);
          loadMessages(res.data.data[0]._id);
        }
      } catch (err: any) {
        toast.error("خطا در بارگذاری لیست شاگردها");
      }
    };
    fetchStudents();
  }, [loadMessages]);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    loadMessages(student._id);
  };

  // مدیریت eventهای socket
  useEffect(() => {
    if (!socket || !isConnected || !selectedStudent) return;

    const handleReceiveMessage = (message: Message) => {
      if (message.sender === "user") {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleMessageSent = (message: Message) => {
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
  }, [socket, isConnected, selectedStudent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedStudent || !socket || !isConnected) return;

    const messageData = {
      senderId: currentUser?._id,
      receiverId: selectedStudent._id,
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
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6">چت با شاگردها</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* لیست شاگردها */}
        <div className="lg:w-1/3">
          <Card>
            <h2 className="font-bold text-foreground mb-4">شاگردها</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {students.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  شاگردی یافت نشد
                </div>
              ) : (
                students.map((student) => (
                  <button
                    key={student._id}
                    onClick={() => handleSelectStudent(student)}
                    className={`w-full text-right p-3 rounded-lg transition ${
                      selectedStudent?._id === student._id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {student.name}
                    <div className="text-xs text-muted-foreground mt-1">{student.email}</div>
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* چت */}
        <div className="flex-1">
          {selectedStudent ? (
            <Card>
              <div className="border-b border-border pb-3 mb-4">
                <h2 className="font-bold text-foreground">چت با {selectedStudent.name}</h2>
              </div>

              <div className="h-96 overflow-y-auto mb-4 pl-2.5">
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
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                    <div
                      className={`text-xs text-muted-foreground mt-1 ${
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
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !isConnected}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80 disabled:opacity-50"
                >
                  ارسال
                </button>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-12 text-muted-foreground">
                لطفاً یک شاگرد را از لیست انتخاب کنید
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}