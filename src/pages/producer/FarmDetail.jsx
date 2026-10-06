import { useParams, Link, useNavigate } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import {
  Leaf, MapPin, Mountain, ArrowLeft, Package,
  Plus, Calendar, Weight, ChevronRight, Pencil,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from '../../components/ui/Toast'

export default function FarmDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getFarmById, updateFarm, getBatchesByFarm, addBatch } = useData()
  const { showToast, ToastComponent } = useToast()

  const farm = getFarmById(id)
  const batches = getBatchesByFarm(id)

  const [editingFarm, setEditingFarm] = useState(false)
  const [showBatchForm, setShowBatchForm] = useState(false)

  const farmForm = useForm({ defaultValues: farm })
  const batchForm = useForm()

  if (!farm) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Leaf size={48} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Finca no encontrada</h2>
        <p className="text-gray-400 mb-6">La finca que buscas no existe o fue eliminada.</p>
        <Link to="/farms" className="btn-primary">Volver a mis fincas</Link>
      </div>
    )
  }

  const handleUpdateFarm = (data) => {
    updateFarm(farm.id, data)
    setEditingFarm(false)
    showToast('Finca actualizada exitosamente.')
  }

  const handleAddBatch = (data) => {
    addBatch({ ...data, farmId: farm.id, farmName: farm.name })
    batchForm.reset()
    setShowBatchForm(false)
    showToast('Lote registrado exitosamente.')
  }

  return (
    <div className="space-y-6">
      {ToastComponent}

      {/* Back + header */}
      <div>
        <button
          onClick={() => navigate('/farms')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft size={15} /> Volver a mis fincas
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-xl">
              <Leaf size={24} className="text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{farm.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={13} />{farm.municipality}, {farm.department}</span>
                {farm.altitude && <span className="flex items-center gap-1"><Mountain size={13} />{farm.altitude} msnm</span>}
                {farm.hectares && <span>{farm.hectares} ha</span>}
              </div>
            </div>
          </div>
          <button
            onClick={() => setEditingFarm(true)}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Pencil size={14} /> Editar finca
          </button>
        </div>
      </div>

      {/* Edit farm modal */}
      {editingFarm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Editar finca</h2>
            <form onSubmit={farmForm.handleSubmit(handleUpdateFarm)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input className="input-field" {...farmForm.register('name', { required: true })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación / Vereda</label>
                <input className="input-field" {...farmForm.register('location')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
                  <input className="input-field" {...farmForm.register('municipality')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                  <input className="input-field" {...farmForm.register('department')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hectáreas</label>
                  <input type="number" step="0.1" className="input-field" {...farmForm.register('hectares')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Altitud (msnm)</label>
                  <input type="number" className="input-field" {...farmForm.register('altitude')} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Guardar cambios</button>
                <button type="button" onClick={() => setEditingFarm(false)} className="btn-secondary flex-1">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-coffee-600">{batches.length}</p>
          <p className="text-sm text-gray-500 mt-1">Lotes registrados</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-emerald-600">
            {batches.filter((b) => b.prediction?.qualityCategory === 'SPECIALTY').length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Lotes especialidad</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-blue-600">
            {batches.filter((b) => b.prediction?.status === 'PENDING').length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Pendientes de análisis</p>
        </div>
      </div>

      {/* Batches section */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Lotes de esta finca</h2>
          <button
            onClick={() => setShowBatchForm(true)}
            className="btn-primary text-sm flex items-center gap-1.5"
          >
            <Plus size={14} /> Nuevo lote
          </button>
        </div>

        {batches.length === 0 ? (
          <div className="text-center py-12">
            <Package size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">Sin lotes registrados</p>
            <p className="text-gray-400 text-sm mt-1">Registra el primer lote de esta finca</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {batches.map((batch) => (
              <div key={batch.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Package size={16} className="text-coffee-400 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{batch.code}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      {batch.harvestDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} /> {batch.harvestDate}
                        </span>
                      )}
                      {batch.weight && (
                        <span className="flex items-center gap-1">
                          <Weight size={11} /> {batch.weight} kg
                        </span>
                      )}
                      {batch.variety && <span>{batch.variety}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {batch.prediction?.predictedScore && (
                    <span className="text-sm font-bold text-gray-900">
                      {batch.prediction.predictedScore} pts
                    </span>
                  )}
                  <Badge category={batch.prediction?.qualityCategory || 'PENDING'} />
                  <Link
                    to={`/batches/${batch.id}`}
                    className="flex items-center gap-1 text-sm text-coffee-600 hover:underline font-medium"
                  >
                    Ver <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New batch modal */}
      {showBatchForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Registrar nuevo lote</h2>
            <form onSubmit={batchForm.handleSubmit(handleAddBatch)} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código del lote</label>
                  <input
                    placeholder="LOT-2024-001"
                    className="input-field"
                    {...batchForm.register('code', { required: 'El código es obligatorio' })}
                  />
                  {batchForm.formState.errors.code && (
                    <p className="text-red-500 text-xs mt-1">{batchForm.formState.errors.code.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de cosecha</label>
                  <input type="date" className="input-field" {...batchForm.register('harvestDate', { required: 'Requerido' })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                  <input type="number" step="0.1" placeholder="450" className="input-field" {...batchForm.register('weight')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Variedad</label>
                  <input placeholder="Caturra, Castillo..." className="input-field" {...batchForm.register('variety')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Método de proceso</label>
                  <select className="input-field" {...batchForm.register('processingMethod')}>
                    <option value="">Seleccionar...</option>
                    <option value="Lavado">Lavado</option>
                    <option value="Natural">Natural</option>
                    <option value="Honey">Honey</option>
                    <option value="Anaeróbico">Anaeróbico</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Registrar lote</button>
                <button type="button" onClick={() => setShowBatchForm(false)} className="btn-secondary flex-1">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
