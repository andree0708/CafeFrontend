import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Mock users for demo — replace with real API calls when backend is ready
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@cafeIA.com',
    password: 'admin1234',
    role: 'ADMIN',
    name: 'Administrador',
  },
  {
    id: 2,
    email: 'productor@cafeIA.com',
    password: 'productor1234',
    role: 'PRODUCER',
    name: 'Carlos Productor',
    producer: { id: 1, firstName: 'Carlos', lastName: 'Gómez' },
  },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('cafe_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (email, password) => {
    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    )
    if (!found) return { success: false, message: 'Correo o contraseña incorrectos.' }

    const { password: _, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem('cafe_user', JSON.stringify(safeUser))
    return { success: true, user: safeUser }
  }

  const register = (data) => {
    // Mock registration — always succeeds in demo
    const newUser = {
      id: Date.now(),
      email: data.email,
      role: 'PRODUCER',
      name: `${data.firstName} ${data.lastName}`,
      producer: { id: Date.now(), firstName: data.firstName, lastName: data.lastName },
    }
    setUser(newUser)
    localStorage.setItem('cafe_user', JSON.stringify(newUser))
    return { success: true, user: newUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cafe_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
