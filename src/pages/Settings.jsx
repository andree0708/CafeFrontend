import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useForm } from 'react-hook-form'
import { useToast } from '../components/ui/Toast'
import { User, Lock, Bell, Shield, ChevronRight, Info } from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'password', label: 'Contraseña', icon: Lock },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'account', label: 'Cuenta', icon: Shield },
]

export default function Settings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { showToast, ToastComponent } = useToast()
  const [activeTab, setActiveTab] = useState('profile')

  const profileForm = useForm({
    defaultValues: {
      firstName: user?.producer?.firstName || user?.name?.split(' ')[0] || '',
      lastName: user?.producer?.lastName || user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      phone: '',
    },
  })

  const passwordForm = useForm()
  const newPw = passwordForm.watch('newPassword', '')

  const passwordRules = [
    { label: 'Mínimo 8 caracteres', ok: newPw?.length >= 8 },
    { label: 'Una mayúscula', ok: /[A-Z]/.test(newPw) },
    { label: 'Una minúscula', ok: /[a-z]/.test(newPw) },
    { label: 'Un número', ok: /[0-9]/.test(newPw) },
  ]

  return (
    <div className="space-y-6">
      {ToastComponent}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-400 mt-0.5 text-sm">Administra tu perfil y preferencias</p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Sidebar tabs */}
        <div className="w-52 shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm p-2">
          <nav className="space-y-0.5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-coffee-50 text-coffee-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon size={15} />
                  {label}
                </span>
                <ChevronRight size={13} className="text-gray-300" />
              </button>
            ))}

            <div className="pt-1 mt-1 border-t border-gray-100">
              <button
                onClick={() => navigate('/welcome')}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              >
                <Info size={15} />
                Ver tutorial
              </button>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-5">Información personal</h2>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-14 h-14 rounded-full bg-coffee-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-xl font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-coffee-50 text-coffee-700 text-xs font-medium rounded-full">
                    {user?.role === 'ADMIN' ? 'Administrador' : 'Productor'}
                  </span>
                </div>
              </div>

              <form onSubmit={profileForm.handleSubmit(() => showToast('Perfil actualizado correctamente.'))} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      className="input-field"
                      maxLength={50}
                      {...profileForm.register('firstName', { maxLength: { value: 50, message: 'Máximo 50 caracteres' } })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <input
                      className="input-field"
                      maxLength={50}
                      {...profileForm.register('lastName', { maxLength: { value: 50, message: 'Máximo 50 caracteres' } })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    className="input-field bg-gray-50"
                    readOnly
                    {...profileForm.register('email')}
                  />
                  <p className="text-xs text-gray-400 mt-1">El correo no se puede modificar desde aquí.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="+57 300 000 0000"
                    className="input-field"
                    maxLength={20}
                    {...profileForm.register('phone')}
                  />
                </div>
                <button type="submit" className="btn-primary text-sm">Guardar cambios</button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-5">Cambiar contraseña</h2>
              <form
                onSubmit={passwordForm.handleSubmit((data) => {
                  if (data.newPassword !== data.confirmPassword) {
                    showToast('Las contraseñas no coinciden.', 'error')
                    return
                  }
                  passwordForm.reset()
                  showToast('Contraseña actualizada correctamente.')
                })}
                className="space-y-4 max-w-sm"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
                  <input
                    type="password"
                    className="input-field"
                    maxLength={64}
                    {...passwordForm.register('currentPassword', { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                  <input
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    className="input-field"
                    maxLength={64}
                    {...passwordForm.register('newPassword', {
                      required: true, minLength: 8, maxLength: 64,
                    })}
                  />
                  {newPw && (
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      {passwordRules.map((r) => (
                        <p key={r.label} className={`text-xs flex items-center gap-1 ${r.ok ? 'text-emerald-600' : 'text-gray-300'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full inline-block ${r.ok ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                          {r.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                  <input
                    type="password"
                    className="input-field"
                    maxLength={64}
                    {...passwordForm.register('confirmPassword', { required: true })}
                  />
                </div>
                <button type="submit" className="btn-primary text-sm">Actualizar contraseña</button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-5">Notificaciones</h2>
              <div className="space-y-1">
                {[
                  { label: 'Predicción completada', desc: 'Aviso cuando la IA termine el análisis de un lote' },
                  { label: 'Nuevas recomendaciones', desc: 'Cuando haya recomendaciones nuevas disponibles' },
                  { label: 'Resumen semanal', desc: 'Un resumen de actividad cada semana' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={i === 0} className="sr-only peer" onChange={() => showToast('Preferencia guardada.')} />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-coffee-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-5">Información de la cuenta</h2>
              <dl className="space-y-1 text-sm mb-8">
                {[
                  ['Tipo de cuenta', user?.role === 'ADMIN' ? 'Administrador' : 'Productor'],
                  ['Correo registrado', user?.email],
                  ['Estado', 'Activo'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
                    <span className="text-gray-400">{k}</span>
                    <span className={`font-medium ${k === 'Estado' ? 'text-emerald-600' : 'text-gray-900'}`}>{v}</span>
                  </div>
                ))}
              </dl>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-red-500 mb-2">Zona de peligro</p>
                <p className="text-xs text-gray-400 mb-3">Esta acción es irreversible y eliminará toda tu información del sistema.</p>
                <button
                  className="btn-danger text-sm"
                  onClick={() => alert('Esta funcionalidad estará disponible próximamente.')}
                >
                  Eliminar cuenta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
