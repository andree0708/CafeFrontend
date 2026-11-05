import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useData } from '../../context/DataContext'
import { useToast } from '../../components/ui/Toast'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { ArrowLeft } from 'lucide-react'
import { PROCESSES, VARIETIES, formatDate, labelVariety } from '../../lib/labels'

export default function FarmDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getFarmById, updateFarm, getBatchesByFarm, addBatch, loading } = useData()
  const { showToast, ToastComponent } = useToast()
  const farm = getFarmById(id)
  const batches = getBatchesByFarm(id)
  const [editing, setEditing] = useState(false)
  const [showBatch, setShowBatch] = useState(false)
  const farmForm = useForm({ defaultValues: farm || {} })
  const batchForm = useForm()

  if (!loading && !farm) {
    return (
      <div className="text-center py-24">
        <h2 className="page-title">Finca no encontrada</h2>
        <Link to="/farms" className="btn-primary mt-6">Volver</Link>
      </div>
    )
  }
  if (!farm) return <p className="text-stone-500">Cargando…</p>

  const handleUpdate = async (data) => {
    try {
      await updateFarm(farm.id, data)
      setEditing(false)
      showToast('Finca actualizada.')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleAddBatch = async (data) => {
    try {
      const created = await addBatch({ ...data, farmId: farm.id })
      batchForm.reset()
      setShowBatch(false)
      showToast('Lote registrado.')
      navigate(`/batches/${created.id}`)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className="space-y-8">
      {ToastComponent}
      <button onClick={() => navigate('/farms')} className="flex items-center gap-2 text-sm text-stone-500 hover:text-ink">
        <ArrowLeft size={14} /> Fincas
      </button>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="page-kicker">{[farm.municipality, farm.department].filter(Boolean).join(' · ') || 'Finca'}</p>
          <h1 className="page-title mt-2">{farm.name}</h1>
          <p className="text-stone-500 mt-2 text-sm">
            {farm.location} · {farm.altitude ? `${farm.altitude} msnm` : 'sin altitud'} · {farm.hectares ? `${farm.hectares} ha` : 'área n/d'}
          </p>
        </div>
        <button className="btn-secondary" onClick={() => setEditing(true)}>Editar</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="font-display text-3xl">{batches.length}</p>
          <p className="page-kicker mt-2">Lotes</p>
        </div>
        <div className="card text-center">
          <p className="font-display text-3xl">{batches.filter((b) => b.prediction?.qualityCategory === 'SPECIALTY').length}</p>
          <p className="page-kicker mt-2">Especialidad</p>
        </div>
        <div className="card text-center">
          <p className="font-display text-3xl">{batches.filter((b) => b.prediction?.status !== 'DONE').length}</p>
          <p className="page-kicker mt-2">Pendientes</p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="font-display text-xl">Lotes</h2>
          <button className="btn-primary" onClick={() => setShowBatch(true)}>Nuevo lote</button>
        </div>
        {batches.length === 0 ? (
          <p className="px-6 py-12 text-sm text-stone-500">Esta finca aún no tiene lotes.</p>
        ) : (
          <ul className="divide-y divide-line">
            {batches.map((b) => (
              <li key={b.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium">{b.code}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{formatDate(b.harvestDate)} · {labelVariety(b.variety)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge category={b.prediction?.qualityCategory || 'PENDING'} />
                  <Link to={`/batches/${b.id}`} className="text-sm underline underline-offset-4">Abrir</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing && (
        <Modal title="Editar finca" onClose={() => setEditing(false)}>
          <form onSubmit={farmForm.handleSubmit(handleUpdate)} className="space-y-3">
            <input className="input-field" {...farmForm.register('name', { required: true })} />
            <input className="input-field" {...farmForm.register('location')} />
            <div className="grid grid-cols-2 gap-3">
              <input className="input-field" placeholder="Municipio" {...farmForm.register('municipality')} />
              <input className="input-field" placeholder="Departamento" {...farmForm.register('department')} />
              <input type="number" step="0.1" className="input-field" placeholder="Hectáreas" {...farmForm.register('hectares')} />
              <input type="number" className="input-field" placeholder="Altitud" {...farmForm.register('altitude')} />
            </div>
            <button className="btn-primary w-full">Guardar</button>
          </form>
        </Modal>
      )}

      {showBatch && (
        <Modal title="Nuevo lote" onClose={() => setShowBatch(false)}>
          <form onSubmit={batchForm.handleSubmit(handleAddBatch)} className="space-y-3" noValidate>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Código</label>
              <input className="input-field" placeholder="LOT-2026-001" {...batchForm.register('code', { required: 'Obligatorio', minLength: 3, pattern: /^[a-zA-Z0-9\-_]+$/ })} />
              {batchForm.formState.errors.code && <p className="text-red-700 text-xs mt-1">Usa letras, números, guion o guion bajo (3–30).</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Cosecha</label>
                <input type="date" className="input-field" {...batchForm.register('harvestDate', { required: true })} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Peso (kg)</label>
                <input type="number" step="0.1" className="input-field" {...batchForm.register('weight')} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Variedad</label>
                <select className="input-field" {...batchForm.register('variety')}>
                  <option value="">Seleccionar</option>
                  {VARIETIES.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">Proceso</label>
                <select className="input-field" {...batchForm.register('processingMethod')}>
                  <option value="">Seleccionar</option>
                  {PROCESSES.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
                </select>
              </div>
            </div>
            <button className="btn-primary w-full">Registrar lote</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
