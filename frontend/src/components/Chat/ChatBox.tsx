import { useState } from 'react'
import MessageList from './MessageList'
import { useAppSelector } from '../../store/hook'

export default function ChatBox() {
  const [message, setMessage] = useState('')
  const { user } = useAppSelector((state) => state.auth)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // در آینده: ارسال به WebSocket یا API
    console.log('ارسال پیام:', message)
    setMessage('')
  }

  return (
    <div className="flex flex-col h-full border rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-100 px-4 py-3 border-b">
        <h3 className="font-medium">چت با مربی</h3>
      </div>

      {/* Messages */}
      <MessageList />

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="پیام خود را بنویسید..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            ارسال
          </button>
        </div>
      </form>
    </div>
  )
}