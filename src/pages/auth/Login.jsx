import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, AlertCircle, Leaf, BarChart2, FlaskConical } from 'lucide-react'

const FEATURES = [
  { icon: Leaf,          text: 'Registra fincas y lotes con trazabilidad completa' },
  { icon: FlaskConical,  text: 'Evalúa tazas con la escala SCA de 10 atributos'   },
  { icon: BarChart2,     text: 'Predicción de calidad con Random Forest entrenado' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    const result = await login(data.email, data.password)
    setLoading(false)
    if (!result.success) return setError(result.message)
    if (result.user.role === 'ADMIN') {
      navigate('/admin')
    } else {
      const key = `cafe_visited_${result.user.id}`
      navigate(localStorage.getItem(key) ? '/dashboard' : '/welcome')
      localStorage.setItem(key, 'true')
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_0.9fr] bg-paper">

      {/* ── Left — brand panel ──────────────────────────────────────────── */}
      <section className="hidden lg:flex flex-col justify-between p-14 bg-roast overflow-hidden relative">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-espresso/30 pointer-events-none" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-crema/10 pointer-events-none" />

        <div className="relative">
          <p className="font-display text-3xl text-paper">CaféIA</p>
        </div>

        <div className="relative space-y-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-crema/70 font-semibold">
              Sistema de calidad
            </p>
            <h1 className="font-display text-5xl xl:text-6xl leading-[1.05] mt-3 text-paper">
              De la finca<br />a la taza.<br />
              <em className="text-crema not-italic">Con datos.</em>
            </h1>
          </div>

          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-crema/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={12} className="text-crema" />
                </div>
                <p className="text-sm text-paper/70 leading-snug">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-[10px] text-paper/30 uppercase tracking-widest">
          Proyecto académico · Café colombiano
        </p>
      </section>

      {/* ── Right — form ────────────────────────────────────────────────── */}
      <section className="flex items-center justify-center p-8 bg-canvas">
        <div className="w-full max-w-sm animate-fade-up">

          {/* Mobile logo */}
          <p className="font-display text-2xl text-ink lg:hidden mb-10">CaféIA</p>

          <p className="page-kicker">Acceso al sistema</p>
          <h2 className="page-title mt-2 mb-8">Ingresar</h2>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg border border-coral-200 bg-coral-50 text-coral-800 text-sm mb-5">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-coral-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label className="label-field">Correo electrónico</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="correo@finca.com"
                className="input-field"
                maxLength={100}
                {...register('email', {
                  required: 'El correo es obligatorio',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
                })}
              />
              {errors.email && <p className="text-coral-700 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label-field">Contraseña</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input-field pr-10"
                  maxLength={64}
                  {...register('password', { required: 'La contraseña es obligatoria' })}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-1">
              {loading
                ? <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-paper/20 border-t-paper rounded-full animate-spin" />
                    Ingresando…
                  </span>
                : 'Ingresar'}
            </button>
          </form>

          <p className="text-sm text-muted mt-6 text-center">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/register" className="text-espresso font-medium hover:text-roast underline underline-offset-4 transition-colors">
              Regístrate
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 p-4 rounded-lg bg-line/50 border border-line">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold mb-2.5">
              Cuentas de demostración
            </p>
            <div className="space-y-1.5 text-xs font-mono text-muted">
              <div className="flex items-center justify-between">
                <span>productor@cafeia.com</span>
                <span className="text-muted/60">Productor1234</span>
              </div>
              <div className="flex items-center justify-between">
                <span>admin@cafeia.com</span>
                <span className="text-muted/60">Admin1234</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
