import { useState, useEffect, useRef } from 'react'
import io, { Socket } from 'socket.io-client'
import { useAppSelector } from '../../store/hook'
import { SocketContext } from './SocketContext'

const getSocketUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  return 'http://localhost:5000'
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socketState, setSocketState] = useState<{ socket: Socket | null; isConnected: boolean }>({
    socket: null,
    isConnected: false
  })
  
  const { user, token } = useAppSelector((state) => state.auth)
  const currentTokenRef = useRef(token)

  useEffect(() => {
    currentTokenRef.current = token
  }, [token])

  useEffect(() => {
    let newSocket: Socket | null = null

    const connectSocket = () => {
      if (!currentTokenRef.current || !user?._id) return

      newSocket = io(getSocketUrl(), {
        auth: { token: currentTokenRef.current },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })

      newSocket.on('connect', () => {
        console.log('✅ WebSocket connected')
        setSocketState({ socket: newSocket, isConnected: true })
        newSocket?.emit('join', user._id)
      })

      newSocket.on('disconnect', () => {
        console.log('🔌 WebSocket disconnected')
        setSocketState({ socket: null, isConnected: false })
      })

      newSocket.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error)
        setSocketState({ socket: null, isConnected: false })
      })
    }

    connectSocket()

    return () => {
      if (newSocket) {
        newSocket.close()
      }
    }
  }, [user?._id])

  return (
    <SocketContext.Provider value={socketState}>
      {children}
    </SocketContext.Provider>
  )
}