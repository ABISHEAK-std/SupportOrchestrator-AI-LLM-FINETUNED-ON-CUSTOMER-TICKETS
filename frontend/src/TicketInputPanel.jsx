import { RotateCcw, Send, X } from 'lucide-react'
import { useState } from 'react'

import { Button, Card, ErrorBox, LoadingSpinner } from './components'
import { ticketAPI } from './client'

export function TicketInputPanel({ onProcessed }) {
  const [ticket, setTicket] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!ticket.trim()) return

    setLoading(true)
    setError(null)
    try {
      const normalizedTicket = ticket.trim()
      const response = await ticketAPI.process(normalizedTicket)
      onProcessed(response.data, normalizedTicket)
    } catch (requestError) {
      setError(requestError?.response?.data?.detail || requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Ticket Input Panel" subtitle="Enter customer issue for AI routing and policy retrieval.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <ErrorBox message={error} />}
        <textarea
          className="h-44 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          placeholder="Describe customer issue..."
          value={ticket}
          onChange={(event) => setTicket(event.target.value)}
          disabled={loading}
        />
        <div className="text-right text-xs text-slate-400">{ticket.length} characters</div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setTicket('')
              setError(null)
            }}
            disabled={loading}
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
          <Button type="button" variant="secondary" onClick={() => setError(null)} disabled={loading}>
            <RotateCcw className="h-4 w-4" />
            Retry
          </Button>
          <Button type="submit" className="ml-auto" disabled={loading || !ticket.trim()}>
            {loading ? <LoadingSpinner /> : <Send className="h-4 w-4" />}
            {loading ? 'Processing' : 'Process Ticket'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
