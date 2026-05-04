import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Auth } from './components/pages/Auth'
import { SpreadsheetView } from './components/pages/SpreadsheetView'
import { Dashboard } from './components/pages/Dashboard'
import { AppLayout } from './components/templates/AppLayout'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={
          <AppLayout>
            <SpreadsheetView />
          </AppLayout>
        } />
        <Route path="/dashboard" element={
          <AppLayout>
            <Dashboard />
          </AppLayout>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
