import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { userService } from '../../../services/userService'
import { toast } from 'react-hot-toast'

type UserRole = 'user' | 'coach' | 'admin'

interface FormData {
  name: string
  email: string
  role: UserRole
}

export default function AdminUsersEdit() {
  const { id } = useParams<{ id: string }>()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'user' 
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!id) throw new Error('شناسه کاربر وجود ندارد')
        
        const users = await userService.getAllUsers()
        const user = users.find(u => u._id === id)
        
        if (!user) {
          toast.error('کاربر یافت نشد')
          navigate('/dashboard/admin/users')
          return
        }

        const validRole = ['user', 'coach', 'admin'].includes(user.role) 
          ? (user.role as UserRole) 
          : 'user'
        
        setFormData({
          name: user.name || '',
          email: user.email || '',
          role: validRole
        })
      } catch (err: any) {
        console.error('Fetch user error:', err)
        toast.error(err.message || 'خطا در بارگیری کاربر')
        navigate('/dashboard/admin/users')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'role') {
      setFormData(prev => ({ 
        ...prev, 
        role: value as UserRole
      }))
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value 
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      // ✅ اعتبارسنجی فرم
      if (!formData.name.trim() || !formData.email.trim()) {
        toast.error('لطفاً تمام فیلدها را پر کنید')
        return
      }

      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        toast.error('ایمیل معتبر نیست')
        return
      }

      await userService.updateUser(id, formData)
      toast.success('کاربر با موفقیت به‌روز شد')
      navigate('/dashboard/admin/users')
    } catch (err: any) {
      console.error('Update user error:', err)
      toast.error(err.response?.data?.message || 'خطا در به‌روزرسانی کاربر')
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        <span className="mr-3">در حال بارگذاری...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">ویرایش کاربر</h1>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/dashboard/admin/users')}
        >
          بازگشت به لیست
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام کامل
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="نام و نام خانوادگی"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ایمیل
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نقش
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              required
            >
              <option value="user">کاربر</option>
              <option value="coach">مربی</option>
              <option value="admin">مدیر</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              تغییر نقش کاربر باید با احتیاط انجام شود
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard/admin/users')}
              className="w-full sm:w-auto"
            >
              انصراف
            </Button>
            <Button 
              type="submit"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              به‌روزرسانی کاربر
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}