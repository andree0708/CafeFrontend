import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, AlertCircle, Coffee, Leaf, BarChart2, Star } from 'lucide-react'

const features = [
  { icon: Leaf, text: 'Registra fincas y lotes' },
  { icon: BarChart2, text: 'Predicción de calidad con IA' },
  { icon: Star, text: 'Recomendaciones de comercialización' },
]

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
    await new Promise((r) => setTimeout(r, 500))
    const result = login(data.email, data.password)
    setLoading(false)
    if (!result.success) return setError(result.message)
    if (result.user.role === 'ADMIN') {
      navigate('/admin')
    } else {
      const isFirst = !localStorage.getItem(`cafe_visited_${result.user.id}`)
      if (isFirst) {
        localStorage.setItem(`cafe_visited_${result.user.id}`, 'true')
        navigate('/welcome')
      } else {
        navigate('/dashboard')
      }
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-coffee-950 via-coffee-900 to-coffee-700 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <Coffee size={24} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">CaféIA</span>
        </div>

        <div>
          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            Inteligencia artificial<br />
            al servicio del<br />
            <span className="text-coffee-300">café colombiano</span>
          </h1>
          <p className="text-coffee-300 text-base mb-10 leading-relaxed">
            Predice la calidad de tus lotes, mejora tus prácticas agrícolas
            y accede a mejores mercados con datos reales.
          </p>
          <div className="space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-coffee-300" />
                </div>
                <span className="text-coffee-200 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-coffee-500 text-xs">Sistema Inteligente de Calidad Cafetera</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Coffee size={22} className="text-coffee-600" />
            <span className="font-bold text-gray-900">CaféIA</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Bienvenido</h2>
          <p className="text-gray-400 text-sm mb-7">Ingresa con tu cuenta para continuar</p>

          {error && (
            <div className="flex items-center gap-2.5 p-3 bg-red-50 border border-red-100 rounded-lg mb-5 text-red-600 text-sm">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="correo@gmail.com"
                className="input-field"
                maxLength={100}
                {...register('email', {
                  required: 'El correo es obligatorio',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
                  maxLength: { value: 100, message: 'Máximo 100 caracteres' },
                })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                  className="input-field pr-10"
                  maxLength={64}
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    maxLength: { value: 64, message: 'Máximo 64 caracteres' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 mt-1"
            >
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Ingresando...</span>
                : 'Ingresar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-coffee-600 font-medium hover:underline">
              Regístrate aquí
            </Link>
          </p>

          <div className="mt-6 p-3.5 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-xs font-semibold text-amber-700 mb-2">Acceso demo:</p>
            <div className="space-y-1 text-xs text-amber-600 font-mono">
              <p>productor@cafeIA.com / productor1234</p>
              <p>admin@cafeIA.com / admin1234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
