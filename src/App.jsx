import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import Landing from './pages/Landing'
import Simulador from './pages/Simulador'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Dashboard from "./pages/dashboard";
import ProtectedRoute from './components/ProtectedRoute'
import logoImg from "./assets/Logo.png";

function TitleManager() {
  const location = useLocation()
  useEffect(() => {
    const titles = {
      '/':          'Veskan — Rentabilidade real dos seus investimentos',
      '/simulador': 'Simulador — Veskan',
      '/login':     'Entrar — Veskan',
      '/cadastro':  'Criar conta — Veskan',
      '/dashboard': 'Dashboard — Veskan',
    }
    document.title = titles[location.pathname] || 'Veskan'

    let link = document.querySelector("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.getElementsByTagName('head')[0].appendChild(link)
    }
    link.href = logoImg
  }, [location])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TitleManager />
        <Routes>
          {/* Públicas */}
          <Route path="/"          element={<Landing />} />
          <Route path="/simulador" element={<Simulador />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/cadastro"  element={<Cadastro />} />

          {/* Protegidas */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App