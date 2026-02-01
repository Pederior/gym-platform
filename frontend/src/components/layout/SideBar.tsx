import { useAppSelector } from '../../store/hook'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { name: 'داشبورد', path: '/', roles: ['admin', 'coach', 'user'] },
  { name: 'مدیریت کاربران', path: '/admin', roles: ['admin'] },
  { name: 'برنامه‌های تمرینی', path: '/coach', roles: ['coach', 'admin'] },
]

export default function Sidebar() {
  const { user } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!user) return null

  return (
    <aside className="w-64 bg-white shadow h-screen fixed left-0 top-0">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-blue-700">باشگاه تناسب اندام</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems
            .filter(item => item.roles.includes(user.role))
            .map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-4 py-2 rounded ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </aside>
  )
}