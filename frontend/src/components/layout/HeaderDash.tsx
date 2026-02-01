import { useAppDispatch, useAppSelector } from '../../store/hook'
import { logout } from '../../store/features/authSlice'
import { useNavigate } from 'react-router-dom'

export default function HeaderDash() {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold">خوش آمدید، {user?.name}!</h2>
      <button
        onClick={handleLogout}
        className="text-sm text-red-600 hover:text-red-800"
      >
        خروج
      </button>
    </header>
  )
}