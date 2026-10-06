import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { Coffee, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    // Small delay to simulate API call
    await new Promise((r) => setTimeout(r, 600))
    const result = login(data.email, data.password)
    setLoading(false)
    if (!result.success) return setError(result.message)
    // First-time demo users go to welcome, returning users go straight to dashboard
    const isFirstLogin = !localStorage.getItem(`cafe_visited_${result.user.id}`)
    if (isFirstLogin) {
      localStorage.setItem(`cafe_visited_${result.user.id}`, 'true')
      navigate('/welcome')
    } else {
      navigate(result.user.role === 'ADMIN' ? '/admin' : '/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-950 via-coffee-800 to-coffee-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur rounded-2xl mb-4">
            <Coffee size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">CaféIA</h1>
          <p className="text-coffee-200 mt-1">Sistema Inteligente de Calidad</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Iniciar sesión</h2>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4 text-red-700 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                className="input-field"
                {...register('email', {
                  required: 'El correo es obligatorio',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  {...register('password', { required: 'La contraseña es obligatoria' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 mt-2"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-coffee-600 font-medium hover:underline">
              Regístrate aquí
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-3 bg-coffee-50 rounded-lg border border-coffee-100">
            <p className="text-xs font-medium text-coffee-700 mb-2">Credenciales de demo:</p>
            <div className="space-y-1 text-xs text-coffee-600">
              <p><span className="font-medium">Productor:</span> productor@cafeIA.com / productor1234</p>
              <p><span className="font-medium">Admin:</span> admin@cafeIA.com / admin1234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
