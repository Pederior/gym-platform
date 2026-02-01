import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { userService } from '../../../services/userService'
import { toast } from 'react-hot-toast'

export default function AdminUsersEdit() {
  const { id } = useParams<{ id: string }>()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as const
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await userService.getAllUsers()
        const user = users.find(u => u._id === id)
        if (user) {
          setFormData({
            name: user.name,
            email: user.email,
            role: user.role
          })
        }
      } catch (err: any) {
        toast.error('خطا در بارگیری کاربر')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchUser()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      await userService.updateUser(id, formData)
      toast.success('کاربر با موفقیت به‌روز شد')
      navigate('/dashboard/admin/users')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در به‌روزرسانی')
    }
  }

  if (loading) return <div className="p-8">در حال بارگذاری...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ویرایش کاربر</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام کامل</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نقش</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="user">کاربر</option>
              <option value="coach">مربی</option>
              <option value="admin">مدیر</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button type="submit">به‌روزرسانی کاربر</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard/admin/users')}
            >
              انصراف
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}