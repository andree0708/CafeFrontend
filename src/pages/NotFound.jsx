import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center text-center p-8">
      <div>
        <p className="page-kicker">Error</p>
        <h1 className="page-title mt-2">Página no encontrada</h1>
        <Link to="/login" className="btn-primary mt-8">Volver</Link>
      </div>
    </div>
  )
}
