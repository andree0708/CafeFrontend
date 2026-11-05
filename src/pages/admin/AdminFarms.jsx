import { useData } from '../../context/DataContext'
import EmptyState from '../../components/ui/EmptyState'
import { Leaf } from 'lucide-react'

export default function AdminFarms() {
  const { allFarms, allBatches, loading } = useData()
  return (
    <div className="space-y-8">
      <div>
        <p className="page-kicker">Directorio</p>
        <h1 className="page-title mt-2">Fincas</h1>
      </div>
      {loading ? <p className="text-stone-500">Cargando…</p> : allFarms.length === 0 ? (
        <EmptyState icon={Leaf} title="Sin fincas" />
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-line">
                {['Finca', 'Productor', 'Ubicación', 'Altitud', 'Lotes'].map((h) => (
                  <th key={h} className="px-5 py-3 page-kicker font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {allFarms.map((f) => (
                <tr key={f.id}>
                  <td className="px-5 py-3 font-medium">{f.name}</td>
                  <td className="px-5 py-3 text-stone-600">{f.ownerName || '—'}</td>
                  <td className="px-5 py-3 text-stone-600">{[f.municipality, f.department].filter(Boolean).join(', ') || f.location}</td>
                  <td className="px-5 py-3">{f.altitude ? `${f.altitude} msnm` : '—'}</td>
                  <td className="px-5 py-3">{allBatches.filter((b) => b.farmId === f.id).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
