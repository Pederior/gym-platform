import { useAppSelector } from '../store/hook'
import { USER_ROLES } from '../utils/constants'

export const useAuth = () => {
  const { user, token } = useAppSelector((state) => state.auth)

  const isAuthenticated = !!token
  const isAdmin = user?.role === USER_ROLES.ADMIN
  const isCoach = user?.role === USER_ROLES.COACH
  const isUser = user?.role === USER_ROLES.USER

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isCoach,
    isUser,
    role: user?.role,
  }
}