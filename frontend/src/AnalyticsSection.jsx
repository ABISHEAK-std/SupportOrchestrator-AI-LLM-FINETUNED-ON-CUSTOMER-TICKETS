import { useEffect, useState } from 'react'

import { Badge, Card, ErrorBox } from './components'
import { ticketAPI } from './client'

export function AnalyticsSection() {
  const [escalationQueue, setEscalationQueue] = useState([])
  const [error, setError] = useState(null)
  const [filterTeam, setFilterTeam] = useState('All Teams')

  useEffect(() => {
    async function fetchQueue() {
      try {
        const response = await ticketAPI.getEscalationQueue(10)
        setEscalationQueue(response.data)
        setError(null)
      } catch (err) {
        setError(err.message)
      }
    }
    fetchQueue()
  }, [])

  if (error) {
    return <ErrorBox message={error} />
  }

  const filteredQueue = filterTeam === 'All Teams' 
    ? escalationQueue 
    : escalationQueue.filter(item => item.team === filterTeam)

  const teams = ['All Teams', ...new Set(escalationQueue.map(item => item.team))]

  return (
    <Card title="Escalation Queue & Live Monitor" subtitle="">
      <div className="mb-4 flex items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Filter queue..."
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
        <select
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        >
          {teams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>

      {filteredQueue.length === 0 ? (
        <p className="text-sm text-slate-500">Escalation queue is clear.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-3 font-semibold">Ticket ID</th>
                <th className="pb-3 font-semibold">Intent</th>
                <th className="pb-3 font-semibold">Confidence</th>
                <th className="pb-3 font-semibold">Reason</th>
                <th className="pb-3 font-semibold">Team</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueue.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 font-mono font-semibold text-slate-800">{item.ticket_id}</td>
                  <td className="py-3 text-slate-700">{item.intent.replaceAll('_', ' ')}</td>
                  <td className="py-3 text-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-12 rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-sky-500"
                          style={{ width: `${Math.min((item.confidence || 0) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{((item.confidence || 0) * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge tone="warning">{item.reason}</Badge>
                  </td>
                  <td className="py-3 text-slate-700">{item.team}</td>
                  <td className="py-3">
                    <button className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-sky-600 hover:bg-sky-50">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
