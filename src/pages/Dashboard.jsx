import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ClipboardList, Building2, Trophy, Banknote, AlertCircle, Calendar } from 'lucide-react'

const fmt = n => 'KES ' + Number(n).toLocaleString()

function getGreeting(name) {
  const hour = new Date().getHours()
  const time = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  return `${time}, ${name}! 👋`
}

export default function Dashboard() {
  const { profile } = useAuth()
  const [enquiries, setEnquiries] = useState([])
  const [properties, setProperties] = useState([])
  const [allEnquiries, setAllEnquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [e, p, all] = await Promise.all([
        supabase.from('enquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('properties').select('*'),
        profile?.role === 'Director' || profile?.role === 'Secretary'
          ? supabase.from('enquiries').select('*').order('next_followup', { ascending: true })
          : { data: [] }
      ])
      setEnquiries(e.data || [])
      setProperties(p.data || [])
      setAllEnquiries(all.data || [])
      setLoading(false)
    }
    if (profile) load()
  }, [profile])

  const today = new Date().toISOString().split('T')[0]
  const active = enquiries.filter(e => !['Closed Won','Closed Lost'].includes(e.pipeline_stage)).length
  const closed = enquiries.filter(e => e.pipeline_stage === 'Closed Won').length
  const commission = enquiries.filter(e => e.pipeline_stage === 'Closed Won').reduce((s,e) => s + (e.budget * 0.05), 0)

  const todayFollowups = profile?.role === 'Director' || profile?.role === 'Secretary'
    ? allEnquiries.filter(e => e.next_followup === today)
    : enquiries.filter(e => e.next_followup === today)

  const unassigned = (profile?.role === 'Director' || profile?.role === 'Secretary' ? allEnquiries : enquiries)
    .filter(e => e.assigned_marketer === 'Unassigned' && !['Closed Won','Closed Lost'].includes(e.pipeline_stage))

  const sources = ['BuyRent Kenya','Property24','Website','Referral'].map(s => ({
    name: s, count: enquiries.filter(e => e.source_platform === s).length
  }))

  const stageBadge = s => ({ New:'badge-new', Contacted:'badge-contacted', 'Viewing Scheduled':'badge-viewing', Negotiating:'badge-negotiating', 'Closed Won':'badge-won', 'Closed Lost':'badge-lost' }[s] || 'badge-new')

  const kpis = [
    { label: 'Active Enquiries', value: active, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Listings', value: properties.length, icon: Building2, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Deals Closed', value: closed, icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Commission (mo.)', value: fmt(commission), icon: Banknote, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{getGreeting(profile?.name || 'there')}</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {profile?.role === 'Director' ? 'Here is the full company overview' :
           profile?.role === 'Secretary' ? "Here is today's activity summary" :
           'Here is your personal dashboard'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-primary-600" />
          <h2 className="font-semibold text-gray-900 text-sm">
            Today's Follow-ups
            {profile?.role === 'Director' || profile?.role === 'Secretary' ? ' — All Marketers' : ` — ${profile?.name}`}
          </h2>
          <span className="ml-auto bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">{todayFollowups.length}</span>
        </div>
        {todayFollowups.length === 0 ? (
          <p className="text-gray-400 text-sm">No follow-ups scheduled for today.</p>
        ) : (
          <div className="space-y-2">
            {todayFollowups.map(e => (
              <div key={e.id} className="flex items-center justify-between py-2.5 px-3 bg-amber-50 border border-amber-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{e.client_name}</p>
                  <p className="text-xs text-gray-500">{e.property_interest}</p>
                  {(profile?.role === 'Director' || profile?.role === 'Secretary') && (
                    <p className="text-xs text-primary-600 font-medium mt-0.5">👤 {e.assigned_marketer}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={e.type === 'Buy' ? 'badge-buy' : 'badge-rent'}>{e.type}</span>
                  <span className={stageBadge(e.pipeline_stage)}>{e.pipeline_stage}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {unassigned.length > 0 && (
        <div className="card p-5 border-l-4 border-l-red-400">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="text-red-500" />
            <h2 className="font-semibold text-gray-900 text-sm">Unassigned Enquiries</h2>
            <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{unassigned.length}</span>
          </div>
          <div className="space-y-2">
            {unassigned.map(e => (
              <div key={e.id} className="flex items-center justify-between py-2.5 px-3 bg-red-50 border border-red-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{e.client_name}</p>
                  <p className="text-xs text-gray-500">{e.property_interest} · {e.source_platform}</p>
                </div>
                <span className={e.type === 'Buy' ? 'badge-buy' : 'badge-rent'}>{e.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Enquiries by Platform</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sources} barSize={32}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4,4,0,0]}>
                {sources.map((_, i) => <Cell key={i} fill={['#16a34a','#2563eb','#9333ea','#ea580c'][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Recent Enquiries</h2>
          <div className="space-y-3">
            {enquiries.slice(0,5).length === 0 && <p className="text-gray-400 text-sm">No enquiries yet.</p>}
            {enquiries.slice(0,5).map(e => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{e.client_name}</p>
                  <p className="text-xs text-gray-400">{e.property_interest}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={e.type === 'Buy' ? 'badge-buy' : 'badge-rent'}>{e.type}</span>
                  <span className={stageBadge(e.pipeline_stage)}>{e.pipeline_stage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
