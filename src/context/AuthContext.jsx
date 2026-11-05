import { createContext, useContext, useEffect, useState } from 'react'
import { api, displayName, setToken } from '../lib/api'

const AuthContext = createContext(null)

const persistUser = (user) => {
  if (user) localStorage.setItem('cafe_user', JSON.stringify(user))
  else localStorage.removeItem('cafe_user')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const boot = async () => {
      const token = localStorage.getItem('cafe_token')
      if (!token) {
        setReady(true)
        return
      }
      try {
        const res = await api.get('/api/auth/me')
        const next = res.data.user
        setUser(next)
        persistUser(next)
      } catch {
        setToken(null)
        persistUser(null)
        setUser(null)
      } finally {
        setReady(true)
      }
    }
    boot()
  }, [])

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password })
      setToken(res.data.token)
      setUser(res.data.user)
      persistUser(res.data.user)
      return { success: true, user: res.data.user }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const register = async (data) => {
    try {
      const res = await api.post('/api/auth/register', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        document: data.document || undefined,
      })
      setToken(res.data.token)
      setUser(res.data.user)
      persistUser(res.data.user)
      return { success: true, user: res.data.user }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.patch('/api/auth/change-password', { currentPassword, newPassword })
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const updateProducer = async (producerId, payload) => {
    try {
      const res = await api.patch(`/api/producers/${producerId}`, payload)
      const next = {
        ...user,
        producer: { ...user.producer, ...res.data.producer },
      }
      setUser(next)
      persistUser(next)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const logout = () => {
    setToken(null)
    persistUser(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, ready, login, register, logout, changePassword, updateProducer, displayName: displayName(user) }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
