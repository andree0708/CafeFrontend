import { createContext, useContext, useState, useEffect } from 'react'
import { mockFarms, mockBatches, mockAllProducers } from '../data/mockData'

const DataContext = createContext(null)

// ── localStorage helpers ───────────────────────────────────────────────────
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const save = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* quota */ }
}

// ── Initial data setup ─────────────────────────────────────────────────────
// On first load, seed localStorage with demo data so it persists across sessions
const seedIfEmpty = () => {
  if (!localStorage.getItem('cafe_seeded')) {
    save('cafe_farms', mockFarms)
    save('cafe_batches', mockBatches)
    save('cafe_users', mockAllProducers)
    localStorage.setItem('cafe_seeded', 'true')
  }
}

seedIfEmpty()

export function DataProvider({ children, user }) {
  // ── Global shared state (persisted in localStorage) ──────────────────────
  const [allFarms, setAllFarms] = useState(() => load('cafe_farms', mockFarms))
  const [allBatches, setAllBatches] = useState(() => load('cafe_batches', mockBatches))
  const [allUsers, setAllUsers] = useState(() => load('cafe_users', mockAllProducers))

  // Persist on every change
  useEffect(() => { save('cafe_farms', allFarms) }, [allFarms])
  useEffect(() => { save('cafe_batches', allBatches) }, [allBatches])
  useEffect(() => { save('cafe_users', allUsers) }, [allUsers])

  // ── Per-user filtered view (for PRODUCER role) ────────────────────────────
  const isAdmin = user?.role === 'ADMIN'

  // Farms visible to current user
  const farms = isAdmin
    ? allFarms
    : allFarms.filter((f) => f.ownerId === user?.id || f.ownerId === undefined)

  // Batches visible to current user
  const batches = isAdmin
    ? allBatches
    : allBatches.filter((b) => {
        const farm = allFarms.find((f) => f.id === b.farmId)
        return farm?.ownerId === user?.id || farm?.ownerId === undefined
      })

  // ── Farms CRUD ─────────────────────────────────────────────────────────────
  const addFarm = (data) => {
    const farm = {
      ...data,
      id: Date.now(),
      batchCount: 0,
      ownerId: user?.id,
      ownerName: user?.name,
      hectares: data.hectares ? Number(data.hectares) : null,
      altitude: data.altitude ? Number(data.altitude) : null,
    }
    setAllFarms((prev) => [...prev, farm])
    return farm
  }

  const updateFarm = (id, data) => {
    setAllFarms((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f, ...data,
              hectares: data.hectares ? Number(data.hectares) : f.hectares,
              altitude: data.altitude ? Number(data.altitude) : f.altitude,
            }
          : f
      )
    )
  }

  const deleteFarm = (id) => {
    setAllFarms((prev) => prev.filter((f) => f.id !== id))
    setAllBatches((prev) => prev.filter((b) => b.farmId !== id))
  }

  const getFarmById = (id) => allFarms.find((f) => f.id === Number(id))

  // ── Batches CRUD ───────────────────────────────────────────────────────────
  const addBatch = (data) => {
    const batch = {
      ...data,
      id: Date.now(),
      weight: data.weight ? Number(data.weight) : null,
      prediction: { status: 'PENDING', predictedScore: null, qualityCategory: null, confidenceLevel: null },
    }
    setAllBatches((prev) => [...prev, batch])
    setAllFarms((prev) =>
      prev.map((f) => (f.id === Number(data.farmId) ? { ...f, batchCount: (f.batchCount || 0) + 1 } : f))
    )
    return batch
  }

  const getBatchById = (id) => allBatches.find((b) => b.id === Number(id))
  const getBatchesByFarm = (farmId) => allBatches.filter((b) => b.farmId === Number(farmId))

  // ── Users (admin view) ─────────────────────────────────────────────────────
  const registerUser = (userData) => {
    const existing = allUsers.find((u) => u.email === userData.email)
    if (existing) return

    const newUser = {
      id: userData.id || Date.now(),
      firstName: userData.firstName || userData.name?.split(' ')[0] || '',
      lastName: userData.lastName || userData.name?.split(' ')[1] || '',
      email: userData.email,
      farms: 0,
      batches: 0,
    }
    setAllUsers((prev) => [...prev, newUser])
  }

  // Stats for admin dashboard
  const adminStats = {
    totalProducers: allUsers.length,
    totalFarms: allFarms.length,
    totalBatches: allBatches.length,
    totalPredictions: allBatches.filter((b) => b.prediction?.status === 'DONE').length,
    specialtyPercentage: allBatches.length > 0
      ? Math.round(
          (allBatches.filter((b) => b.prediction?.qualityCategory === 'SPECIALTY').length /
            allBatches.length) * 100
        )
      : 0,
    avgScoreGlobal: (() => {
      const done = allBatches.filter((b) => b.prediction?.predictedScore)
      if (!done.length) return 0
      return (done.reduce((acc, b) => acc + b.prediction.predictedScore, 0) / done.length).toFixed(1)
    })(),
  }

  return (
    <DataContext.Provider
      value={{
        // Producer view (filtered)
        farms, batches,
        addFarm, updateFarm, deleteFarm, getFarmById,
        addBatch, getBatchById, getBatchesByFarm,
        // Admin view (global)
        allFarms, allBatches, allUsers,
        adminStats, registerUser,
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
