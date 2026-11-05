import { useState } from 'react'
import { useData } from '../../context/DataContext'
import EmptyState from '../../components/ui/EmptyState'
import { Users } from 'lucide-react'

export default function AdminProducers() {
  const { allUsers, loading } = useData()
  const [search, setSearch] = useState('')
  const filtered = allUsers.filter((p) =>
    `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div>
        <p className="page-kicker">Directorio</p>
        <h1 className="page-title mt-2">Productores</h1>
      </div>
      <input className="input-field max-w-sm" placeholder="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} />
      {loading ? <p className="text-stone-500">Cargando…</p> : filtered.length === 0 ? (
        <EmptyState icon={Users} title="Sin productores" body="Las cuentas nuevas aparecerán aquí." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <article key={p.id} className="card">
              <p className="font-display text-xl">{p.firstName} {p.lastName}</p>
              <p className="text-sm text-stone-500 mt-1">{p.email}</p>
              <p className="text-sm text-stone-500 mt-4">{p.farms} fincas · {p.batches} lotes</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
