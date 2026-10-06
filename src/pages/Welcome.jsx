import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Coffee, Leaf, Package, BarChart2,
  TrendingUp, ShieldCheck, ArrowRight, Star,
} from 'lucide-react'

const features = [
  {
    icon: Leaf,
    color: 'bg-green-50 text-green-600',
    title: 'Gestión de fincas',
    description:
      'Registra y administra todas tus fincas cafeteras con información detallada: ubicación, altitud, hectáreas y más.',
  },
  {
    icon: Package,
    color: 'bg-coffee-50 text-coffee-600',
    title: 'Control de lotes',
    description:
      'Lleva el seguimiento de cada lote de café: variedad, método de proceso, fecha de cosecha y peso total.',
  },
  {
    icon: BarChart2,
    color: 'bg-blue-50 text-blue-600',
    title: 'Análisis con IA',
    description:
      'Nuestro modelo de Machine Learning analiza las variables de producción y predice la calidad de tu café en la escala SCA.',
  },
  {
    icon: TrendingUp,
    color: 'bg-emerald-50 text-emerald-600',
    title: 'Recomendaciones inteligentes',
    description:
      'Recibe recomendaciones personalizadas para mejorar la calidad y apoyar la comercialización de tus lotes.',
  },
  {
    icon: Star,
    color: 'bg-yellow-50 text-yellow-600',
    title: 'Categorización de calidad',
    description:
      'Clasifica tus lotes en Especialidad, Premium, Comercial o Bajo Grado para tomar mejores decisiones de venta.',
  },
  {
    icon: ShieldCheck,
    color: 'bg-purple-50 text-purple-600',
    title: 'Trazabilidad completa',
    description:
      'Mantén un historial detallado de cada lote, desde la siembra hasta el resultado del análisis de calidad.',
  },
]

const steps = [
  { number: '01', title: 'Registra tu finca', desc: 'Agrega la información de tu finca cafetera: nombre, ubicación, altitud y área.' },
  { number: '02', title: 'Crea un lote', desc: 'Registra los lotes de café cosechados indicando variedad y método de proceso.' },
  { number: '03', title: 'Ingresa variables', desc: 'Completa las variables de producción: clima, suelo y condiciones de poscosecha.' },
  { number: '04', title: 'Obtén tu predicción', desc: 'La IA analiza tus datos y entrega un puntaje de calidad con recomendaciones.' },
]

export default function Welcome() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleStart = () => {
    navigate(user?.role === 'ADMIN' ? '/admin' : '/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-coffee-950 via-coffee-800 to-coffee-600 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur rounded-3xl mb-6">
            <Coffee size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black mb-4">Bienvenido a CaféIA</h1>
          <p className="text-coffee-200 text-lg max-w-2xl mx-auto mb-2">
            Sistema Inteligente para Predicción de Calidad y Apoyo a la Comercialización de Café
          </p>
          <p className="text-coffee-300 text-sm max-w-xl mx-auto mb-8">
            Hola, <span className="font-semibold text-white">{user?.name}</span>. 
            Usa la inteligencia artificial para conocer la calidad de tus lotes y tomar mejores decisiones de negocio.
          </p>
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 bg-white text-coffee-800 font-semibold px-8 py-3 rounded-xl hover:bg-coffee-50 transition-colors text-sm"
          >
            Ir al panel principal <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">¿Qué puedes hacer con CaféIA?</h2>
          <p className="text-gray-500 mt-2">Todo lo que necesitas para gestionar y mejorar la calidad de tu café</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className={`inline-flex p-2.5 rounded-xl mb-3 ${f.color}`}>
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">¿Cómo funciona?</h2>
            <p className="text-gray-500 mt-2">Cuatro pasos para obtener la predicción de calidad de tu café</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-3/4 w-1/2 h-0.5 bg-coffee-100" />
                )}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-coffee-600 text-white font-black text-lg mb-3">
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 py-10 text-center">
        <button
          onClick={handleStart}
          className="btn-primary px-10 py-3 text-base inline-flex items-center gap-2"
        >
          Comenzar ahora <ArrowRight size={17} />
        </button>
      </div>
    </div>
  )
}
