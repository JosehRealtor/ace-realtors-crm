import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Search } from 'lucide-react'

const fmt = n => 'KES ' + Number(n).toLocaleString()

export default function Archive() {
  const [records, setRecords] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    supabase.from('archive').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setRecords(data || [])
      setLoading(false)
    })
  }, [])

  const filtered = records.filter(r => {
    const name = r.data?.client_name || r.data?.name || ''
    return name.toLowerCase().includes(search.toLowerCase()) && (filter === 'All' || r.reason === filter)
  })

  const reasonBadge = r => ({ 'Closed Won':'bg-green-100 text-green-700', 'Closed Lost':'bg-red-100 text-red-700', 'Deleted':'bg-gray-100 text-gray-600' }[r] || 'bg-gray-100 text-gray-600')

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Archive</h1>
        <p className="text-gray-500 text-sm">Past clients and closed enquiries — nothing is permanently deleted</p>
      </div>
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search by client name..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['All','Closed Won','Closed Lost','Deleted'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${filter === f ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              {['Client','Type','Details','Reason','Archived By','Date'].map(h => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No archived records found.</td></tr>}
            {filtered.map(r => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{r.data?.client_name || r.data?.name || '—'}</p>
                  <p className="text-xs text-gray-400">{r.record_type}</p>
                </td>
                <td className="px-4 py-3">
                  {r.data?.type && <span className={r.data.type === 'Buy' ? 'badge-buy' : 'badge-rent'}>{r.data.type}</span>}
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs max-w-[200px]">
                  <p>{r.data?.property_interest || r.data?.notes || '—'}</p>
                  {r.data?.budget && <p className="font-medium text-gray-700">{fmt(r.data.budget)}</p>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${reasonBadge(r.reason)}`}>{r.reason}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{r.archived_by || '—'}</td>
                <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleDateString('en-KE', { day:'numeric', month:'short', year:'numeric' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
