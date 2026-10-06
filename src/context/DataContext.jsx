import { createContext, useContext, useState } from 'react'
import { mockFarms, mockBatches } from '../data/mockData'

const DataContext = createContext(null)

/**
 * Provides per-user data isolation.
 * Demo users (id 1 and 2) get mock data; new registrations start empty.
 */
export function DataProvider({ children, user }) {
  const isDemoUser = user?.id === 1 || user?.id === 2

  const [farms, setFarms] = useState(isDemoUser ? mockFarms : [])
  const [batches, setBatches] = useState(isDemoUser ? mockBatches : [])

  // ── Farms ──────────────────────────────────────────────────────────────────
  const addFarm = (data) => {
    const farm = {
      ...data,
      id: Date.now(),
      batchCount: 0,
      hectares: data.hectares ? Number(data.hectares) : null,
      altitude: data.altitude ? Number(data.altitude) : null,
    }
    setFarms((prev) => [...prev, farm])
    return farm
  }

  const updateFarm = (id, data) => {
    setFarms((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, ...data, hectares: data.hectares ? Number(data.hectares) : f.hectares, altitude: data.altitude ? Number(data.altitude) : f.altitude }
          : f
      )
    )
  }

  const deleteFarm = (id) => {
    setFarms((prev) => prev.filter((f) => f.id !== id))
    setBatches((prev) => prev.filter((b) => b.farmId !== id))
  }

  const getFarmById = (id) => farms.find((f) => f.id === Number(id))

  // ── Batches ────────────────────────────────────────────────────────────────
  const addBatch = (data) => {
    const batch = {
      ...data,
      id: Date.now(),
      weight: data.weight ? Number(data.weight) : null,
      prediction: { status: 'PENDING', predictedScore: null, qualityCategory: null, confidenceLevel: null },
    }
    setBatches((prev) => [...prev, batch])
    setFarms((prev) =>
      prev.map((f) => (f.id === Number(data.farmId) ? { ...f, batchCount: f.batchCount + 1 } : f))
    )
    return batch
  }

  const getBatchById = (id) => batches.find((b) => b.id === Number(id))
  const getBatchesByFarm = (farmId) => batches.filter((b) => b.farmId === Number(farmId))

  return (
    <DataContext.Provider
      value={{
        farms, batches,
        addFarm, updateFarm, deleteFarm, getFarmById,
        addBatch, getBatchById, getBatchesByFarm,
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
