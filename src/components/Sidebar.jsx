import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, GitBranch, Building2, Users, UserSquare2, BarChart3, Home, LogOut, Archive, Menu, X } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'

export default function Sidebar() {
  const { profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)

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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 border-b border-primary-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
              <Home size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">Ace Realtors</p>
              <p className="text-primary-400 text-xs">Nairobi, Kenya</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="md:hidden text-primary-300 hover:text-white">
            <X size={20}/>
          </button>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            onClick={() => setOpen(false)}
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
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-primary-900 flex items-center justify-between px-4 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <Home size={15} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Ace Realtors</p>
            {profile && <p className="text-primary-400 text-xs">{profile.name} · {profile.role}</p>}
          </div>
        </div>
        <button onClick={() => setOpen(true)} className="text-white p-2 rounded-lg hover:bg-primary-800">
          <Menu size={22}/>
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-primary-900 h-full shadow-2xl z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop sidebar — always visible */}
      <aside className="hidden md:flex w-60 min-h-screen bg-primary-900 flex-col fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>
    </>
  )
}
