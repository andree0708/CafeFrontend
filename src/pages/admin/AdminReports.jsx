import { useData } from '../../context/DataContext'
import { labelProcess, labelVariety, CATEGORY_LABELS } from '../../lib/labels'

function downloadCsv(filename, rows) {
  const csv = rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminReports() {
  const { allUsers, allFarms, allBatches } = useData()

  const reports = [
    {
      title: 'Productores',
      desc: 'Cuentas, fincas y lotes.',
      run: () => downloadCsv('productores.csv', [
        ['Nombre', 'Correo', 'Fincas', 'Lotes'],
        ...allUsers.map((p) => [`${p.firstName} ${p.lastName}`, p.email, p.farms, p.batches]),
      ]),
    },
    {
      title: 'Fincas',
      desc: 'Ubicación y productor.',
      run: () => downloadCsv('fincas.csv', [
        ['Nombre', 'Productor', 'Ubicación', 'Municipio', 'Departamento', 'Altitud', 'Hectáreas'],
        ...allFarms.map((f) => [f.name, f.ownerName, f.location, f.municipality, f.department, f.altitude, f.hectares]),
      ]),
    },
    {
      title: 'Lotes y predicciones',
      desc: 'Puntaje SCA y categoría.',
      run: () => downloadCsv('lotes.csv', [
        ['Código', 'Finca', 'Variedad', 'Proceso', 'Puntaje', 'Categoría', 'Confianza'],
        ...allBatches.map((b) => [
          b.code, b.farmName, labelVariety(b.variety), labelProcess(b.processingMethod),
          b.prediction?.predictedScore ?? '', CATEGORY_LABELS[b.prediction?.qualityCategory] || 'Pendiente',
          b.prediction?.confidenceLevel ?? '',
        ]),
      ]),
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="page-kicker">Exportación</p>
        <h1 className="page-title mt-2">Reportes</h1>
        <p className="text-stone-500 text-sm mt-2">CSV con los datos actuales de la base.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {reports.map((r) => (
          <article key={r.title} className="card flex flex-col">
            <h2 className="font-display text-xl">{r.title}</h2>
            <p className="text-sm text-stone-500 mt-2 flex-1">{r.desc}</p>
            <button className="btn-primary mt-6" onClick={r.run}>Descargar CSV</button>
          </article>
        ))}
      </div>
    </div>
  )
}
