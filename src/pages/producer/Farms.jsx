import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useToast } from '../../components/ui/Toast'
import { Leaf, MapPin, Mountain, Plus, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

export default function Farms() {
  const { farms, addFarm, updateFarm, deleteFarm } = useData()
  const { showToast, ToastComponent } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingFarm, setEditingFarm] = useState(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const openCreate = () => {
    setEditingFarm(null)
    reset()
    setShowForm(true)
  }

  const openEdit = (farm) => {
    setEditingFarm(farm)
    Object.entries(farm).forEach(([k, v]) => setValue(k, v))
    setShowForm(true)
  }

  const onSubmit = (data) => {
    if (editingFarm) {
      updateFarm(editingFarm.id, data)
      showToast('Finca actualizada exitosamente.')
    } else {
      addFarm(data)
      showToast('Finca registrada exitosamente.')
    }
    setShowForm(false)
    reset()
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta finca? También se eliminarán sus lotes asociados.')) {
      deleteFarm(id)
      showToast('Finca eliminada.', 'warning')
    }
  }

  return (
    <div className="space-y-6">
      {ToastComponent}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Fincas</h1>
          <p className="text-gray-500 mt-1">
            {farms.length} finca{farms.length !== 1 ? 's' : ''} registrada{farms.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nueva finca
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {editingFarm ? 'Editar finca' : 'Registrar nueva finca'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la finca</label>
                  <input
                    type="text"
                    placeholder="Finca El Paraíso"
                    className="input-field"
                    {...register('name', { required: 'El nombre es obligatorio' })}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación / Vereda</label>
                  <input
                    type="text"
                    placeholder="Vereda La Esperanza"
                    className="input-field"
                    {...register('location', { required: 'La ubicación es obligatoria' })}
                  />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
                  <input type="text" placeholder="Salento" className="input-field" {...register('municipality')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                  <input type="text" placeholder="Quindío" className="input-field" {...register('department')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hectáreas</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="4.5"
                    className="input-field"
                    {...register('hectares', { min: { value: 0.1, message: 'Debe ser mayor a 0' } })}
                  />
                  {errors.hectares && <p className="text-red-500 text-xs mt-1">{errors.hectares.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Altitud (msnm)</label>
                  <input
                    type="number"
                    placeholder="1850"
                    className="input-field"
                    {...register('altitude', { min: { value: 1, message: 'Debe ser mayor a 0' } })}
                  />
                  {errors.altitude && <p className="text-red-500 text-xs mt-1">{errors.altitude.message}</p>}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  {editingFarm ? 'Guardar cambios' : 'Registrar finca'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Farm cards */}
      {farms.length === 0 ? (
        <div className="card text-center py-16">
          <Leaf size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Aún no tienes fincas registradas</p>
          <p className="text-gray-400 text-sm mt-1">Haz clic en "Nueva finca" para comenzar</p>
          <button onClick={openCreate} className="btn-primary mt-4">
            + Registrar primera finca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {farms.map((farm) => (
            <div key={farm.id} className="card hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Leaf size={20} className="text-green-600" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(farm)}
                    className="p-1.5 text-gray-400 hover:text-coffee-600 hover:bg-coffee-50 rounded-lg transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(farm.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">{farm.name}</h3>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin size={13} />
                  {[farm.municipality, farm.department].filter(Boolean).join(', ') || farm.location}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Mountain size={13} />
                  {farm.altitude ? `${farm.altitude} msnm` : 'Altitud no registrada'}
                  {farm.hectares ? ` · ${farm.hectares} ha` : ''}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  {farm.batchCount} lote{farm.batchCount !== 1 ? 's' : ''}
                </span>
                <Link
                  to={`/farms/${farm.id}`}
                  className="text-sm text-coffee-600 hover:underline flex items-center gap-1 font-medium"
                >
                  Ver detalle <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
