import { mockFarms } from '../../data/mockData'
import { Leaf, MapPin, Mountain, Package } from 'lucide-react'

export default function AdminFarms() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Fincas</h1>
        <p className="text-slate-500 mt-1 text-sm">Todas las fincas registradas en el sistema</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Finca', 'Municipio / Depto', 'Altitud', 'Hectáreas', 'Lotes'].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockFarms.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-green-50 rounded-lg"><Leaf size={14} className="text-green-600" /></div>
                    <span className="font-medium text-slate-900 text-sm">{f.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin size={12} />{f.municipality}, {f.department}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Mountain size={12} />{f.altitude} msnm</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-900 font-medium">{f.hectares} ha</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                    <Package size={13} className="text-blue-400" />{f.batchCount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
