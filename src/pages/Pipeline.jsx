import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const STAGES = ['New','Contacted','Viewing Scheduled','Negotiating','Closed Won','Closed Lost']
const STAGE_COLORS = { New:'bg-gray-100 text-gray-700', Contacted:'bg-blue-100 text-blue-700', 'Viewing Scheduled':'bg-yellow-100 text-yellow-700', Negotiating:'bg-purple-100 text-purple-700', 'Closed Won':'bg-green-100 text-green-700', 'Closed Lost':'bg-red-100 text-red-700' }
const fmt = n => 'KES ' + Number(n).toLocaleString()

export default function Pipeline() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState(null)

  useEffect(() => {
    supabase.from('enquiries').select('*').then(({ data }) => { setEnquiries(data || []); setLoading(false) })
  }, [])

  const byStage = s => enquiries.filter(e => e.pipeline_stage === s)
  const stageTotal = s => byStage(s).reduce((sum, e) => sum + Number(e.budget), 0)

  const onDragStart = (e, id) => { setDragging(id); e.dataTransfer.effectAllowed = 'move' }
  const onDragOver = e => e.preventDefault()
  const onDrop = async (e, stage) => {
    e.preventDefault()
    if (!dragging) return
    await supabase.from('enquiries').update({ pipeline_stage: stage }).eq('id', dragging)
    setEnquiries(prev => prev.map(x => x.id === dragging ? { ...x, pipeline_stage: stage } : x))
    setDragging(null)
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading pipeline...</div>

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
        <p className="text-gray-500 text-sm">Drag cards between stages to update progress</p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map(stage => (
          <div key={stage} className="flex-shrink-0 w-60"
            onDragOver={onDragOver}
            onDrop={e => onDrop(e, stage)}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STAGE_COLORS[stage]}`}>{stage}</span>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center">{byStage(stage).length}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-2">{fmt(stageTotal(stage))}</p>
            <div className="space-y-2 min-h-[100px]">
              {byStage(stage).map(e => (
                <div key={e.id}
                  draggable
                  onDragStart={ev => onDragStart(ev, e.id)}
                  className={`bg-white rounded-xl border border-gray-100 shadow-sm p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow border-l-4 ${e.type === 'Buy' ? 'border-l-blue-400' : 'border-l-green-400'} ${dragging === e.id ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <p className="font-semibold text-gray-900 text-sm">{e.client_name}</p>
                    <span className={e.type==='Buy'?'badge-buy':'badge-rent'}>{e.type}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{e.property_interest}</p>
                  <p className="text-xs font-semibold text-gray-700">{fmt(e.budget)}</p>
                  <p className="text-xs text-gray-400 mt-1">{e.assigned_marketer}</p>
                </div>
              ))}
              {byStage(stage).length === 0 && (
                <div className="border-2 border-dashed border-gray-100 rounded-xl h-16 flex items-center justify-center text-xs text-gray-300">Drop here</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
