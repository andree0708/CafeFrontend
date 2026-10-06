import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useForm } from 'react-hook-form'
import { useToast } from '../components/ui/Toast'
import { User, Lock, Bell, Shield, ChevronRight } from 'lucide-react'

export default function Settings() {
  const { user } = useAuth()
  const { showToast, ToastComponent } = useToast()
  const [activeTab, setActiveTab] = useState('profile')

  const profileForm = useForm({
    defaultValues: {
      firstName: user?.producer?.firstName || '',
      lastName: user?.producer?.lastName || '',
      email: user?.email || '',
      phone: '',
    },
  })

  const passwordForm = useForm()

  const handleProfileSave = (data) => {
    showToast('Perfil actualizado correctamente.')
  }

  const handlePasswordSave = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      showToast('Las contraseñas no coinciden.', 'error')
      return
    }
    passwordForm.reset()
    showToast('Contraseña actualizada correctamente.')
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'password', label: 'Contraseña', icon: Lock },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'account', label: 'Cuenta', icon: Shield },
  ]

  return (
    <div className="space-y-6">
      {ToastComponent}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">Administra tu perfil y preferencias</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-56 shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-coffee-50 text-coffee-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon size={16} />
                  {label}
                </span>
                <ChevronRight size={14} className="text-gray-400" />
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-5">Información personal</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 rounded-full bg-coffee-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-coffee-100 text-coffee-700 text-xs font-medium rounded-full">
                    {user?.role === 'ADMIN' ? 'Administrador' : 'Productor'}
                  </span>
                </div>
              </div>

              <form onSubmit={profileForm.handleSubmit(handleProfileSave)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input className="input-field" {...profileForm.register('firstName')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <input className="input-field" {...profileForm.register('lastName')} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                  <input type="email" className="input-field" {...profileForm.register('email')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" placeholder="+57 300 000 0000" className="input-field" {...profileForm.register('phone')} />
                </div>
                <div className="pt-2">
                  <button type="submit" className="btn-primary">Guardar cambios</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-5">Cambiar contraseña</h2>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSave)} className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
                  <input type="password" className="input-field" {...passwordForm.register('currentPassword', { required: true })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                  <input type="password" placeholder="Mínimo 8 caracteres" className="input-field" {...passwordForm.register('newPassword', { required: true, minLength: 8 })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
                  <input type="password" className="input-field" {...passwordForm.register('confirmPassword', { required: true })} />
                </div>
                <div className="pt-2">
                  <button type="submit" className="btn-primary">Actualizar contraseña</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-5">Preferencias de notificaciones</h2>
              <div className="space-y-4">
                {[
                  { label: 'Predicción completada', desc: 'Recibir aviso cuando la IA termine el análisis de un lote' },
                  { label: 'Nuevas recomendaciones', desc: 'Notificar cuando haya nuevas recomendaciones disponibles' },
                  { label: 'Resumen semanal', desc: 'Enviar un resumen de actividad cada semana' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={i === 0} className="sr-only peer" />
                      <div className="w-10 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-coffee-300 rounded-full peer peer-checked:bg-coffee-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-5">Información de la cuenta</h2>
              <div className="space-y-3 text-sm mb-8">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Tipo de cuenta</span>
                  <span className="font-medium">{user?.role === 'ADMIN' ? 'Administrador' : 'Productor'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Correo registrado</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Estado</span>
                  <span className="text-emerald-600 font-medium">Activo</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-red-600 mb-2">Zona de peligro</p>
                <button className="btn-danger text-sm">Eliminar cuenta</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
