import { mockAdminStats } from '../../data/mockData'
import { FileText, Download, TrendingUp, BarChart2, Users, Package } from 'lucide-react'

const reports = [
  { icon: Users, title: 'Reporte de Productores', desc: 'Lista completa de productores con fincas y lotes registrados.', tag: 'CSV / PDF' },
  { icon: Package, title: 'Reporte de Lotes', desc: 'Detalle de todos los lotes con variables de producción y resultados.', tag: 'CSV / PDF' },
  { icon: BarChart2, title: 'Reporte de Predicciones', desc: 'Historial de predicciones con puntajes y categorías de calidad.', tag: 'CSV / PDF' },
  { icon: TrendingUp, title: 'Reporte de Calidad Global', desc: 'Análisis estadístico de la distribución de calidad del sistema.', tag: 'PDF' },
]

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reportes</h1>
        <p className="text-slate-500 mt-1 text-sm">Exporta información del sistema en diferentes formatos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
              <r.icon size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <p className="font-semibold text-slate-900">{r.title}</p>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{r.tag}</span>
              </div>
              <p className="text-sm text-slate-400 mt-1 mb-3">{r.desc}</p>
              <button className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline">
                <Download size={13} /> Descargar reporte
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={16} className="text-blue-600" />
          <p className="font-semibold text-blue-800">Nota</p>
        </div>
        <p className="text-sm text-blue-600">
          Los reportes se generarán con los datos reales del sistema una vez conectado al backend.
          En esta versión de prototipo, los botones están habilitados visualmente.
        </p>
      </div>
    </div>
  )
}
