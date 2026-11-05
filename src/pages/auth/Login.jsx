import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

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
    const result = await login(data.email, data.password)
    setLoading(false)
    if (!result.success) return setError(result.message)
    if (result.user.role === 'ADMIN') navigate('/admin')
    else {
      const key = `cafe_visited_${result.user.id}`
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, 'true')
        navigate('/welcome')
      } else {
        navigate('/dashboard')
      }
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-paper">
      <section className="hidden lg:flex flex-col justify-between p-14 bg-ink text-paper">
        <p className="font-display text-3xl">CaféIA</p>
        <div>
          <p className="page-kicker text-paper/50">Sistema de calidad</p>
          <h1 className="font-display text-5xl leading-[1.1] mt-4 text-paper">
            Lectura de lote.<br />Decisión de mercado.
          </h1>
          <p className="mt-6 text-paper/70 max-w-md leading-relaxed">
            Registra fincas y lotes, captura variables de producción y obtén un puntaje SCA estimado con un modelo de machine learning.
          </p>
        </div>
        <p className="text-xs text-paper/40">Proyecto académico · café colombiano</p>
      </section>

      <section className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <p className="font-display text-2xl lg:hidden mb-8">CaféIA</p>
          <p className="page-kicker">Acceso</p>
          <h2 className="page-title mt-2 mb-8">Entrar</h2>

          {error && (
            <div className="flex items-start gap-2 p-3 border border-red-200 bg-red-50 text-red-800 text-sm mb-5">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Correo</label>
              <input
                type="email"
                className="input-field"
                placeholder="correo@finca.com"
                {...register('email', { required: 'El correo es obligatorio' })}
              />
              {errors.email && <p className="text-red-700 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  {...register('password', { required: 'La contraseña es obligatoria' })}
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <p className="text-sm text-stone-500 mt-6">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/register" className="text-ink underline underline-offset-4">Regístrate</Link>
          </p>

          <div className="mt-8 pt-6 border-t border-line text-xs text-stone-500 space-y-1">
            <p className="uppercase tracking-wider text-[10px] mb-2">Cuentas de demostración</p>
            <p>productor@cafeia.com · Productor1234</p>
            <p>admin@cafeia.com · Admin1234</p>
          </div>
        </div>
      </section>
    </div>
  )
}
