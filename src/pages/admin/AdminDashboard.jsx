import { Link } from 'react-router-dom'
import { mockAdminStats, mockAllProducers, mockBatches } from '../../data/mockData'
import Badge from '../../components/ui/Badge'
import {
  Users, Leaf, Package, BarChart2, TrendingUp,
  ShieldCheck, ArrowRight, CheckCircle,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

const qualityData = [
  { name: 'Especialidad', value: 9, color: '#10b981' },
  { name: 'Premium', value: 6, color: '#3b82f6' },
  { name: 'Comercial', value: 4, color: '#f59e0b' },
  { name: 'Bajo grado', value: 2, color: '#f87171' },
]

const monthlyData = [
  { month: 'Ene', lotes: 2, predicciones: 2 },
  { month: 'Feb', lotes: 3, predicciones: 3 },
  { month: 'Mar', lotes: 4, predicciones: 3 },
  { month: 'Abr', lotes: 5, predicciones: 5 },
  { month: 'May', lotes: 3, predicciones: 3 },
  { month: 'Jun', lotes: 6, predicciones: 5 },
]

const AdminStatCard = ({ title, value, subtitle, icon: Icon, color }) => {
  const colors = {
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   val: 'text-blue-700' },
    green:  { bg: 'bg-emerald-50', text: 'text-emerald-600', val: 'text-emerald-700' },
    slate:  { bg: 'bg-slate-100', text: 'text-slate-600',  val: 'text-slate-800' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', val: 'text-yellow-700' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', val: 'text-purple-700' },
  }
  const c = colors[color] || colors.blue
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${c.bg}`}>
        <Icon size={22} className={c.text} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className={`text-2xl font-bold ${c.val}`}>{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={20} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Panel Administrativo</h1>
          </div>
          <p className="text-slate-500 text-sm">Visión global del sistema de calidad cafetera</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-medium text-blue-700">Sistema activo</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminStatCard title="Productores" value={mockAdminStats.totalProducers} icon={Users} color="blue"
          subtitle="Cuentas registradas" />
        <AdminStatCard title="Fincas" value={mockAdminStats.totalFarms} icon={Leaf} color="green"
          subtitle="En todo el sistema" />
        <AdminStatCard title="Lotes totales" value={mockAdminStats.totalBatches} icon={Package} color="slate"
          subtitle="Registrados" />
        <AdminStatCard title="Predicciones IA" value={mockAdminStats.totalPredictions} icon={BarChart2} color="purple"
          subtitle="Análisis realizados" />
        <AdminStatCard title="% Especialidad" value={`${mockAdminStats.specialtyPercentage}%`} icon={TrendingUp} color="green"
          subtitle="Del total analizado" />
        <AdminStatCard title="Puntaje promedio" value={mockAdminStats.avgScoreGlobal} icon={CheckCircle} color="yellow"
          subtitle="Escala SCA 0–100" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Bar chart */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 lg:col-span-3">
          <h2 className="font-semibold text-slate-900 mb-1">Actividad mensual</h2>
          <p className="text-xs text-slate-400 mb-4">Lotes registrados vs predicciones realizadas</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Bar dataKey="lotes" name="Lotes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="predicciones" name="Predicciones" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 lg:col-span-2">
          <h2 className="font-semibold text-slate-900 mb-1">Distribución de calidad</h2>
          <p className="text-xs text-slate-400 mb-2">Por categoría SCA</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={qualityData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                dataKey="value" paddingAngle={3}>
                {qualityData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8}
                formatter={(v) => <span style={{ fontSize: 11, color: '#64748b' }}>{v}</span>} />
              <Tooltip formatter={(v) => [`${v} lotes`]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Producers table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Productores registrados</h2>
          <Link to="/admin/producers" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
            Ver todos <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Productor', 'Correo', 'Fincas', 'Lotes', 'Estado'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockAllProducers.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-blue-700 text-xs font-bold">{p.firstName[0]}</span>
                      </div>
                      <span className="font-medium text-slate-900 text-sm">{p.firstName} {p.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{p.email}</td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-slate-900">{p.farms}</td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-slate-900">{p.batches}</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Activo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent predictions */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Últimas predicciones</h2>
          <Link to="/admin/predictions" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
            Ver todas <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Lote', 'Finca', 'Puntaje', 'Categoría', 'Confianza'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockBatches.filter((b) => b.prediction.status === 'DONE').map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-sm text-slate-900">{b.code}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{b.farmName}</td>
                  <td className="px-6 py-3.5">
                    <span className="text-sm font-bold text-slate-900">{b.prediction.predictedScore}</span>
                    <span className="text-xs text-slate-400 ml-1">pts</span>
                  </td>
                  <td className="px-6 py-3.5"><Badge category={b.prediction.qualityCategory} /></td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-20 h-1.5 bg-slate-100 rounded-full">
                        <div className="h-1.5 bg-blue-500 rounded-full"
                          style={{ width: `${b.prediction.confidenceLevel * 100}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{Math.round(b.prediction.confidenceLevel * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
