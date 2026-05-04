import { Routes, Route, Navigate } from 'react-router-dom'
import { Component } from 'react'
import { AuthProvider, useAuth } from './lib/AuthContext'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Enquiries from './pages/Enquiries'
import Pipeline from './pages/Pipeline'
import Properties from './pages/Properties'
import Clients from './pages/Clients'
import Team from './pages/Team'
import Reports from './pages/Reports'

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null } }
  static getDerivedStateFromError(error) { return { hasError: true, error } }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white rounded-2xl shadow p-8 max-w-lg w-full border border-red-100">
          <h2 className="text-lg font-bold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-gray-600 text-sm mb-4">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Reload</button>
        </div>
      </div>
    )
    return this.props.children
  }
}

function AppContent() {
  const { user, profile, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  )

  if (!user) return <Login />

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-60 p-6 min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/enquiries" element={<Enquiries />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/clients" element={profile?.role === 'Director' || profile?.role === 'Secretary' ? <Clients /> : <Navigate to="/" />} />
          <Route path="/team" element={<Team />} />
          <Route path="/reports" element={profile?.role === 'Director' ? <Reports /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}
