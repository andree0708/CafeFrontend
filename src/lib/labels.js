export const VARIETIES = [
  { value: 'caturra', label: 'Caturra' },
  { value: 'castillo', label: 'Castillo' },
  { value: 'colombia', label: 'Colombia' },
  { value: 'geisha', label: 'Geisha' },
  { value: 'tabi', label: 'Tabi' },
  { value: 'bourbon', label: 'Bourbon' },
  { value: 'typica', label: 'Típica' },
  { value: 'other', label: 'Otra' },
]

export const PROCESSES = [
  { value: 'washed', label: 'Lavado' },
  { value: 'natural', label: 'Natural' },
  { value: 'honey', label: 'Honey' },
  { value: 'anaerobic', label: 'Anaeróbico' },
  { value: 'wet-hulled', label: 'Wet hulled' },
  { value: 'other', label: 'Otro' },
]

export const PEST_CONTROL = [
  { value: 'organic', label: 'Orgánico' },
  { value: 'chemical', label: 'Químico' },
  { value: 'integrated', label: 'Integrado' },
  { value: 'none', label: 'Ninguno' },
]

export const IRRIGATION = [
  { value: 'drip', label: 'Goteo' },
  { value: 'sprinkler', label: 'Aspersión' },
  { value: 'rainfed', label: 'Temporal / lluvia' },
  { value: 'flood', label: 'Inundación' },
  { value: 'other', label: 'Otro' },
]

export const DRYING = [
  { value: 'sun', label: 'Al sol' },
  { value: 'mechanical', label: 'Mecánico' },
  { value: 'raised_bed', label: 'Camas africanas' },
  { value: 'greenhouse', label: 'Marquesina' },
  { value: 'other', label: 'Otro' },
]

export const CATEGORY_LABELS = {
  SPECIALTY: 'Especialidad',
  PREMIUM: 'Premium',
  COMMERCIAL: 'Comercial',
  LOW_GRADE: 'Bajo grado',
  PENDING: 'Pendiente',
}

const lookup = (list, value) => list.find((i) => i.value === value)?.label || value || '—'

export const labelVariety = (v) => lookup(VARIETIES, v)
export const labelProcess = (v) => lookup(PROCESSES, v)
export const labelPest = (v) => lookup(PEST_CONTROL, v)
export const labelIrrigation = (v) => lookup(IRRIGATION, v)
export const labelDrying = (v) => lookup(DRYING, v)

export const formatDate = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10)
  return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const dateInputValue = (value) => {
  if (!value) return ''
  return String(value).slice(0, 10)
}

export const mapFarm = (farm) => ({
  ...farm,
  batchCount: farm._count?.batches ?? farm.batches?.length ?? farm.batchCount ?? 0,
  ownerName: farm.producer
    ? `${farm.producer.firstName} ${farm.producer.lastName}`.trim()
    : farm.ownerName,
  ownerId: farm.producer?.userId ?? farm.producerId,
})

export const mapBatch = (batch) => ({
  ...batch,
  farmName: batch.farm?.name || batch.farmName,
  prediction: batch.aiPrediction || batch.prediction || { status: 'PENDING' },
  harvestDate: batch.harvestDate,
})

export const mapProducer = (p) => ({
  id: p.id,
  userId: p.userId,
  firstName: p.firstName,
  lastName: p.lastName,
  email: p.user?.email || p.email,
  phone: p.phone,
  farms: p._count?.farms ?? p.farms?.length ?? 0,
  batches: p.batches ?? 0,
})
