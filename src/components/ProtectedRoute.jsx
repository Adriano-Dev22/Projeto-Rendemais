import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0B1426', fontFamily: 'DM Sans, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)',
            borderTop: '3px solid #1E6FD9', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return children
}