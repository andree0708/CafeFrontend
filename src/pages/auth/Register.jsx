import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { Coffee, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'

const passwordRules = [
  { label: 'Mínimo 8 caracteres', test: (v) => v?.length >= 8 },
  { label: 'Una letra mayúscula', test: (v) => /[A-Z]/.test(v) },
  { label: 'Una letra minúscula', test: (v) => /[a-z]/.test(v) },
  { label: 'Un número', test: (v) => /[0-9]/.test(v) },
]

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password', '')

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    await new Promise((r) => setTimeout(r, 700))
    const result = registerUser(data)
    setLoading(false)
    if (!result.success) return setError(result.message)
    setSuccess(true)
    setTimeout(() => navigate('/welcome'), 2500)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">¡Cuenta creada!</h2>
          <p className="text-gray-400 text-sm mb-5">Te damos la bienvenida al sistema CaféIA.</p>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-1 bg-emerald-400 rounded-full animate-[progress_2.5s_linear_forwards]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-coffee-950 via-coffee-900 to-coffee-700 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <Coffee size={24} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">CaféIA</span>
        </div>
        <div>
          <h2 className="text-3xl font-black text-white mb-3">Únete a la red<br />de productores</h2>
          <p className="text-coffee-300 text-sm leading-relaxed">
            Crea tu cuenta gratuita y empieza a analizar la calidad de tus lotes con inteligencia artificial.
          </p>
        </div>
        <p className="text-coffee-600 text-xs">Registro exclusivo para productores</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-4">
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <Coffee size={20} className="text-coffee-600" />
            <span className="font-bold text-gray-900">CaféIA</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Crear cuenta</h2>
          <p className="text-gray-400 text-sm mb-6">Registro de productor cafetero</p>

          {error && (
            <div className="flex items-center gap-2.5 p-3 bg-red-50 border border-red-100 rounded-lg mb-4 text-red-600 text-sm">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  placeholder="Carlos"
                  className="input-field"
                  maxLength={50}
                  {...register('firstName', {
                    required: 'Requerido',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                    maxLength: { value: 50, message: 'Máximo 50 caracteres' },
                    pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, message: 'Solo letras' },
                  })}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                  type="text"
                  placeholder="Gómez"
                  className="input-field"
                  maxLength={50}
                  {...register('lastName', {
                    required: 'Requerido',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                    maxLength: { value: 50, message: 'Máximo 50 caracteres' },
                    pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, message: 'Solo letras' },
                  })}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono <span className="text-gray-400 font-normal">(opcional)</span></label>
              <input
                type="tel"
                placeholder="+57 300 000 0000"
                className="input-field"
                maxLength={20}
                {...register('phone')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Crea una contraseña segura"
                  className="input-field pr-10"
                  maxLength={64}
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                    maxLength: { value: 64, message: 'Máximo 64 caracteres' },
                    validate: {
                      uppercase: (v) => /[A-Z]/.test(v) || 'Necesita al menos una mayúscula',
                      lowercase: (v) => /[a-z]/.test(v) || 'Necesita al menos una minúscula',
                      number: (v) => /[0-9]/.test(v) || 'Necesita al menos un número',
                      noSpaces: (v) => !/\s/.test(v) || 'No puede contener espacios',
                    },
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
              {/* Password strength indicators */}
              {password && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {passwordRules.map((rule) => (
                    <div key={rule.label} className={`flex items-center gap-1.5 text-xs ${rule.test(password) ? 'text-emerald-600' : 'text-gray-300'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${rule.test(password) ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                      {rule.label}
                    </div>
                  ))}
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
                className="input-field"
                maxLength={64}
                {...register('confirmPassword', {
                  required: 'Confirma tu contraseña',
                  validate: (v) => v === password || 'Las contraseñas no coinciden',
                })}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 mt-1"
            >
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creando cuenta...</span>
                : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-coffee-600 font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
