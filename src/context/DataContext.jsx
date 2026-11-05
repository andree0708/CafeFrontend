import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { mapBatch, mapFarm, mapProducer } from '../lib/labels'

const DataContext = createContext(null)

export function DataProvider({ children, user }) {
  const [allFarms, setAllFarms] = useState([])
  const [allBatches, setAllBatches] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isAdmin = user?.role === 'ADMIN'

  const refresh = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const [farmsRes, batchesRes] = await Promise.all([
        api.get('/api/farms'),
        api.get('/api/batches'),
      ])
      const farms = (farmsRes.data.farms || []).map(mapFarm)
      const batches = (batchesRes.data.batches || []).map(mapBatch)
      setAllFarms(farms)
      setAllBatches(batches)

      if (isAdmin) {
        const prodRes = await api.get('/api/producers')
        const producers = (prodRes.data.producers || []).map((p) => {
          const mapped = mapProducer(p)
          const farmIds = farms.filter((f) => f.producerId === p.id).map((f) => f.id)
          return {
            ...mapped,
            farms: farms.filter((f) => f.producerId === p.id).length,
            batches: batches.filter((b) => farmIds.includes(b.farmId)).length,
          }
        })
        setAllUsers(producers)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user, isAdmin])

  useEffect(() => {
    refresh()
  }, [refresh])

  const farms = allFarms
  const batches = allBatches

  const addFarm = async (data) => {
    const res = await api.post('/api/farms', {
      ...data,
      hectares: data.hectares ? Number(data.hectares) : undefined,
      altitude: data.altitude ? Number(data.altitude) : undefined,
    })
    await refresh()
    return mapFarm(res.data.farm)
  }

  const updateFarm = async (id, data) => {
    await api.put(`/api/farms/${id}`, {
      ...data,
      hectares: data.hectares ? Number(data.hectares) : undefined,
      altitude: data.altitude ? Number(data.altitude) : undefined,
    })
    await refresh()
  }

  const deleteFarm = async (id) => {
    await api.del(`/api/farms/${id}`)
    await refresh()
  }

  const getFarmById = (id) => allFarms.find((f) => f.id === Number(id))

  const addBatch = async (data) => {
    const res = await api.post(`/api/farms/${data.farmId}/batches`, {
      code: data.code,
      harvestDate: data.harvestDate,
      processingMethod: data.processingMethod || undefined,
      variety: data.variety || undefined,
      weight: data.weight ? Number(data.weight) : undefined,
      notes: data.notes || undefined,
    })
    await refresh()
    return mapBatch(res.data.batch)
  }

  const getBatchById = (id) => allBatches.find((b) => b.id === Number(id))
  const getBatchesByFarm = (farmId) => allBatches.filter((b) => b.farmId === Number(farmId))

  const fetchBatch = async (id) => {
    const res = await api.get(`/api/batches/${id}`)
    return mapBatch(res.data.batch)
  }

  const saveVariables = async (batchId, data) => {
    const payload = { ...data }
    ;[
      'avgTemperature', 'avgRainfall', 'avgHumidity', 'soilPH',
      'soilOrganicMatter', 'soilNitrogen', 'dryingDays', 'storageMoisture',
    ].forEach((key) => {
      if (payload[key] === '' || payload[key] === undefined || payload[key] === null) delete payload[key]
      else payload[key] = Number(payload[key])
    })
    ;['fertilizationFrequency', 'pestControlType', 'irrigationType', 'dryingMethod'].forEach((key) => {
      if (!payload[key]) delete payload[key]
    })
    const res = await api.post(`/api/batches/${batchId}/variables`, payload)
    await refresh()
    return res.data.variables
  }

  const requestPrediction = async (batchId) => {
    const res = await api.post(`/api/batches/${batchId}/prediction`)
    await refresh()
    return res.data
  }

  // ── Coffee Evaluation ──────────────────────────────────────────────────────
  const fetchEvaluation = async (batchId) => {
    const res = await api.get(`/api/batches/${batchId}/evaluation`)
    return res.data.evaluation
  }

  const saveEvaluation = async (batchId, data) => {
    // Convert all score fields to numbers, remove empty ones
    const payload = {}
    const scoreFields = [
      'fragranceScore', 'flavorScore', 'aftertasteScore', 'acidityScore',
      'bodyScore', 'balanceScore', 'uniformityScore', 'cleanCupScore',
      'sweetnessScore', 'overallScore',
    ]
    scoreFields.forEach((k) => {
      if (data[k] !== '' && data[k] != null) payload[k] = Number(data[k])
    })
    if (data.defects !== '' && data.defects != null) payload.defects = Number(data.defects)
    if (data.evaluatorName) payload.evaluatorName = data.evaluatorName
    if (data.evaluationDate) payload.evaluationDate = data.evaluationDate
    if (data.notes) payload.notes = data.notes

    const res = await api.post(`/api/batches/${batchId}/evaluation`, payload)
    return res.data.evaluation
  }

  const deleteEvaluation = async (batchId) => {
    await api.del(`/api/batches/${batchId}/evaluation`)
  }

  const adminStats = useMemo(() => {
    const done = allBatches.filter((b) => b.prediction?.status === 'DONE')
    return {
      totalProducers: allUsers.length,
      totalFarms: allFarms.length,
      totalBatches: allBatches.length,
      totalPredictions: done.length,
      specialtyPercentage: allBatches.length
        ? Math.round((allBatches.filter((b) => b.prediction?.qualityCategory === 'SPECIALTY').length / allBatches.length) * 100)
        : 0,
      avgScoreGlobal: done.length
        ? (done.reduce((acc, b) => acc + (b.prediction.predictedScore || 0), 0) / done.length).toFixed(1)
        : 0,
    }
  }, [allUsers, allFarms, allBatches])

  return (
    <DataContext.Provider
      value={{
        loading,
        error,
        refresh,
        farms,
        batches,
        addFarm,
        updateFarm,
        deleteFarm,
        getFarmById,
        addBatch,
        getBatchById,
        getBatchesByFarm,
        fetchBatch,
        saveVariables,
        requestPrediction,
        fetchEvaluation,
        saveEvaluation,
        deleteEvaluation,
        allFarms,
        allBatches,
        allUsers,
        adminStats,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
