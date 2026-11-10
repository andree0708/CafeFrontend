import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useData } from '../../context/DataContext'
import { useToast } from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import { Leaf, Pencil, Trash2, Mountain, MapPin, ArrowRight } from 'lucide-react'

function FarmForm({ editing, onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: editing || {} })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label className="label-field">Nombre de la finca</label>
        <input className="input-field" maxLength={100} placeholder="Finca El Paraíso"
          {...register('name', { required: 'Obligatorio', minLength: 2 })} />
        {errors.name && <p className="text-coral-700 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="label-field">Vereda / ubicación</label>
        <input className="input-field" maxLength={150} placeholder="Vereda La Esperanza"
          {...register('location', { required: 'Obligatorio', minLength: 3 })} />
        {errors.location && <p className="text-coral-700 text-xs mt-1">{errors.location.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-field">Municipio</label>
          <input className="input-field" placeholder="Salento" {...register('municipality')} />
        </div>
        <div>
          <label className="label-field">Departamento</label>
          <input className="input-field" placeholder="Quindío" {...register('department')} />
        </div>
        <div>
          <label className="label-field">Hectáreas</label>
          <input type="number" step="0.1" min="0.1" max="100000" className="input-field" placeholder="4.5"
            {...register('hectares', { min: { value: 0.1, message: 'Mínimo 0.1' } })} />
          {errors.hectares && <p className="text-coral-700 text-xs mt-1">{errors.hectares.message}</p>}
        </div>
        <div>
          <label className="label-field">Altitud (msnm)</label>
          <input type="number" min="0" max="6000" className="input-field" placeholder="1850"
            {...register('altitude', { min: 0, max: 6000 })} />
        </div>
      </div>
      <button type="submit" className="btn-primary w-full">
        {editing ? 'Guardar cambios' : 'Registrar finca'}
      </button>
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
    if (!window.confirm(`¿Eliminar "${farm.name}" y todos sus lotes?`)) return
    try {
      await deleteFarm(farm.id)
      showToast('Finca eliminada.', 'warning')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {ToastComponent}

      {modal && (
        <Modal
          title={typeof modal === 'object' ? 'Editar finca' : 'Nueva finca'}
          subtitle={typeof modal === 'object' ? modal.name : 'Completa la información básica de la finca'}
          onClose={() => setModal(null)}
        >
          <FarmForm editing={typeof modal === 'object' ? modal : null} onSubmit={handleSubmit} />
        </Modal>
      )}

      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="page-kicker">Trazabilidad</p>
          <h1 className="page-title mt-2">Fincas</h1>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary">
          <Leaf size={14} /> Nueva finca
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center gap-2 text-muted animate-pulse">
          <span className="w-4 h-4 border-2 border-crema/30 border-t-crema rounded-full animate-spin" />
          Cargando…
        </div>
      ) : farms.length === 0 ? (
        <EmptyState
          icon={Leaf}
          title="Sin fincas"
          body="Registra el origen de tu café para poder crear lotes y obtener predicciones."
          action={<button className="btn-primary" onClick={() => setModal('create')}><Leaf size={14} /> Registrar finca</button>}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {farms.map((farm) => (
            <article key={farm.id} className="card group hover:shadow-warm transition-all duration-200">
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-sage-100 flex items-center justify-center shrink-0">
                    <Leaf size={14} className="text-sage-600" />
                  </div>
                  <p className="page-kicker">{farm.department || 'Colombia'}</p>
                </div>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setModal(farm)}
                    className="p-1.5 rounded text-muted hover:text-ink hover:bg-line transition-colors"
                    title="Editar"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(farm)}
                    className="p-1.5 rounded text-muted hover:text-coral-700 hover:bg-coral-50 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Name */}
              <h2 className="font-display text-2xl mt-4 text-ink leading-tight">{farm.name}</h2>

              {/* Details */}
              <div className="mt-2 space-y-1">
                {(farm.location || farm.municipality) && (
                  <p className="flex items-center gap-1.5 text-sm text-muted">
                    <MapPin size={12} className="text-crema shrink-0" />
                    {[farm.location, farm.municipality].filter(Boolean).join(' · ')}
                  </p>
                )}
                <p className="flex items-center gap-1.5 text-sm text-muted">
                  <Mountain size={12} className="text-crema shrink-0" />
                  {farm.altitude ? `${farm.altitude} msnm` : 'Sin altitud'}
                  {farm.hectares ? ` · ${farm.hectares} ha` : ''}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-line">
                <span className="tag">
                  {farm.batchCount ?? 0} lote{farm.batchCount === 1 ? '' : 's'}
                </span>
                <Link
                  to={`/farms/${farm.id}`}
                  className="flex items-center gap-1 text-sm text-espresso font-medium hover:text-roast transition-colors"
                >
                  Abrir <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
