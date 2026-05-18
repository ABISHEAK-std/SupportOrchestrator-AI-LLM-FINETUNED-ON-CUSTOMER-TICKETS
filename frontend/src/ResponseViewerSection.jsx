import { Copy, MessageSquare, RefreshCcw } from 'lucide-react'

import { Button, Card, SuccessBox } from './components'

export function ResponseViewerSection({ response, onReprocess, processing = false }) {
  const hasResponse = Boolean(response)

  return (
    <Card title="AI Generated Support Response" subtitle="Draft generated from ticket + retrieved context.">
      {!hasResponse ? (
        <p className="text-sm text-slate-500">No response generated yet.</p>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-4 text-sm leading-7 text-slate-700">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <MessageSquare className="h-3.5 w-3.5" />
              Draft
            </div>
            <p className="whitespace-pre-wrap">{response}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                navigator.clipboard?.writeText(response)
              }}
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button variant="secondary" onClick={onReprocess} disabled={!onReprocess || processing}>
              <RefreshCcw className={`h-4 w-4 ${processing ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          </div>
          <SuccessBox message="Response is ready for agent review before sending to customer." />
        </div>
      )}
    </Card>
  )
}
