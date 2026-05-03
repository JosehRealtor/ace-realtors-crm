import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, GitBranch, Building2, Users, UserSquare2, BarChart3, Home } from 'lucide-react'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/enquiries', icon: ClipboardList, label: 'Enquiries' },
  { to: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  { to: '/properties', icon: Building2, label: 'Properties' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/team', icon: UserSquare2, label: 'Team' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
]

export default function Sidebar() {
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
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-300 hover:bg-primary-800 hover:text-white'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-primary-800">
        <p className="text-primary-500 text-xs">© 2026 Ace Realtors Ltd</p>
      </div>
    </aside>
  )
}
