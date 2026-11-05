import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'

const passwordRules = [
  { label: 'Mínimo 8 caracteres', test: (v) => v?.length >= 8 },
  { label: 'Una mayúscula', test: (v) => /[A-Z]/.test(v) },
  { label: 'Una minúscula', test: (v) => /[a-z]/.test(v) },
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
    const result = await registerUser(data)
    setLoading(false)
    if (!result.success) return setError(result.message)
    setSuccess(true)
    setTimeout(() => navigate('/welcome'), 1400)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <CheckCircle size={28} className="mx-auto text-espresso mb-4" />
          <h2 className="page-title">Cuenta lista</h2>
          <p className="text-stone-500 mt-2">Te llevamos al laboratorio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[2fr,3fr] bg-paper">
      <section className="hidden lg:flex flex-col justify-between p-14 bg-ink text-paper">
        <p className="font-display text-3xl">CaféIA</p>
        <div>
          <h2 className="font-display text-4xl leading-tight">Registro de productor</h2>
          <p className="mt-4 text-paper/70 max-w-sm">Una cuenta por persona. Desde ahí administras fincas, lotes y análisis de calidad.</p>
        </div>
        <p className="text-xs text-paper/40">Contraseña con mayúscula, minúscula y número</p>
      </section>

      <section className="flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-6">
          <p className="page-kicker">Nueva cuenta</p>
          <h2 className="page-title mt-2 mb-8">Crear perfil</h2>

          {error && (
            <div className="flex gap-2 p-3 border border-red-200 bg-red-50 text-red-800 text-sm mb-5">
              <AlertCircle size={15} className="shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Nombre</label>
                <input className="input-field" {...register('firstName', { required: 'Requerido', minLength: 2, pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/ })} />
                {errors.firstName && <p className="text-red-700 text-xs mt-1">Nombre inválido</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Apellido</label>
                <input className="input-field" {...register('lastName', { required: 'Requerido', minLength: 2, pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/ })} />
                {errors.lastName && <p className="text-red-700 text-xs mt-1">Apellido inválido</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Correo</label>
              <input type="email" className="input-field" {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Teléfono (opcional)</label>
              <input type="tel" className="input-field" placeholder="+57 300 000 0000" {...register('phone')} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  {...register('password', {
                    required: true,
                    minLength: 8,
                    validate: {
                      uppercase: (v) => /[A-Z]/.test(v) || 'Mayúscula requerida',
                      lowercase: (v) => /[a-z]/.test(v) || 'Minúscula requerida',
                      number: (v) => /[0-9]/.test(v) || 'Número requerido',
                    },
                  })}
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {passwordRules.map((rule) => (
                    <p key={rule.label} className={`text-xs ${rule.test(password) ? 'text-espresso' : 'text-stone-400'}`}>
                      {rule.label}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Confirmar</label>
              <input type="password" className="input-field" {...register('confirmPassword', { validate: (v) => v === password || 'No coinciden' })} />
              {errors.confirmPassword && <p className="text-red-700 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creando…' : 'Crear cuenta'}</button>
          </form>
          <p className="text-sm text-stone-500 mt-6">
            ¿Ya tienes cuenta? <Link to="/login" className="text-ink underline underline-offset-4">Inicia sesión</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
