import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useData } from '../../context/DataContext'
import { useToast } from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import { Leaf, Pencil, Trash2 } from 'lucide-react'

function FarmForm({ editing, onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: editing || {} })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Nombre</label>
        <input className="input-field" maxLength={100} {...register('name', { required: 'Obligatorio', minLength: 2 })} />
        {errors.name && <p className="text-red-700 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Vereda / ubicación</label>
        <input className="input-field" maxLength={150} {...register('location', { required: 'Obligatorio', minLength: 3 })} />
        {errors.location && <p className="text-red-700 text-xs mt-1">{errors.location.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Municipio</label>
          <input className="input-field" {...register('municipality')} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Departamento</label>
          <input className="input-field" {...register('department')} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Hectáreas</label>
          <input type="number" step="0.1" className="input-field" {...register('hectares')} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Altitud (msnm)</label>
          <input type="number" className="input-field" {...register('altitude')} />
        </div>
      </div>
      <button type="submit" className="btn-primary w-full">{editing ? 'Guardar' : 'Registrar finca'}</button>
    </form>
  )
}

export default function Farms() {
  const { farms, addFarm, updateFarm, deleteFarm, loading } = useData()
  const { showToast, ToastComponent } = useToast()
  const [modal, setModal] = useState(null)

  const handleSubmit = async (data) => {
    try {
      if (modal && typeof modal === 'object') {
        await updateFarm(modal.id, data)
        showToast('Finca actualizada.')
      } else {
        await addFarm(data)
        showToast('Finca registrada.')
      }
      setModal(null)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleDelete = async (farm) => {
    if (!window.confirm(`¿Eliminar “${farm.name}” y sus lotes?`)) return
    try {
      await deleteFarm(farm.id)
      showToast('Finca eliminada.', 'warning')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className="space-y-8">
      {ToastComponent}
      {modal && (
        <Modal title={typeof modal === 'object' ? 'Editar finca' : 'Nueva finca'} onClose={() => setModal(null)}>
          <FarmForm editing={typeof modal === 'object' ? modal : null} onSubmit={handleSubmit} />
        </Modal>
      )}

      <div className="flex items-end justify-between">
        <div>
          <p className="page-kicker">Trazabilidad</p>
          <h1 className="page-title mt-2">Fincas</h1>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary">Nueva finca</button>
      </div>

      {loading ? <p className="text-stone-500">Cargando…</p> : farms.length === 0 ? (
        <EmptyState icon={Leaf} title="Sin fincas" body="Registra el origen de tu café para poder crear lotes." action={<button className="btn-primary" onClick={() => setModal('create')}>Registrar finca</button>} />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {farms.map((farm) => (
            <article key={farm.id} className="card group">
              <div className="flex justify-between items-start">
                <p className="page-kicker">{farm.department || 'Colombia'}</p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                  <button onClick={() => setModal(farm)} className="p-1.5 text-stone-400 hover:text-ink"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(farm)} className="p-1.5 text-stone-400 hover:text-red-800"><Trash2 size={14} /></button>
                </div>
              </div>
              <h2 className="font-display text-2xl mt-3">{farm.name}</h2>
              <p className="text-sm text-stone-500 mt-1">
                {[farm.location, farm.municipality].filter(Boolean).join(' · ')}
              </p>
              <p className="text-sm text-stone-500 mt-1">
                {farm.altitude ? `${farm.altitude} msnm` : 'Sin altitud'} · {farm.hectares ? `${farm.hectares} ha` : 'Área n/d'}
              </p>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-line">
                <span className="text-xs text-stone-500">{farm.batchCount} lote{farm.batchCount === 1 ? '' : 's'}</span>
                <Link to={`/farms/${farm.id}`} className="text-sm underline underline-offset-4">Abrir</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
