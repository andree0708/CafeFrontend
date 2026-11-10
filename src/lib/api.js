const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const MESSAGES = {
  'Invalid email or password.': 'Correo o contraseña incorrectos.',
  'Email is already registered.': 'Este correo ya está registrado.',
  'Access denied. No token provided.': 'Sesión no válida. Vuelve a iniciar sesión.',
  'Token has expired.': 'Tu sesión expiró. Vuelve a iniciar sesión.',
  'Invalid token.': 'Sesión no válida. Vuelve a iniciar sesión.',
  'A record with this value already exists.': 'Ya existe un registro con ese valor.',
  'Farm not found.': 'Finca no encontrada.',
  'Batch not found.': 'Lote no encontrado.',
  'No cupping evaluation found for this batch.': 'No hay evaluación de cata para este lote.',
  'No cupping evaluation registered for this batch yet.': 'Aún no hay evaluación de cata para este lote.',
  'Producer profile not found for this user.': 'Este usuario no tiene perfil de productor.',
  'Current password is incorrect.': 'La contraseña actual es incorrecta.',
  'You do not have permission to perform this action.': 'No tienes permiso para esta acción.',
  'You do not have permission to access this batch.': 'No tienes permiso para ver este lote.',
  'Request a model prediction for this batch first.': 'Solicita primero la predicción del modelo para este lote.',
  'GROQ_API_KEY is not configured.': 'El análisis IA no está configurado en el servidor.',
  'Failed to fetch': 'No se pudo conectar con el servidor. ¿Está encendido el backend?',
}

function translate(message) {
  if (!message) return 'Ocurrió un error.'
  if (MESSAGES[message]) return MESSAGES[message]
  const found = Object.entries(MESSAGES).find(([k]) => message.includes(k))
  return found ? found[1] : message
}

function getToken() {
  return localStorage.getItem('cafe_token')
}

export function setToken(token) {
  if (token) localStorage.setItem('cafe_token', token)
  else localStorage.removeItem('cafe_token')
}

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers })
  } catch (err) {
    throw new ApiError(translate(err.message || 'Failed to fetch'), 0)
  }

  const body = await res.json().catch(() => ({}))

  if (res.status === 401) {
    if (!path.startsWith('/api/auth/login')) {
      setToken(null)
      localStorage.removeItem('cafe_user')
    }
  }

  if (!res.ok) {
    const first = body.errors?.[0]?.msg
    throw new ApiError(translate(first || body.message), res.status, body.errors)
  }

  return body
}

export const api = {
  get: (path) => request(path),
  post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path, data) => request(path, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (path, data) => request(path, { method: 'PATCH', body: JSON.stringify(data) }),
  del: (path) => request(path, { method: 'DELETE' }),
}

export const displayName = (user) => {
  if (!user) return ''
  if (user.producer?.firstName) {
    return `${user.producer.firstName} ${user.producer.lastName || ''}`.trim()
  }
  if (user.name) return user.name
  if (user.role === 'ADMIN') return 'Administrador'
  return user.email
}
