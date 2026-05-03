import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Enquiries from './pages/Enquiries'
import Pipeline from './pages/Pipeline'
import Properties from './pages/Properties'
import Clients from './pages/Clients'
import Team from './pages/Team'
import Reports from './pages/Reports'

export default function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-60 p-6 min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/enquiries" element={<Enquiries />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/team" element={<Team />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  )
}
