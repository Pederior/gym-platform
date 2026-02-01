import { useAppSelector } from '../../store/hook'
import { format } from 'date-fns'
import { useEffect, useRef } from 'react'
import { useAppDispatch } from '../../store/hook' // اضافه کن
import { fetchMessages } from '../../store/features/chatSlice' 

interface Message {
  _id: string
  sender: { _id: string; name: string } | string // sender می‌تونه آبجکت یا استرینگ باشه
  text: string
  createdAt: string
}

// تابع کمکی برای استخراج senderId
const getSenderUserId = (sender: Message['sender']): string => {
  if (typeof sender === 'string') return sender
  return sender._id
}

// تابع کمکی برای فرمت تاریخ ایمن
const safeFormatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'نامشخص'
    return format(date, 'HH:mm')
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'نامشخص'
  }
}

export default function MessageList() {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  
  // ✅ دریافت پیام‌ها از استور (نه هاردکد)
  const { messages, loading, error } = useAppSelector((state) => state.chat)
  
  // ✅ رفر برای اسکرول به پایین
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // ✅ لود کردن پیام‌ها هنگام مونت
  useEffect(() => {
    dispatch(fetchMessages())
  }, [dispatch])
  
  // ✅ اسکرول خودکار به آخرین پیام
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // ✅ بررسی اعتبار کاربر
  if (!user?._id) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">لطفاً وارد شوید</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {/* لودینگ */}
      {loading && messages.length === 0 && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      )}
      
      {/* خطا */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
          {error}
        </div>
      )}
      
      {/* پیام‌ها */}
      {messages.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-lg font-medium">پیامی وجود ندارد</p>
          <p className="text-sm mt-2">اولین پیام را شما بفرستید!</p>
        </div>
      ) : (
        <>
          {messages.map((msg) => {
            // ✅ بررسی ایمن sender
            const senderId = getSenderUserId(msg.sender)
            const isCurrentUser = senderId === user._id
            
            return (
              <div
                key={msg._id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] sm:max-w-[50%] px-4 py-3 rounded-lg ${
                    isCurrentUser
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow'
                  }`}
                >
                  {/* نمایش نام فرستنده فقط برای پیام‌های دیگران */}
                  {!isCurrentUser && (
                    <p className="text-xs font-bold text-gray-700 mb-1">
                      {typeof msg.sender === 'string' ? 'کاربر' : msg.sender.name}
                    </p>
                  )}
                  
                  <p className="wrap-break-word whitespace-pre-wrap">{msg.text}</p>
                  
                  <p
                    className={`text-xs mt-1 opacity-90 ${
                      isCurrentUser ? 'text-blue-100 text-left' : 'text-gray-500 text-right'
                    }`}
                  >
                    {safeFormatDate(msg.createdAt)}
                  </p>
                </div>
              </div>
            )
          })}
          
          {/* المنت برای اسکرول به پایین */}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  )
}