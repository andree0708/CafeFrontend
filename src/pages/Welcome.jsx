import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const steps = [
  { n: '01', title: 'Finca', body: 'Nombre, vereda, altitud y área.' },
  { n: '02', title: 'Lote', body: 'Código, cosecha, variedad y proceso.' },
  { n: '03', title: 'Variables', body: 'Clima, suelo y poscosecha.' },
  { n: '04', title: 'Predicción', body: 'Puntaje SCA, categoría y recomendaciones.' },
]

export default function Welcome() {
  const navigate = useNavigate()
  const { displayName } = useAuth()
  const first = displayName?.split(' ')[0] || 'productor'

  return (
    <div className="space-y-12">
      <header className="max-w-2xl">
        <p className="page-kicker">Bienvenida</p>
        <h1 className="page-title mt-3">Hola, {first}.</h1>
        <p className="text-stone-600 mt-4 leading-relaxed">
          CaféIA estima la calidad de un lote a partir de datos de producción. El modelo no es un chatbot: es un
          Random Forest entrenado para puntuar en escala SCA y clasificar el café.
        </p>
        <button onClick={() => navigate('/farms')} className="btn-primary mt-8">Registrar primera finca</button>
      </header>

      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s) => (
          <li key={s.n} className="card">
            <p className="page-kicker">{s.n}</p>
            <p className="font-display text-xl mt-3">{s.title}</p>
            <p className="text-sm text-stone-500 mt-2">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
