import { useAppSelector } from '../../store/hook'
import { format } from 'date-fns'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'

interface Message {
  _id: string
  sender: { _id: string; name: string }
  text: string
  createdAt: string
}

export default function MessageList() {
  const { user } = useAppSelector((state) => state.auth)
  const messages: Message[] = [] // فعلاً خالی — بعداً از chatSlice می‌گیریم

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">پیامی وجود ندارد.</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender._id === user?._id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{msg.text}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.sender._id === user?._id ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {format(new Date(msg.createdAt), 'HH:mm')}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}