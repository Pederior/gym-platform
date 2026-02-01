import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfile } from '../store/features/authSlice'

export default function AppInitializer() {
  const dispatch = useDispatch()
  const { token, user } = useSelector((state: any) => state.auth)

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile() as any)
    }
  }, [token, user, dispatch])

  return null 
}