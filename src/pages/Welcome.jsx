import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Coffee, Leaf, Package, BarChart2, TrendingUp, ShieldCheck, ArrowRight, Star, CheckCircle } from 'lucide-react'

const steps = [
  { n: '1', title: 'Registra tu finca', body: 'Agrega nombre, ubicación, altitud y área de tu finca cafetera.' },
  { n: '2', title: 'Crea un lote', body: 'Registra los lotes cosechados con variedad y método de proceso.' },
  { n: '3', title: 'Ingresa variables', body: 'Completa clima, suelo y condiciones de poscosecha del lote.' },
  { n: '4', title: 'Obtén tu predicción', body: 'La IA analiza tus datos y entrega puntaje y recomendaciones.' },
]

const features = [
  { icon: Leaf, color: 'text-emerald-600 bg-emerald-50', title: 'Gestión de fincas', body: 'Registra y administra todas tus fincas con altitud, área y ubicación.' },
  { icon: Package, color: 'text-coffee-600 bg-coffee-50', title: 'Control de lotes', body: 'Lleva trazabilidad completa: variedad, proceso, fecha y peso.' },
  { icon: BarChart2, color: 'text-blue-600 bg-blue-50', title: 'Predicción IA', body: 'Modelo de Machine Learning que predice la calidad en escala SCA 0–100.' },
  { icon: TrendingUp, color: 'text-violet-600 bg-violet-50', title: 'Recomendaciones', body: 'Sugerencias personalizadas para mejorar calidad y comercialización.' },
  { icon: Star, color: 'text-amber-600 bg-amber-50', title: 'Categorización', body: 'Clasifica lotes como Especialidad, Premium, Comercial o Bajo grado.' },
  { icon: ShieldCheck, color: 'text-slate-600 bg-slate-50', title: 'Trazabilidad', body: 'Historial detallado desde la producción hasta el análisis final.' },
]

export default function Welcome() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 -m-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-coffee-950 via-coffee-900 to-coffee-700">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-coffee-200 text-sm mb-6">
            <CheckCircle size={13} /> Cuenta creada exitosamente
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            Hola, <span className="text-coffee-300">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-coffee-200 text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Bienvenido a <strong className="text-white">CaféIA</strong>, el sistema inteligente para predecir la calidad de tus lotes de café y apoyarte en la comercialización.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 bg-white text-coffee-800 font-semibold px-8 py-3 rounded-xl hover:bg-coffee-50 transition-colors"
          >
            Ir a mi panel <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-xl font-bold text-gray-900">¿Qué puedes hacer con CaféIA?</h2>
          <p className="text-gray-400 text-sm mt-1">Todo lo que necesitas para gestionar tu café</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className={`inline-flex p-2.5 rounded-xl mb-3 ${f.color}`}>
                <f.icon size={18} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-gray-900">¿Cómo funciona?</h2>
            <p className="text-gray-400 text-sm mt-1">Cuatro pasos para obtener tu predicción</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.n} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-5 left-[calc(50%+20px)] right-0 h-px bg-gray-100" />
                )}
                <div className="w-10 h-10 rounded-full bg-coffee-600 text-white font-black text-base flex items-center justify-center mx-auto mb-3">
                  {s.n}
                </div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{s.title}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-10 text-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary px-8 py-3 inline-flex items-center gap-2"
        >
          Empezar ahora <ArrowRight size={16} />
        </button>
        <p className="text-gray-400 text-xs mt-3">
          Puedes volver a esta pantalla desde el menú de configuración
        </p>
      </div>
    </div>
  )
}
