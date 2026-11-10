import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { AlertCircle, CheckCircle2, Eye, EyeOff, Check } from 'lucide-react'

const PWD_RULES = [
  { label: 'Mínimo 8 caracteres', test: (v) => v?.length >= 8      },
  { label: 'Una mayúscula',        test: (v) => /[A-Z]/.test(v)    },
  { label: 'Una minúscula',        test: (v) => /[a-z]/.test(v)    },
  { label: 'Un número',            test: (v) => /[0-9]/.test(v)    },
]

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password', '')

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    const result = await registerUser(data)
    setLoading(false)
    if (!result.success) return setError(result.message)
    setSuccess(true)
    setTimeout(() => navigate('/welcome'), 1600)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
        <div className="text-center max-w-sm animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-sage-100 mx-auto mb-5 flex items-center justify-center">
            <CheckCircle2 size={28} className="text-sage-600" />
          </div>
          <h2 className="page-title">¡Cuenta creada!</h2>
          <p className="text-muted mt-2">Preparando tu laboratorio de calidad…</p>
          <div className="mt-5 h-0.5 bg-line rounded-full overflow-hidden max-w-xs mx-auto">
            <div className="h-0.5 bg-crema rounded-full animate-[grow_1.4s_ease_forwards]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[0.9fr_1.1fr] bg-paper">

      {/* ── Left ────────────────────────────────────────────────────────── */}
      <section className="hidden lg:flex flex-col justify-between p-14 bg-roast relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-espresso/30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-crema/8 pointer-events-none -translate-x-1/2 translate-y-1/2" />

        <p className="relative font-display text-3xl text-paper">CaféIA</p>

        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.25em] text-crema/60 font-semibold">Registro de productor</p>
          <h2 className="font-display text-4xl xl:text-5xl leading-tight mt-3 text-paper">
            Tu café merece<br />ser medido.
          </h2>
          <p className="mt-4 text-paper/60 max-w-xs text-sm leading-relaxed">
            Una cuenta gratuita para registrar fincas, lotes, variables de producción y obtener predicciones de calidad.
          </p>
        </div>

        <p className="relative text-[10px] text-paper/30 uppercase tracking-widest">
          Contraseña: mayúscula, minúscula y número
        </p>
      </section>

      {/* ── Right ───────────────────────────────────────────────────────── */}
      <section className="flex items-center justify-center p-8 bg-canvas overflow-y-auto">
        <div className="w-full max-w-md py-6 animate-fade-up">

          <p className="font-display text-2xl text-ink lg:hidden mb-10">CaféIA</p>
          <p className="page-kicker">Nueva cuenta</p>
          <h2 className="page-title mt-2 mb-8">Crear perfil</h2>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg border border-coral-200 bg-coral-50 text-coral-800 text-sm mb-5">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-coral-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-field">Nombre</label>
                <input
                  className="input-field"
                  maxLength={50}
                  {...register('firstName', {
                    required: 'Obligatorio',
                    minLength: { value: 2, message: 'Mínimo 2' },
                    pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, message: 'Solo letras' },
                  })}
                />
                {errors.firstName && <p className="text-coral-700 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="label-field">Apellido</label>
                <input
                  className="input-field"
                  maxLength={50}
                  {...register('lastName', {
                    required: 'Obligatorio',
                    minLength: { value: 2, message: 'Mínimo 2' },
                    pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, message: 'Solo letras' },
                  })}
                />
                {errors.lastName && <p className="text-coral-700 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="label-field">Correo electrónico</label>
              <input
                type="email"
                autoComplete="email"
                className="input-field"
                maxLength={100}
                {...register('email', {
                  required: 'El correo es obligatorio',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
                })}
              />
              {errors.email && <p className="text-coral-700 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label-field">Teléfono <span className="normal-case tracking-normal text-muted/60">(opcional)</span></label>
              <input type="tel" className="input-field" placeholder="+57 300 000 0000" maxLength={20} {...register('phone')} />
            </div>

            <div>
              <label className="label-field">Contraseña</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="input-field pr-10"
                  maxLength={64}
                  {...register('password', {
                    required: 'Obligatoria',
                    minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                    validate: {
                      uppercase: (v) => /[A-Z]/.test(v) || 'Mayúscula requerida',
                      lowercase: (v) => /[a-z]/.test(v) || 'Minúscula requerida',
                      number:    (v) => /[0-9]/.test(v) || 'Número requerido',
                      noSpaces:  (v) => !/\s/.test(v)   || 'Sin espacios',
                    },
                  })}
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

              {/* Password strength */}
              {password && (
                <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                  {PWD_RULES.map((rule) => {
                    const ok = rule.test(password)
                    return (
                      <div key={rule.label} className={`flex items-center gap-1.5 text-xs transition-colors ${ok ? 'text-sage-600' : 'text-muted/60'}`}>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${ok ? 'bg-sage-500 border-sage-500' : 'border-line'}`}>
                          {ok && <Check size={8} className="text-white" strokeWidth={3} />}
                        </div>
                        {rule.label}
                      </div>
                    )
                  })}
                </div>
              )}
              {errors.password && <p className="text-coral-700 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label-field">Confirmar contraseña</label>
              <input
                type="password"
                autoComplete="new-password"
                className="input-field"
                maxLength={64}
                {...register('confirmPassword', {
                  required: 'Confirma tu contraseña',
                  validate: (v) => v === password || 'Las contraseñas no coinciden',
                })}
              />
              {errors.confirmPassword && <p className="text-coral-700 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-1">
              {loading
                ? <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-paper/20 border-t-paper rounded-full animate-spin" />
                    Creando cuenta…
                  </span>
                : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-sm text-muted mt-6 text-center">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-espresso font-medium hover:text-roast underline underline-offset-4 transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
