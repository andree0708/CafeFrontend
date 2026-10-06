import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { mockStats, mockBatches, mockChartData } from '../../data/mockData'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import { Leaf, Package, Star, Clock, ArrowRight } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'

export default function Dashboard() {
  const { user } = useAuth()
  const recentBatches = mockBatches.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {user?.producer?.firstName || user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Aquí tienes un resumen de tu actividad cafetera.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de fincas"
          value={mockStats.totalFarms}
          subtitle="Registradas en el sistema"
          icon={Leaf}
          color="green"
        />
        <StatCard
          title="Total de lotes"
          value={mockStats.totalBatches}
          subtitle="Esta temporada"
          icon={Package}
          color="coffee"
        />
        <StatCard
          title="Lotes especialidad"
          value={mockStats.specialtyBatches}
          subtitle="Score ≥ 85 puntos"
          icon={Star}
          color="yellow"
        />
        <StatCard
          title="Predicciones pendientes"
          value={mockStats.pendingPredictions}
          subtitle="En espera de análisis"
          icon={Clock}
          color="blue"
        />
      </div>

      {/* Chart + Recent Batches */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Score chart */}
        <div className="card lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Evolución de calidad</h2>
              <p className="text-sm text-gray-500">Puntaje promedio por mes</p>
            </div>
            <span className="text-2xl font-bold text-coffee-600">{mockStats.avgScore}</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                formatter={(v) => [`${v} pts`, 'Puntaje']}
              />
              <ReferenceLine y={85} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Especialidad', fontSize: 10, fill: '#10b981' }} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#b86516"
                strokeWidth={2.5}
                dot={{ fill: '#b86516', r: 4 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent batches */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Últimos lotes</h2>
            <Link to="/batches" className="text-sm text-coffee-600 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentBatches.map((batch) => (
              <div key={batch.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{batch.code}</p>
                  <p className="text-xs text-gray-400">{batch.farmName}</p>
                </div>
                <div className="text-right">
                  {batch.prediction.status === 'DONE' ? (
                    <>
                      <p className="text-sm font-bold text-gray-900">{batch.prediction.predictedScore} pts</p>
                      <Badge category={batch.prediction.qualityCategory} />
                    </>
                  ) : (
                    <Badge category="PENDING" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/farms" className="btn-primary text-sm">
            + Registrar finca
          </Link>
          <Link to="/batches/new" className="btn-secondary text-sm">
            + Registrar lote
          </Link>
          <Link to="/predictions" className="btn-secondary text-sm">
            Ver predicciones
          </Link>
        </div>
      </div>
    </div>
  )
}
