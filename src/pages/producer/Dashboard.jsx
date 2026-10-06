import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { Leaf, Package, Star, Clock, ArrowRight, TrendingUp, Coffee } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { mockChartData } from '../../data/mockData'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length && payload[0].value) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg shadow-lg px-3 py-2 text-xs">
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="text-coffee-600 font-bold">{payload[0].value} pts</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { user } = useAuth()
  const { farms, batches } = useData()

  const doneBatches = batches.filter((b) => b.prediction?.status === 'DONE')
  const specialtyBatches = batches.filter((b) => b.prediction?.qualityCategory === 'SPECIALTY')
  const pendingBatches = batches.filter((b) => b.prediction?.status === 'PENDING')
  const avgScore = doneBatches.length
    ? (doneBatches.reduce((acc, b) => acc + b.prediction.predictedScore, 0) / doneBatches.length).toFixed(1)
    : '—'

  const recentBatches = [...batches].slice(0, 4)

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hola, {user?.producer?.firstName || user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Resumen de tu actividad cafetera
          </p>
        </div>
        <Link
          to="/farms"
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Leaf size={15} /> Nueva finca
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Mis fincas" value={farms.length} icon={Leaf} color="green"
          subtitle={farms.length === 0 ? 'Registra tu primera' : 'Activas'} />
        <StatCard title="Lotes totales" value={batches.length} icon={Package} color="coffee"
          subtitle="Esta temporada" />
        <StatCard title="Especialidad" value={specialtyBatches.length} icon={Star} color="yellow"
          subtitle="Score ≥ 85 pts" />
        <StatCard title="Pendientes" value={pendingBatches.length} icon={Clock} color="blue"
          subtitle="Sin análisis" />
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Area chart */}
        <div className="card lg:col-span-3">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="font-semibold text-gray-900">Evolución de calidad</h2>
              <p className="text-xs text-gray-400 mt-0.5">Puntaje promedio mensual — escala SCA</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-coffee-600">{avgScore}</p>
              <p className="text-xs text-gray-400">promedio</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={mockChartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b86516" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#b86516" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={85} stroke="#10b981" strokeDasharray="4 4"
                label={{ value: 'Especialidad', fontSize: 9, fill: '#10b981', position: 'right' }} />
              <Area type="monotone" dataKey="score" stroke="#b86516" strokeWidth={2.5}
                fill="url(#scoreGrad)" dot={{ fill: '#b86516', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#964d15' }} connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent batches */}
        <div className="card lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Últimos lotes</h2>
            <Link to="/batches" className="text-xs text-coffee-600 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          {recentBatches.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
              <Coffee size={28} className="text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">Sin lotes aún</p>
              <Link to="/farms" className="text-xs text-coffee-600 hover:underline mt-1">
                Registrar primer lote
              </Link>
            </div>
          ) : (
            <div className="space-y-1 flex-1">
              {recentBatches.map((batch) => (
                <Link
                  key={batch.id}
                  to={`/batches/${batch.id}`}
                  className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-coffee-700">
                      {batch.code}
                    </p>
                    <p className="text-xs text-gray-400">{batch.farmName}</p>
                  </div>
                  <div className="text-right">
                    {batch.prediction?.status === 'DONE' ? (
                      <>
                        <p className="text-sm font-bold text-gray-900">{batch.prediction.predictedScore} pts</p>
                        <Badge category={batch.prediction.qualityCategory} />
                      </>
                    ) : (
                      <Badge category="PENDING" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quality distribution */}
      {doneBatches.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={17} className="text-coffee-500" />
            <h2 className="font-semibold text-gray-900">Distribución de calidad</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['SPECIALTY', 'PREMIUM', 'COMMERCIAL', 'LOW_GRADE'].map((cat) => {
              const count = batches.filter((b) => b.prediction?.qualityCategory === cat).length
              const pct = batches.length > 0 ? Math.round((count / batches.length) * 100) : 0
              const colors = {
                SPECIALTY: 'bg-emerald-500', PREMIUM: 'bg-blue-500',
                COMMERCIAL: 'bg-yellow-500', LOW_GRADE: 'bg-red-400',
              }
              const labels = {
                SPECIALTY: 'Especialidad', PREMIUM: 'Premium',
                COMMERCIAL: 'Comercial', LOW_GRADE: 'Bajo grado',
              }
              return (
                <div key={cat} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-2xl font-black text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{labels[cat]}</p>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full">
                    <div className={`h-1.5 rounded-full ${colors[cat]}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{pct}%</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state for new users */}
      {farms.length === 0 && (
        <div className="card border-2 border-dashed border-coffee-200 bg-coffee-50/40 text-center py-10">
          <Coffee size={36} className="mx-auto text-coffee-300 mb-3" />
          <p className="font-semibold text-coffee-800">¡Empieza registrando tu primera finca!</p>
          <p className="text-sm text-coffee-600 mt-1 mb-4">
            Agrega tus fincas, lotes y obtén predicciones de calidad con IA.
          </p>
          <Link to="/farms" className="btn-primary text-sm">
            + Registrar primera finca
          </Link>
        </div>
      )}
    </div>
  )
}
