import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Demo users — always available regardless of localStorage
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

// Registered users persisted in localStorage
const loadRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem('cafe_registered_users')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const saveRegisteredUsers = (users) => {
  try { localStorage.setItem('cafe_registered_users', JSON.stringify(users)) } catch { /* quota */ }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('cafe_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (email, password) => {
    // Check demo users first
    const demo = MOCK_USERS.find((u) => u.email === email && u.password === password)
    if (demo) {
      const { password: _, ...safeUser } = demo
      setUser(safeUser)
      localStorage.setItem('cafe_user', JSON.stringify(safeUser))
      return { success: true, user: safeUser }
    }

    // Check registered users
    const registered = loadRegisteredUsers()
    const found = registered.find((u) => u.email === email && u.password === password)
    if (!found) return { success: false, message: 'Correo o contraseña incorrectos.' }

    const { password: _, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem('cafe_user', JSON.stringify(safeUser))
    return { success: true, user: safeUser }
  }

  const register = (data) => {
    const registered = loadRegisteredUsers()

    // Check duplicate email across demo + registered
    const allEmails = [...MOCK_USERS.map((u) => u.email), ...registered.map((u) => u.email)]
    if (allEmails.includes(data.email)) {
      return { success: false, message: 'Este correo ya está registrado.' }
    }

    const newUser = {
      id: Date.now(),
      email: data.email,
      password: data.password, // stored only in localStorage mock
      role: 'PRODUCER',
      name: `${data.firstName} ${data.lastName}`,
      producer: { id: Date.now(), firstName: data.firstName, lastName: data.lastName },
    }

    saveRegisteredUsers([...registered, newUser])

    // Also add to cafe_users list so admin can see them
    try {
      const rawUsers = localStorage.getItem('cafe_users')
      const currentUsers = rawUsers ? JSON.parse(rawUsers) : []
      const adminEntry = {
        id: newUser.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        farms: 0,
        batches: 0,
      }
      localStorage.setItem('cafe_users', JSON.stringify([...currentUsers, adminEntry]))
    } catch { /* quota */ }

    const { password: _, ...safeUser } = newUser
    setUser(safeUser)
    localStorage.setItem('cafe_user', JSON.stringify(safeUser))
    return { success: true, user: safeUser }
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
