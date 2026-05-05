import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, GitBranch, Building2, Users, UserSquare2, BarChart3, Home, LogOut, Archive } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'

export default function Sidebar() {
  const { profile, signOut } = useAuth()
  const nav = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['Director','Marketer','Secretary'] },
    { to: '/enquiries', icon: ClipboardList, label: 'Enquiries', roles: ['Director','Marketer','Secretary'] },
    { to: '/pipeline', icon: GitBranch, label: 'Pipeline', roles: ['Director','Marketer'] },
    { to: '/properties', icon: Building2, label: 'Properties', roles: ['Director','Marketer','Secretary'] },
    { to: '/clients', icon: Users, label: 'Clients', roles: ['Director','Secretary'] },
    { to: '/team', icon: UserSquare2, label: 'Team', roles: ['Director','Marketer','Secretary'] },
    { to: '/reports', icon: BarChart3, label: 'Reports', roles: ['Director'] },
    { to: '/archive', icon: Archive, label: 'Archive', roles: ['Director','Secretary'] },
  ].filter(item => !profile || item.roles.includes(profile.role))

  return (
    <aside className="w-60 min-h-screen bg-primary-900 flex flex-col fixed left-0 top-0 z-30">
      <div className="px-5 py-6 border-b border-primary-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
            <Home size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Ace Realtors</p>
            <p className="text-primary-400 text-xs">Nairobi, Kenya</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-600 text-white' : 'text-primary-300 hover:bg-primary-800 hover:text-white'}`}>
            <Icon size={17}/>{label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-primary-800">
        {profile && (
          <div className="mb-3 px-1">
            <p className="text-white text-sm font-medium">{profile.name}</p>
            <p className="text-primary-400 text-xs">{profile.role}</p>
          </div>
        )}
        <button onClick={signOut} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-primary-300 hover:bg-primary-800 hover:text-white transition-colors text-sm">
          <LogOut size={16}/> Sign out
        </button>
        <p className="text-primary-600 text-xs mt-3 px-1">© 2026 Ace Realtors Ltd</p>
      </div>
    </aside>
  )
}
