import { Workflow, Zap } from 'lucide-react'

import { Badge, Card, Metric, ProgressBar } from './components'
import { INTENT_COLORS, PRIORITY_COLORS } from './constants'

export function PredictionResultCard({ result }) {
  const classification = result?.classification
  const confidence = classification ? Number(classification.confidence || 0) * 100 : 0
  const intentTone = classification ? INTENT_COLORS[classification.intent] || 'default' : 'default'
  const priorityTone = classification ? PRIORITY_COLORS[classification.priority] || 'default' : 'default'

  return (
    <Card title="AI Prediction & Logic" subtitle="Model decision output with deterministic backend routing." actions={<Workflow className="h-4 w-4 text-slate-400" />}>
      {!result ? (
        <p className="text-sm text-slate-500">Process a ticket to view intent, priority, confidence, and routing.</p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Predicted Intent</p>
              <div className="mt-2">
                <Badge tone={intentTone}>{classification.intent.replaceAll('_', ' ')}</Badge>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Priority</p>
              <div className="mt-2">
                <Badge tone={priorityTone}>{classification.priority}</Badge>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-600">Confidence Score</span>
              <span className="font-semibold text-slate-900">{confidence.toFixed(1)}%</span>
            </div>
            <ProgressBar value={confidence} />
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 p-3">
            <Metric label="Assigned Team" value={result.queue || '--'} />
            <Metric label="Escalation" value={result.escalate ? 'Required' : 'Not Required'} />
          </div>

          {result.escalate && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              <div className="flex items-start gap-2">
                <Zap className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Escalation reasons: {result.escalation_reasons.join(', ')}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
