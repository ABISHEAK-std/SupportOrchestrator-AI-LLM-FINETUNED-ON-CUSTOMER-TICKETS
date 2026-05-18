import { Database, RefreshCcw } from 'lucide-react'

import { Button, Card } from './components'

export function RetrievedPoliciesSection({ policies = [], onRefresh, refreshing = false, hasTicket = false }) {
  const canRefresh = hasTicket && typeof onRefresh === 'function'

  return (
    <Card
      title="Retrieved Policies"
      subtitle="Intent-aware context returned from ChromaDB."
      actions={
        <Button variant="secondary" onClick={onRefresh} disabled={!canRefresh || refreshing} className="px-3 py-1.5 text-xs">
          <RefreshCcw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      }
    >
      {policies.length === 0 ? (
        <p className="text-sm text-slate-500">No policy chunks returned for this request.</p>
      ) : (
        <div className="space-y-3">
          {policies.map((policy, index) => (
            <article key={`${policy.slice(0, 20)}-${index}`} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                <Database className="h-3.5 w-3.5" />
                <span>Chunk #{index + 1}</span>
              </div>
              <p className="text-sm leading-6 text-slate-700">{policy}</p>
            </article>
          ))}
        </div>
      )}
    </Card>
  )
}
