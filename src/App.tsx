import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DarkModeProvider } from './context/DarkModeContext'
import Dashboard from './pages/Dashboard'
import BoothLayout from './pages/BoothLayout'
import BoothList from './pages/BoothList'
import Vendors from './pages/Vendors'
import Payments from './pages/Payments'
import Reservations from './pages/Reservations'
import Settings from './pages/Settings'

export default function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/layout" element={<BoothLayout />} />
          <Route path="/booths" element={<BoothList />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  )
}
