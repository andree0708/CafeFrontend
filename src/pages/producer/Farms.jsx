import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useToast } from '../../components/ui/Toast'
import { Leaf, MapPin, Mountain, Plus, ChevronRight, Pencil, Trash2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'

function FarmModal({ onClose, onSubmit, editing }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: editing || {},
  })

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {editing ? 'Editar finca' : 'Registrar nueva finca'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la finca <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Finca El Paraíso"
              className="input-field"
              maxLength={100}
              {...register('name', {
                required: 'El nombre es obligatorio',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                maxLength: { value: 100, message: 'Máximo 100 caracteres' },
              })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación / Vereda <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Vereda La Esperanza"
              className="input-field"
              maxLength={150}
              {...register('location', {
                required: 'La ubicación es obligatoria',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                maxLength: { value: 150, message: 'Máximo 150 caracteres' },
              })}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
              <input
                type="text"
                placeholder="Salento"
                className="input-field"
                maxLength={80}
                {...register('municipality', {
                  maxLength: { value: 80, message: 'Máximo 80 caracteres' },
                })}
              />
              {errors.municipality && <p className="text-red-500 text-xs mt-1">{errors.municipality.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <input
                type="text"
                placeholder="Quindío"
                className="input-field"
                maxLength={80}
                {...register('department', {
                  maxLength: { value: 80, message: 'Máximo 80 caracteres' },
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hectáreas</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="100000"
                placeholder="4.5"
                className="input-field"
                {...register('hectares', {
                  min: { value: 0.1, message: 'Mínimo 0.1 ha' },
                  max: { value: 100000, message: 'Máximo 100,000 ha' },
                })}
              />
              {errors.hectares && <p className="text-red-500 text-xs mt-1">{errors.hectares.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Altitud (msnm)</label>
              <input
                type="number"
                min="0"
                max="6000"
                placeholder="1850"
                className="input-field"
                {...register('altitude', {
                  min: { value: 0, message: 'Mínimo 0' },
                  max: { value: 6000, message: 'Máximo 6,000 msnm' },
                })}
              />
              {errors.altitude && <p className="text-red-500 text-xs mt-1">{errors.altitude.message}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              {editing ? 'Guardar cambios' : 'Registrar finca'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Farms() {
  const { farms, addFarm, updateFarm, deleteFarm } = useData()
  const { showToast, ToastComponent } = useToast()
  const [modal, setModal] = useState(null) // null | 'create' | farm object

  const handleSubmit = (data) => {
    if (modal && typeof modal === 'object') {
      updateFarm(modal.id, data)
      showToast('Finca actualizada exitosamente.')
    } else {
      addFarm(data)
      showToast('Finca registrada exitosamente.')
    }
    setModal(null)
  }

  const handleDelete = (farm) => {
    if (window.confirm(`¿Eliminar "${farm.name}"? También se eliminarán sus lotes asociados.`)) {
      deleteFarm(farm.id)
      showToast('Finca eliminada.', 'warning')
    }
  }

  return (
    <div className="space-y-6">
      {ToastComponent}

      {modal && (
        <FarmModal
          editing={typeof modal === 'object' ? modal : null}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Fincas</h1>
          <p className="text-gray-400 mt-0.5 text-sm">
            {farms.length === 0 ? 'Ninguna finca registrada aún' : `${farms.length} finca${farms.length !== 1 ? 's' : ''} registrada${farms.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} /> Nueva finca
        </button>
      </div>

      {/* Empty state */}
      {farms.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center py-16 px-6">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf size={26} className="text-green-500" />
          </div>
          <p className="font-semibold text-gray-700 mb-1">Aún no tienes fincas</p>
          <p className="text-gray-400 text-sm mb-5 max-w-xs mx-auto">
            Registra tu primera finca para empezar a gestionar tus lotes de café.
          </p>
          <button onClick={() => setModal('create')} className="btn-primary text-sm">
            + Registrar primera finca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {farms.map((farm) => (
            <div key={farm.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              {/* Card header */}
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 bg-green-50 rounded-xl">
                    <Leaf size={18} className="text-green-600" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setModal(farm)}
                      className="p-1.5 text-gray-300 hover:text-coffee-600 hover:bg-coffee-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(farm)}
                      className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 leading-tight">{farm.name}</h3>

                <div className="space-y-1.5">
                  {(farm.municipality || farm.department) && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <MapPin size={11} className="shrink-0" />
                      {[farm.municipality, farm.department].filter(Boolean).join(', ')}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {farm.altitude && (
                      <span className="flex items-center gap-1">
                        <Mountain size={11} /> {farm.altitude} msnm
                      </span>
                    )}
                    {farm.hectares && (
                      <span>{farm.hectares} ha</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card footer */}
              <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                  {farm.batchCount || 0} lote{(farm.batchCount || 0) !== 1 ? 's' : ''}
                </span>
                <Link
                  to={`/farms/${farm.id}`}
                  className="flex items-center gap-1 text-xs text-coffee-600 hover:text-coffee-700 font-medium transition-colors"
                >
                  Ver detalle <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
