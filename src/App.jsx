import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Simulador from './pages/Simulador'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/simulador" element={<Simulador />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App