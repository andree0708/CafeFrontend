import { Link } from 'react-router-dom'
import { Coffee } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Coffee size={48} className="mx-auto text-coffee-300 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 mb-6">Esta página no existe</p>
        <Link to="/dashboard" className="btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
