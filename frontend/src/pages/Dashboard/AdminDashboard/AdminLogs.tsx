import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import { toast } from 'react-hot-toast'
import api from '../../../services/api'

interface Log {
  _id: string
  user: { name: string; email: string }
  action: string
  description?: string
  ip?: string
  timestamp: string
}

const actionLabels: Record<string, string> = {
  login: 'ورود',
  logout: 'خروج',
  create_user: 'ایجاد کاربر',
  delete_user: 'حذف کاربر',
  update_settings: 'به‌روزرسانی تنظیمات',
  payment: 'پرداخت'
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/logs')
        setLogs(res.data.logs)
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'خطا در بارگذاری لاگ‌ها')
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">لاگ‌ها و امنیت</h1>

      <Card>
        {loading ? (
          <div className="py-8 text-center">در حال بارگذاری...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-sm text-gray-500 border-b">
                  <th>کاربر</th>
                  <th>عملیات</th>
                  <th>توضیحات</th>
                  <th>IP</th>
                  <th>تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log._id} className="border-b hover:bg-gray-50">
                    <td>
                      <div className="font-medium">{log.user.name}</div>
                      <div className="text-xs text-gray-500">{log.user.email}</div>
                    </td>
                    <td>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {actionLabels[log.action] || log.action}
                      </span>
                    </td>
                    <td>{log.description || '-'}</td>
                    <td className="text-xs">{log.ip || '-'}</td>
                    <td>{new Date(log.timestamp).toLocaleString('fa-IR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}