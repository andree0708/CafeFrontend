import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useData } from '../../context/DataContext'
import { useToast } from '../../components/ui/Toast'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { ArrowLeft, Pencil, Mountain, MapPin, ArrowRight, Zap } from 'lucide-react'
import { PROCESSES, VARIETIES, formatDate, labelVariety } from '../../lib/labels'

export default function FarmDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getFarmById, updateFarm, getBatchesByFarm, addBatch, loading } = useData()
  const { showToast, ToastComponent } = useToast()
  const farm    = getFarmById(id)
  const batches = getBatchesByFarm(id)
  const [editing, setEditing]     = useState(false)
  const [showBatch, setShowBatch] = useState(false)
  const farmForm  = useForm({ defaultValues: farm || {} })
  const batchForm = useForm()

  if (!loading && !farm) {
    return (
      <div className="text-center py-24 animate-fade-up">
        <p className="page-kicker">Error</p>
        <h2 className="page-title mt-2">Finca no encontrada</h2>
        <Link to="/farms" className="btn-primary mt-6">Volver a fincas</Link>
      </div>
    )
  }
  if (!farm) return <div className="flex items-center gap-2 text-muted py-12 animate-pulse"><span className="w-4 h-4 border-2 border-crema/30 border-t-crema rounded-full animate-spin" />Cargando…</div>

  const done      = batches.filter((b) => b.prediction?.status === 'DONE')
  const specialty = batches.filter((b) => b.prediction?.qualityCategory === 'SPECIALTY')
  const pending   = batches.filter((b) => b.prediction?.status !== 'DONE')

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
    <div className="space-y-8 animate-fade-up">
      {ToastComponent}

      {/* Back */}
      <button
        onClick={() => navigate('/farms')}
        className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
      >
        <ArrowLeft size={14} /> Fincas
      </button>

      {/* Hero */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="page-kicker flex items-center gap-2">
            {farm.municipality && <MapPin size={10} className="text-crema" />}
            {[farm.municipality, farm.department].filter(Boolean).join(' · ') || 'Finca'}
          </p>
          <h1 className="page-title mt-2">{farm.name}</h1>
          <p className="text-muted mt-2 text-sm flex flex-wrap items-center gap-x-3 gap-y-1">
            {farm.location && <span>{farm.location}</span>}
            {farm.altitude && <span className="flex items-center gap-1"><Mountain size={12} className="text-crema" />{farm.altitude} msnm</span>}
            {farm.hectares && <span>{farm.hectares} ha</span>}
          </p>
        </div>
        <button className="btn-secondary" onClick={() => setEditing(true)}>
          <Pencil size={13} /> Editar
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Lotes', value: batches.length },
          { label: 'Especialidad', value: specialty.length },
          { label: 'Sin analizar', value: pending.length },
        ].map(({ label, value }) => (
          <div key={label} className="card-flat text-center">
            <p className="font-display text-4xl text-ink">{value}</p>
            <p className="page-kicker mt-2">{label}</p>
          </div>
        ))}
      </div>

      {/* Batches */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="font-display text-xl">Lotes</h2>
          <button className="btn-primary" onClick={() => setShowBatch(true)}>Nuevo lote</button>
        </div>

        {batches.length === 0 ? (
          <div className="text-center py-14 px-6">
            <p className="text-muted text-sm">Esta finca aún no tiene lotes.</p>
            <button className="btn-secondary mt-4" onClick={() => setShowBatch(true)}>Registrar primer lote</button>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {batches.map((b) => (
              <li key={b.id} className="group flex items-center justify-between px-6 py-4 hover:bg-canvas transition-colors">
                <div>
                  <p className="font-medium text-ink">{b.code}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {formatDate(b.harvestDate)}
                    {b.variety ? ` · ${labelVariety(b.variety)}` : ''}
                    {b.weight ? ` · ${b.weight} kg` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {b.prediction?.predictedScore != null && (
                    <span className="font-display text-2xl text-ink">{b.prediction.predictedScore}</span>
                  )}
                  <Badge category={b.prediction?.qualityCategory || 'PENDING'} />
                  <Link
                    to={`/batches/${b.id}`}
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-espresso font-medium transition-opacity hover:text-roast"
                  >
                    Abrir <ArrowRight size={12} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <Modal title="Editar finca" subtitle={farm.name} onClose={() => setEditing(false)}>
          <form onSubmit={farmForm.handleSubmit(handleUpdate)} className="space-y-3">
            <div>
              <label className="label-field">Nombre</label>
              <input className="input-field" {...farmForm.register('name', { required: true })} />
            </div>
            <div>
              <label className="label-field">Vereda / ubicación</label>
              <input className="input-field" {...farmForm.register('location')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-field">Municipio</label>
                <input className="input-field" {...farmForm.register('municipality')} />
              </div>
              <div>
                <label className="label-field">Departamento</label>
                <input className="input-field" {...farmForm.register('department')} />
              </div>
              <div>
                <label className="label-field">Hectáreas</label>
                <input type="number" step="0.1" className="input-field" {...farmForm.register('hectares')} />
              </div>
              <div>
                <label className="label-field">Altitud (msnm)</label>
                <input type="number" className="input-field" {...farmForm.register('altitude')} />
              </div>
            </div>
            <button className="btn-primary w-full mt-2">Guardar cambios</button>
          </form>
        </Modal>
      )}

      {/* New batch modal */}
      {showBatch && (
        <Modal
          title="Nuevo lote"
          subtitle={`Finca ${farm.name}`}
          onClose={() => setShowBatch(false)}
        >
          <form onSubmit={batchForm.handleSubmit(handleAddBatch)} className="space-y-4" noValidate>
            <div>
              <label className="label-field">Código del lote</label>
              <input
                className="input-field"
                placeholder="LOT-2026-001"
                maxLength={30}
                {...batchForm.register('code', {
                  required: 'Obligatorio',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                  pattern: { value: /^[a-zA-Z0-9\-_]+$/, message: 'Solo letras, números, guion o guion bajo' },
                })}
              />
              {batchForm.formState.errors.code && <p className="text-coral-700 text-xs mt-1">{batchForm.formState.errors.code.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-field">Fecha de cosecha</label>
                <input type="date" className="input-field" {...batchForm.register('harvestDate', { required: 'Obligatorio' })} />
                {batchForm.formState.errors.harvestDate && <p className="text-coral-700 text-xs mt-1">Requerido</p>}
              </div>
              <div>
                <label className="label-field">Peso (kg)</label>
                <input type="number" step="0.1" min="0.1" max="100000" className="input-field" placeholder="450" {...batchForm.register('weight')} />
              </div>
              <div>
                <label className="label-field">Variedad</label>
                <select className="input-field" {...batchForm.register('variety')}>
                  <option value="">Seleccionar</option>
                  {VARIETIES.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">Proceso</label>
                <select className="input-field" {...batchForm.register('processingMethod')}>
                  <option value="">Seleccionar</option>
                  {PROCESSES.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
                </select>
              </div>
            </div>
            <button className="btn-primary w-full"><Zap size={13} /> Registrar y abrir lote</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
