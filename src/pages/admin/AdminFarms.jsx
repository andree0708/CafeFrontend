import { useData } from '../../context/DataContext'
import { Leaf, MapPin, Mountain, Package, User } from 'lucide-react'

export default function AdminFarms() {
  const { allFarms, allBatches } = useData()

  // Count real batches per farm
  const farmsWithCounts = allFarms.map((f) => ({
    ...f,
    realBatchCount: allBatches.filter((b) => b.farmId === f.id).length,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Fincas</h1>
        <p className="text-slate-500 mt-1 text-sm">{allFarms.length} fincas registradas en el sistema</p>
      </div>

      {allFarms.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 text-center py-12">
          <Leaf size={36} className="mx-auto text-slate-200 mb-2" />
          <p className="text-slate-400 text-sm">No hay fincas registradas aún</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Finca', 'Propietario', 'Municipio / Depto', 'Altitud', 'Hectáreas', 'Lotes'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {farmsWithCounts.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-green-50 rounded-lg"><Leaf size={14} className="text-green-600" /></div>
                      <span className="font-medium text-slate-900 text-sm">{f.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <User size={12} /> {f.ownerName || 'Carlos Productor'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {f.municipality && f.department
                      ? <span className="flex items-center gap-1"><MapPin size={12} />{f.municipality}, {f.department}</span>
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {f.altitude
                      ? <span className="flex items-center gap-1"><Mountain size={12} />{f.altitude} msnm</span>
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                    {f.hectares ? `${f.hectares} ha` : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                      <Package size={13} className="text-blue-400" />{f.realBatchCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
