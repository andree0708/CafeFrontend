import { useAuth } from '../context/AuthContext'
import { useForm } from 'react-hook-form'
import { useToast } from '../components/ui/Toast'

export default function Settings() {
  const { user, displayName, changePassword, updateProducer } = useAuth()
  const { showToast, ToastComponent } = useToast()
  const profileForm = useForm({
    defaultValues: {
      firstName: user?.producer?.firstName || '',
      lastName: user?.producer?.lastName || '',
      phone: user?.producer?.phone || '',
    },
  })
  const passwordForm = useForm()

  const saveProfile = async (data) => {
    if (!user?.producer?.id) {
      showToast('El administrador no tiene perfil de productor.', 'warning')
      return
    }
    const res = await updateProducer(user.producer.id, data)
    if (!res.success) return showToast(res.message, 'error')
    showToast('Perfil actualizado.')
  }

  const savePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      showToast('Las contraseñas no coinciden.', 'error')
      return
    }
    const res = await changePassword(data.currentPassword, data.newPassword)
    if (!res.success) return showToast(res.message, 'error')
    passwordForm.reset()
    showToast('Contraseña actualizada.')
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {ToastComponent}
      <div>
        <p className="page-kicker">Cuenta</p>
        <h1 className="page-title mt-2">{displayName}</h1>
        <p className="text-stone-500 text-sm mt-2">{user?.email} · {user?.role === 'ADMIN' ? 'Administrador' : 'Productor'}</p>
      </div>

      {user?.producer && (
        <form onSubmit={profileForm.handleSubmit(saveProfile)} className="card space-y-4">
          <h2 className="font-display text-xl">Perfil</h2>
          <div className="grid grid-cols-2 gap-3">
            <input className="input-field" placeholder="Nombre" {...profileForm.register('firstName')} />
            <input className="input-field" placeholder="Apellido" {...profileForm.register('lastName')} />
          </div>
          <input className="input-field" placeholder="Teléfono" {...profileForm.register('phone')} />
          <button className="btn-primary">Guardar perfil</button>
        </form>
      )}

      <form onSubmit={passwordForm.handleSubmit(savePassword)} className="card space-y-4">
        <h2 className="font-display text-xl">Contraseña</h2>
        <input type="password" className="input-field" placeholder="Actual" {...passwordForm.register('currentPassword', { required: true })} />
        <input type="password" className="input-field" placeholder="Nueva (Aa1…)" {...passwordForm.register('newPassword', { required: true, minLength: 8 })} />
        <input type="password" className="input-field" placeholder="Confirmar" {...passwordForm.register('confirmPassword', { required: true })} />
        <button className="btn-primary">Actualizar contraseña</button>
      </form>
    </div>
  )
}
