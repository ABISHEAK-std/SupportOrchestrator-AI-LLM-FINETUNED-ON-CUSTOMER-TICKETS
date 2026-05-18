import { Cpu, Network, Database } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Card } from './components'
import { ticketAPI } from './client'

export function LiveInfrastructure() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await ticketAPI.getInfrastructureStats()
        setStats(response.data)
        setError(null)
      } catch (err) {
        setError(err.message)
      }
    }
    fetchData()
  }, [])

  if (error) {
    return <div className="text-sm text-red-600">Failed to load infrastructure</div>
  }

  if (!stats) {
    return <div className="text-sm text-slate-500">Loading...</div>
  }

  const getChromaColor = (status) => {
    return status === 'Healthy' ? 'text-green-600' : 'text-yellow-600'
  }

  return (
    <Card title="Live Infrastructure" subtitle={stats.cluster_status}>
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Cpu className="h-4 w-4 text-blue-600" />
              GPU Utilization
            </div>
            <span className="text-sm font-semibold text-slate-800">{stats.gpu_utilization}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${stats.gpu_utilization}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Network className="h-4 w-4 text-emerald-600" />
              API Latency
            </div>
            <span className="text-sm font-semibold text-slate-800">{stats.api_latency_ms}ms</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${Math.min((stats.api_latency_ms / 500) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Database className="h-4 w-4 text-purple-600" />
              ChromaDB Health
            </div>
            <span className={`text-sm font-semibold ${getChromaColor(stats.chroma_health)}`}>
              {stats.chroma_health}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
