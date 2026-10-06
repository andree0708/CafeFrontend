import { mockAdminStats, mockAllProducers, mockBatches } from '../../data/mockData'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import { Users, Leaf, Package, BarChart2, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
        <p className="text-gray-500 mt-1">Visión global del sistema de calidad cafetera.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Productores" value={mockAdminStats.totalProducers} icon={Users} color="blue" />
        <StatCard title="Fincas registradas" value={mockAdminStats.totalFarms} icon={Leaf} color="green" />
        <StatCard title="Lotes totales" value={mockAdminStats.totalBatches} icon={Package} color="coffee" />
        <StatCard title="Predicciones realizadas" value={mockAdminStats.totalPredictions} icon={BarChart2} color="yellow" />
        <StatCard
          title="Lotes especialidad"
          value={`${mockAdminStats.specialtyPercentage}%`}
          subtitle="Del total de lotes analizados"
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Puntaje promedio global"
          value={mockAdminStats.avgScoreGlobal}
          subtitle="Escala SCA 0–100"
          icon={BarChart2}
          color="coffee"
        />
      </div>

      {/* Producers table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Productores registrados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Productor</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Correo</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Fincas</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Lotes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockAllProducers.map((producer) => (
                <tr key={producer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-coffee-100 flex items-center justify-center">
                        <span className="text-coffee-700 text-sm font-semibold">
                          {producer.firstName[0]}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900 text-sm">
                        {producer.firstName} {producer.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{producer.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{producer.farms}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{producer.batches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent predictions */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Últimas predicciones</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Lote</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Finca</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Puntaje</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Categoría</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Confianza</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockBatches.filter((b) => b.prediction.status === 'DONE').map((batch) => (
                <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-sm text-gray-900">{batch.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{batch.farmName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{batch.prediction.predictedScore} pts</td>
                  <td className="px-6 py-4"><Badge category={batch.prediction.qualityCategory} /></td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {Math.round(batch.prediction.confidenceLevel * 100)}%
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
