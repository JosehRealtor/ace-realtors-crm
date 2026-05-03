import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, X, Users, Building } from 'lucide-react'

const CLIENT_TYPES = ['Buyer','Tenant']
const PARTNER_TYPES = ['Landlord','Developer']
const emptyClient = { name:'', phone:'', email:'', type:'Buyer', notes:'' }
const emptyPartner = { name:'', phone:'', email:'', type:'Landlord', notes:'' }

export default function Clients() {
  const [tab, setTab] = useState('clients')
  const [clients, setClients] = useState([])
  const [partners, setPartners] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyClient)
  const [saving, setSaving] = useState(false)

  const loadClients = async () => {
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    setClients(data || [])
  }
  const loadPartners = async () => {
    const { data } = await supabase.from('partners').select('*').order('created_at', { ascending: false })
    setPartners(data || [])
  }

  useEffect(() => { loadClients(); loadPartners() }, [])

  const openModal = type => { setModal(type); setForm(type==='client' ? emptyClient : emptyPartner) }

  const save = async () => {
    if (!form.name || !form.phone) return alert('Name and phone are required')
    setSaving(true)
    const table = modal === 'client' ? 'clients' : 'partners'
    const { error } = await supabase.from(table).insert([form])
    if (error) alert(error.message)
    else { modal === 'client' ? loadClients() : loadPartners(); setModal(null) }
    setSaving(false)
  }

  const del = async (table, id, reload) => {
    if (!confirm('Delete this record?')) return
    await supabase.from(table).delete().eq('id', id)
    reload()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Clients</h1><p className="text-gray-500 text-sm">Buyers, tenants, landlords and developers</p></div>
        <button onClick={() => openModal(tab === 'clients' ? 'client' : 'partner')} className="btn-primary"><Plus size={16}/> Add {tab === 'clients' ? 'Client' : 'Partner'}</button>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button onClick={() => setTab('clients')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab==='clients'?'bg-white text-gray-900 shadow-sm':'text-gray-500 hover:text-gray-700'}`}><Users size={15}/>Buyers & Tenants</button>
        <button onClick={() => setTab('partners')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab==='partners'?'bg-white text-gray-900 shadow-sm':'text-gray-500 hover:text-gray-700'}`}><Building size={15}/>Landlords & Developers</button>
      </div>

      {tab === 'clients' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.length === 0 && <p className="text-gray-400 text-sm col-span-3">No clients yet. Add your first one.</p>}
          {clients.map(c => (
            <div key={c.id} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">{c.name.charAt(0)}</div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.type==='Buyer'?'bg-blue-100 text-blue-700':'bg-green-100 text-green-700'}`}>{c.type}</span>
                  <button onClick={() => del('clients', c.id, loadClients)} className="text-gray-200 hover:text-red-400"><X size={14}/></button>
                </div>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
              <p className="text-xs text-gray-400">{c.phone}</p>
              {c.email && <p className="text-xs text-gray-400">{c.email}</p>}
              {c.notes && <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg p-2">{c.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === 'partners' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.length === 0 && <p className="text-gray-400 text-sm col-span-3">No partners yet. Add your first one.</p>}
          {partners.map(p => (
            <div key={p.id} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">{p.name.charAt(0)}</div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.type==='Landlord'?'bg-purple-100 text-purple-700':'bg-orange-100 text-orange-700'}`}>{p.type}</span>
                  <button onClick={() => del('partners', p.id, loadPartners)} className="text-gray-200 hover:text-red-400"><X size={14}/></button>
                </div>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
              <p className="text-xs text-gray-400">{p.phone}</p>
              {p.email && <p className="text-xs text-gray-400">{p.email}</p>}
              {p.notes && <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg p-2">{p.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-gray-900">Add {modal === 'client' ? 'Client' : 'Partner'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Name *</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
                <div><label className="label">Phone *</label><input className="input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
              </div>
              <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
              <div><label className="label">Type</label>
                <select className="select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                  {(modal==='client'?CLIENT_TYPES:PARTNER_TYPES).map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="label">Notes</label><textarea className="input" rows={3} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
            </div>
            <div className="flex justify-end gap-3 px-5 py-4 border-t bg-gray-50 rounded-b-2xl">
              <button onClick={()=>setModal(null)} className="btn-secondary">Cancel</button>
              <button onClick={save} disabled={saving} className="btn-primary">{saving?'Saving...':'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
