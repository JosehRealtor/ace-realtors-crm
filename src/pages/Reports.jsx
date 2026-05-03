import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const MARKETERS = ['Joseph','Kenneth','Mercy','Lucy']
const fmt = n => 'KES ' + Number(n).toLocaleString()

export default function Reports() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('enquiries').select('*').then(({ data }) => { setEnquiries(data || []); setLoading(false) })
  }, [])

  const closed = enquiries.filter(e => e.pipeline_stage === 'Closed Won')
  const totalPipeline = enquiries.filter(e => !['Closed Won','Closed Lost'].includes(e.pipeline_stage)).reduce((s,e)=>s+Number(e.budget),0)
  const totalCommission = closed.reduce((s,e)=>s+Number(e.budget)*0.05, 0)
  const convRate = enquiries.length ? Math.round((closed.length/enquiries.length)*100) : 0

  const commByMarketer = MARKETERS.map(m => ({
    name: m,
    commission: Math.round(enquiries.filter(e=>e.assigned_marketer===m && e.pipeline_stage==='Closed Won').reduce((s,e)=>s+Number(e.budget)*0.05,0))
  }))

  const buyVsRent = [
    { name: 'Buy', value: enquiries.filter(e=>e.type==='Buy').length },
    { name: 'Rent', value: enquiries.filter(e=>e.type==='Rent').length },
  ]

  const sources = ['BuyRent Kenya','Property24','Website','Referral'].map(s => ({
    name: s, count: enquiries.filter(e=>e.source_platform===s).length
  }))

  const PIE_COLORS = ['#16a34a','#2563eb','#9333ea','#ea580c']

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading reports...</div>

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Reports</h1><p className="text-gray-500 text-sm">Performance overview</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 text-center"><p className="text-3xl font-bold text-gray-900">{closed.length}</p><p className="text-sm text-gray-500 mt-1">Deals Closed</p></div>
        <div className="card p-5 text-center"><p className="text-3xl font-bold text-primary-600">{convRate}%</p><p className="text-sm text-gray-500 mt-1">Conversion Rate</p></div>
        <div className="card p-5 text-center"><p className="text-xl font-bold text-gray-900">{fmt(totalPipeline)}</p><p className="text-sm text-gray-500 mt-1">Pipeline Value</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Commission by Marketer (KES)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={commByMarketer} barSize={36}>
              <XAxis dataKey="name" tick={{fontSize:12}} />
              <YAxis tick={{fontSize:11}} />
              <Tooltip formatter={v => fmt(v)} />
              <Bar dataKey="commission" radius={[4,4,0,0]} fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Buy vs Rent Split</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={buyVsRent} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,value})=>`${name}: ${value}`}>
                {buyVsRent.map((_,i)=><Cell key={i} fill={['#2563eb','#16a34a'][i]}/>)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Enquiries by Source Platform</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sources} barSize={32}>
              <XAxis dataKey="name" tick={{fontSize:11}} />
              <YAxis tick={{fontSize:11}} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4,4,0,0]}>
                {sources.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Total Commission Earned</h2>
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600">{fmt(totalCommission)}</p>
              <p className="text-gray-400 text-sm mt-2">Based on 5% of closed deals</p>
              <p className="text-gray-500 text-sm mt-1">from {closed.length} deal{closed.length !== 1 ? 's' : ''} closed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
