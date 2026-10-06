import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { Users, Search, Mail, Leaf, Package } from 'lucide-react'

export default function AdminProducers() {
  const { allUsers, allFarms, allBatches } = useData()
  const [search, setSearch] = useState('')

  const filtered = allUsers.filter(
    (p) =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  )

  // Calculate live farm/batch counts per user
  const enriched = filtered.map((p) => {
    const userFarms = allFarms.filter((f) => f.ownerId === p.id)
    const userBatches = allBatches.filter((b) =>
      userFarms.some((f) => f.id === b.farmId)
    )
    return {
      ...p,
      farms: p.farms !== undefined ? userFarms.length || p.farms : userFarms.length,
      batches: p.batches !== undefined ? userBatches.length || p.batches : userBatches.length,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Productores</h1>
          <p className="text-slate-500 mt-1 text-sm">{allUsers.length} productores registrados</p>
        </div>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {enriched.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 text-center py-12">
          <Users size={36} className="mx-auto text-slate-200 mb-2" />
          <p className="text-slate-400 text-sm">No se encontraron productores</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enriched.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-blue-700 font-bold">{p.firstName[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{p.firstName} {p.lastName}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <Mail size={11} /> {p.email}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Activo
                </span>
              </div>
              <div className="flex items-center gap-4 pt-3 border-t border-slate-50 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><Leaf size={13} className="text-green-500" />{p.farms} fincas</span>
                <span className="flex items-center gap-1.5"><Package size={13} className="text-blue-400" />{p.batches} lotes</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
