import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, X, LayoutGrid, List } from 'lucide-react'

const MARKETERS = ['Joseph','Kenneth','Mercy','Lucy','Unassigned']
const TYPES = ['House','Apartment','Plot','Commercial']
const STATUSES = ['Available','Under Offer','Taken']
const DEAL_TYPES = ['For Sale','For Rent']
const OWNER_TYPES = ['Landlord','Developer']
const PLATFORMS = ['BuyRent Kenya','Property24','Website']
const fmt = n => 'KES ' + Number(n).toLocaleString()

const statusBadge = s => ({ Available:'bg-green-100 text-green-700', 'Under Offer':'bg-yellow-100 text-yellow-700', Taken:'bg-red-100 text-red-700' }[s])
const typeBg = t => ({ House:'🏡', Apartment:'🏢', Plot:'🏗️', Commercial:'🏬' }[t] || '🏠')

const empty = { property_name:'', type:'House', location:'', price:'', deal_type:'For Sale', bedrooms:'', status:'Available', platforms:[], owner_name:'', owner_type:'Landlord', assigned_marketer:'Unassigned' }

export default function Properties() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('grid')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const togglePlatform = p => setForm(f => ({ ...f, platforms: f.platforms.includes(p) ? f.platforms.filter(x=>x!==p) : [...f.platforms, p] }))

  const save = async () => {
    if (!form.property_name || !form.location || !form.price) return alert('Fill all required fields')
    setSaving(true)
    const { error } = await supabase.from('properties').insert([{ ...form, price: Number(form.price), bedrooms: form.bedrooms ? Number(form.bedrooms) : null }])
    if (error) alert(error.message)
    else { setModal(false); setForm(empty); load() }
    setSaving(false)
  }

  const del = async id => {
    if (!confirm('Delete this property?')) return
    await supabase.from('properties').delete().eq('id', id)
    setRows(r => r.filter(x => x.id !== id))
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Properties</h1><p className="text-gray-500 text-sm">All listings</p></div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('grid')} className={`p-2 rounded-lg ${view==='grid'?'bg-primary-100 text-primary-600':'text-gray-400 hover:bg-gray-100'}`}><LayoutGrid size={16}/></button>
          <button onClick={() => setView('list')} className={`p-2 rounded-lg ${view==='list'?'bg-primary-100 text-primary-600':'text-gray-400 hover:bg-gray-100'}`}><List size={16}/></button>
          <button onClick={() => setModal(true)} className="btn-primary"><Plus size={16}/> New Listing</button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map(p => (
            <div key={p.id} className="card overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-20 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-4xl">{typeBg(p.type)}</div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-semibold text-gray-900 text-sm">{p.property_name}</p>
                  <button onClick={() => del(p.id)} className="text-gray-200 hover:text-red-400"><X size={14}/></button>
                </div>
                <p className="text-xs text-gray-400 mb-2">{p.location}</p>
                <p className="text-base font-bold text-primary-700 mb-2">{fmt(p.price)}{p.deal_type==='For Rent'?'/mo':''}</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">{p.type}</span>
                  {p.bedrooms && <span className="bg-gray-50 text-gray-500 text-xs px-2 py-0.5 rounded-full">{p.bedrooms}BR</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(p.status)}`}>{p.status}</span>
                </div>
                <p className="text-xs text-gray-400">{p.owner_name} · {p.owner_type}</p>
                <p className="text-xs text-gray-400">{p.assigned_marketer}</p>
                {p.platforms?.length > 0 && <div className="flex gap-1 mt-2 flex-wrap">{p.platforms.map(pl => <span key={pl} className="text-xs bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded">{pl}</span>)}</div>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-left">{['Property','Type','Location','Price','Status','Owner','Marketer',''].map(h=><th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody>
              {rows.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.property_name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.type}</td>
                  <td className="px-4 py-3 text-gray-500">{p.location}</td>
                  <td className="px-4 py-3 font-semibold text-primary-700">{fmt(p.price)}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge(p.status)}`}>{p.status}</span></td>
                  <td className="px-4 py-3 text-gray-500">{p.owner_name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.assigned_marketer}</td>
                  <td className="px-4 py-3"><button onClick={() => del(p.id)} className="text-gray-300 hover:text-red-500"><X size={14}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-gray-900">New Listing</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="label">Property Name *</label><input className="input" value={form.property_name} onChange={e=>setForm({...form,property_name:e.target.value})}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Type</label><select className="select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                <div><label className="label">Deal Type</label><select className="select" value={form.deal_type} onChange={e=>setForm({...form,deal_type:e.target.value})}>{DEAL_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
              </div>
              <div><label className="label">Location *</label><input className="input" placeholder="e.g. Karen, Nairobi" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Price (KES) *</label><input className="input" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div>
                <div><label className="label">Bedrooms</label><input className="input" type="number" placeholder="Leave blank for plots" value={form.bedrooms} onChange={e=>setForm({...form,bedrooms:e.target.value})}/></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Status</label><select className="select" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></div>
                <div><label className="label">Assigned Marketer</label><select className="select" value={form.assigned_marketer} onChange={e=>setForm({...form,assigned_marketer:e.target.value})}>{MARKETERS.map(m=><option key={m}>{m}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Owner Name</label><input className="input" value={form.owner_name} onChange={e=>setForm({...form,owner_name:e.target.value})}/></div>
                <div><label className="label">Owner Type</label><select className="select" value={form.owner_type} onChange={e=>setForm({...form,owner_type:e.target.value})}>{OWNER_TYPES.map(o=><option key={o}>{o}</option>)}</select></div>
              </div>
              <div>
                <label className="label">Listed on Platforms</label>
                <div className="flex gap-2 flex-wrap">{PLATFORMS.map(p=><button type="button" key={p} onClick={()=>togglePlatform(p)} className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${form.platforms.includes(p)?'bg-primary-600 text-white border-primary-600':'bg-white text-gray-600 border-gray-200 hover:border-primary-400'}`}>{p}</button>)}</div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-5 py-4 border-t bg-gray-50 rounded-b-2xl">
              <button onClick={()=>setModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={save} disabled={saving} className="btn-primary">{saving?'Saving...':'Save Listing'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
