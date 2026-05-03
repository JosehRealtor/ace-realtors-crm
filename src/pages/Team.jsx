import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const TEAM = [
  { name: 'Peter', role: 'Director', initials: 'PT', color: 'bg-purple-100 text-purple-700', desc: 'Oversees all company operations, strategy and approvals.' },
  { name: 'Joseph', role: 'Marketer', initials: 'JO', color: 'bg-primary-100 text-primary-700', desc: 'Handles enquiries, viewings and property sourcing.' },
  { name: 'Kenneth', role: 'Marketer', initials: 'KE', color: 'bg-blue-100 text-blue-700', desc: 'Handles enquiries, viewings and property sourcing.' },
  { name: 'Mercy', role: 'Marketer', initials: 'ME', color: 'bg-pink-100 text-pink-700', desc: 'Handles enquiries, viewings and property sourcing.' },
  { name: 'Lucy', role: 'Marketer', initials: 'LU', color: 'bg-orange-100 text-orange-700', desc: 'Handles enquiries, viewings and property sourcing.' },
  { name: 'Secretary', role: 'Secretary', initials: 'SC', color: 'bg-gray-100 text-gray-500', desc: 'Records enquiries, meeting minutes and admin tasks. Name TBD.' },
]

const roleBadge = r => ({ Director:'bg-purple-100 text-purple-700', Marketer:'bg-primary-100 text-primary-700', Secretary:'bg-gray-100 text-gray-600' }[r])

export default function Team() {
  const [enquiries, setEnquiries] = useState([])

  useEffect(() => {
    supabase.from('enquiries').select('assigned_marketer, pipeline_stage, budget').then(({ data }) => setEnquiries(data || []))
  }, [])

  const active = name => enquiries.filter(e => e.assigned_marketer === name && !['Closed Won','Closed Lost'].includes(e.pipeline_stage)).length
  const closed = name => enquiries.filter(e => e.assigned_marketer === name && e.pipeline_stage === 'Closed Won').length
  const commission = name => enquiries.filter(e => e.assigned_marketer === name && e.pipeline_stage === 'Closed Won').reduce((s,e) => s + Number(e.budget)*0.05, 0)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team</h1>
        <p className="text-gray-500 text-sm">Ace Realtors team members and performance</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEAM.map(m => (
          <div key={m.name} className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${m.color}`}>{m.initials}</div>
              <div>
                <p className="font-semibold text-gray-900">{m.name}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadge(m.role)}`}>{m.role}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">{m.desc}</p>
            {m.role === 'Marketer' && (
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-50">
                <div className="text-center"><p className="text-lg font-bold text-gray-900">{active(m.name)}</p><p className="text-xs text-gray-400">Active</p></div>
                <div className="text-center"><p className="text-lg font-bold text-gray-900">{closed(m.name)}</p><p className="text-xs text-gray-400">Closed</p></div>
                <div className="text-center"><p className="text-sm font-bold text-primary-600">{commission(m.name) > 0 ? 'KES '+commission(m.name).toLocaleString() : '—'}</p><p className="text-xs text-gray-400">Comm.</p></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
