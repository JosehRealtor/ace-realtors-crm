import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Search, X } from 'lucide-react'

const MARKETERS = ['Joseph','Kenneth','Mercy','Lucy','Unassigned']
const STAGES = ['New','Contacted','Viewing Scheduled','Negotiating','Closed Won','Closed Lost']
const PLATFORMS = ['BuyRent Kenya','Property24','Website','Referral']
const fmt = n => 'KES ' + Number(n).toLocaleString()

const stageBadge = s => ({ New:'badge-new', Contacted:'badge-contacted', 'Viewing Scheduled':'badge-viewing', Negotiating:'badge-negotiating', 'Closed Won':'badge-won', 'Closed Lost':'badge-lost' }[s] || 'badge-new')

const isOverdue = d => d && new Date(d) <= new Date(new Date().toDateString())

const empty = { client_name:'', phone:'', email:'', type:'Buy', property_interest:'', budget:'', source_platform:'BuyRent Kenya', assigned_marketer:'Unassigned', pipeline_stage:'New', next_followup:'', notes:'' }

export default function Enquiries() {
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = rows.filter(r =>
    r.client_name.toLowerCase().includes(search.toLowerCase()) ||
    r.property_interest.toLowerCase().includes(search.toLowerCase())
  )

  const save = async () => {
    if (!form.client_name || !form.phone || !form.property_interest || !form.budget) return alert('Please fill all required fields')
    setSaving(true)
    const { error } = await supabase.from('enquiries').insert([{ ...form, budget: Number(form.budget) }])
    if (error) alert(error.message)
    else { setModal(false); setForm(empty); load() }
    setSaving(false)
  }

  const updateMarketer = async (id, val) => {
    await supabase.from('enquiries').update({ assigned_marketer: val }).eq('id', id)
    setRows(r => r.map(x => x.id === id ? { ...x, assigned_marketer: val } : x))
  }

  const updateStage = async (id, val) => {
    await supabase.from('enquiries').update({ pipeline_stage: val }).eq('id', id)
    setRows(r => r.map(x => x.id === id ? { ...x, pipeline_stage: val } : x))
  }

  const del = async id => {
    if (!confirm('Delete this enquiry?')) return
    await supabase.from('enquiries').delete().eq('id', id)
    setRows(r => r.filter(x => x.id !== id))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
          <p className="text-gray-500 text-sm">Manage all property enquiries</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary">
          <Plus size={16} /> New Enquiry
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="input pl-9" placeholder="Search by name or property..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              {['Client','Type','Property Interest','Budget','Platform','Marketer','Stage','Follow-up',''].map(h => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No enquiries found.</td></tr>}
            {filtered.map(r => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="font-medium text-gray-900">{r.client_name}</p>
                  <p className="text-xs text-gray-400">{r.phone}</p>
                </td>
                <td className="px-4 py-3"><span className={r.type==='Buy'?'badge-buy':'badge-rent'}>{r.type}</span></td>
                <td className="px-4 py-3 max-w-[160px] truncate text-gray-700">{r.property_interest}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{fmt(r.budget)}</td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{r.source_platform}</td>
                <td className="px-4 py-3">
                  <select className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500" value={r.assigned_marketer} onChange={e => updateMarketer(r.id, e.target.value)}>
                    {MARKETERS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select className={`text-xs border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 ${stageBadge(r.pipeline_stage)}`} value={r.pipeline_stage} onChange={e => updateStage(r.id, e.target.value)}>
                    {STAGES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className={`px-4 py-3 text-xs whitespace-nowrap font-medium ${isOverdue(r.next_followup) ? 'text-red-600' : 'text-gray-500'}`}>
                  {r.next_followup || '—'}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => del(r.id)} className="text-gray-300 hover:text-red-500 transition-colors"><X size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-gray-900">New Enquiry</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Client Name *</label><input className="input" value={form.client_name} onChange={e=>setForm({...form,client_name:e.target.value})} /></div>
                <div><label className="label">Phone *</label><input className="input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
              </div>
              <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Type *</label>
                  <select className="select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                    <option>Buy</option><option>Rent</option>
                  </select>
                </div>
                <div><label className="label">Budget (KES) *</label><input className="input" type="number" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} /></div>
              </div>
              <div><label className="label">Property Interest *</label><input className="input" placeholder="e.g. 3BR House, Kilimani" value={form.property_interest} onChange={e=>setForm({...form,property_interest:e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Source Platform</label>
                  <select className="select" value={form.source_platform} onChange={e=>setForm({...form,source_platform:e.target.value})}>
                    {PLATFORMS.map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
                <div><label className="label">Assigned Marketer</label>
                  <select className="select" value={form.assigned_marketer} onChange={e=>setForm({...form,assigned_marketer:e.target.value})}>
                    {MARKETERS.map(m=><option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Pipeline Stage</label>
                  <select className="select" value={form.pipeline_stage} onChange={e=>setForm({...form,pipeline_stage:e.target.value})}>
                    {STAGES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className="label">Next Follow-up</label><input className="input" type="date" value={form.next_followup} onChange={e=>setForm({...form,next_followup:e.target.value})} /></div>
              </div>
              <div><label className="label">Notes</label><textarea className="input" rows={3} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} /></div>
            </div>
            <div className="flex justify-end gap-3 px-5 py-4 border-t bg-gray-50 rounded-b-2xl">
              <button onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Enquiry'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
