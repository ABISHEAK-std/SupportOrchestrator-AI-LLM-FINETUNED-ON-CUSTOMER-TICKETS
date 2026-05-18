import { BookOpen, FileText, CheckCircle2, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Card } from './components'
import { ticketAPI } from './client'

export function KnowledgeBaseAssets() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await ticketAPI.getKnowledgeBaseStats()
        setStats(response.data)
        setError(null)
      } catch (err) {
        setError(err.message)
      }
    }
    fetchData()
  }, [])

  if (error) {
    return <div className="text-sm text-red-600">Failed to load KB stats</div>
  }

  if (!stats) {
    return <div className="text-sm text-slate-500">Loading...</div>
  }

  return (
    <Card title="Knowledge Base Assets" subtitle="Manage vectorized documents and policy context embeddings">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <BookOpen className="h-4 w-4" />
            Active Collections
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.active_collections}</p>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <FileText className="h-4 w-4" />
            Total Embeddings
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.total_embeddings.toLocaleString()}</p>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="h-4 w-4" />
            Indexing Status
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.indexing_status}</p>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <Zap className="h-4 w-4" />
            Chunk Success Rate
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.chunk_success_rate.toFixed(2)}%</p>
        </div>
      </div>
    </Card>
  )
}
