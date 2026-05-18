import {
  Activity,
  BarChart3,
  BookOpen,
  ClipboardList,
  HeartPulse,
  Search,
  Settings,
  Shield,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { ticketAPI } from './client'
import { Badge, Card, HealthIndicator } from './components'
import { AnalyticsSection } from './AnalyticsSection'
import { InferenceVolumeChart } from './InferenceVolumeChart'
import { KnowledgeBaseAssets } from './KnowledgeBaseAssets'
import { LiveInfrastructure } from './LiveInfrastructure'
import { PredictionResultCard } from './PredictionResultCard'
import { ResponseViewerSection } from './ResponseViewerSection'
import { RetrievedPoliciesSection } from './RetrievedPoliciesSection'
import { TicketInputPanel } from './TicketInputPanel'
import { useAPIHealth } from './hooks'

const NAV_ITEMS = [
  { section: 'GENERAL', items: [
    { label: 'Dashboard', icon: BarChart3 },
    { label: 'Process Ticket', icon: ClipboardList, active: true },
    { label: 'Retrieval Monitor', icon: Search },
    { label: 'Escalations', icon: Shield },
    { label: 'Analytics', icon: Activity },
  ]},
  { section: 'INFRASTRUCTURE', items: [
    { label: 'Knowledge Base', icon: BookOpen },
    { label: 'API Health', icon: HeartPulse },
    { label: 'Settings', icon: Settings },
  ]},
]

export default function Dashboard() {
  const [result, setResult] = useState(null)
  const [lastTicket, setLastTicket] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [reprocessing, setReprocessing] = useState(false)
  const { health, loading: healthLoading } = useAPIHealth()

  const isHealthy = health?.status === 'ok'
  const modelLabel = import.meta.env.VITE_MODEL_NAME || 'GPT-4o-Turbo'

  const pipelineSteps = useMemo(() => {
    if (!result) {
      return [
        { label: 'Input', value: 'Customer Ticket Received' },
        { label: 'Classification', value: '--' },
        { label: 'Context Retrieval', value: '--' },
        { label: 'Generation', value: '--' },
        { label: 'Final Action', value: '--' },
      ]
    }

    return [
      { label: 'Input', value: 'Customer Ticket Received' },
      { label: 'Classification', value: `${result.classification.intent}` },
      { label: 'Context Retrieval', value: `${result.retrieved_policy.length} docs` },
      { label: 'Generation', value: result.response_message ? 'Response drafted' : 'Pending' },
      { label: 'Final Action', value: result.escalate ? 'Escalated' : 'Ready for send' },
    ]
  }, [result])

  async function rerunLatestTicket() {
    if (!lastTicket) return
    setReprocessing(true)
    try {
      const response = await ticketAPI.process(lastTicket)
      setResult(response.data)
    } finally {
      setReprocessing(false)
    }
  }

  async function refreshPolicies() {
    if (!lastTicket) return
    setRefreshing(true)
    try {
      const response = await ticketAPI.process(lastTicket)
      setResult(response.data)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto flex max-w-[1920px]">
        {/* SIDEBAR */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white p-5 xl:block overflow-y-auto">
          <div className="mb-8 flex items-center gap-2">
            <div className="rounded-lg bg-sky-500 p-2 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-sky-500">Aegis AI Ops</p>
              <p className="text-xs text-slate-500">Support Portal</p>
            </div>
          </div>

          <nav className="space-y-6">
            {NAV_ITEMS.map((section) => (
              <div key={section.section}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{section.section}</p>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        type="button"
                        key={item.label}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all ${
                          item.active
                            ? 'bg-sky-500 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-6">
          {/* HEADER */}
          <header className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <div className="relative min-w-[280px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                placeholder="Search tickets, logs, or policies..."
              />
            </div>
            <Badge tone="default">MODEL: {modelLabel}</Badge>
            <Badge tone="default">LATENCY: 142ms</Badge>
            <HealthIndicator isHealthy={isHealthy} loading={healthLoading} />
            <Badge tone="success">● Live Inference</Badge>
          </header>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            {/* COL 1-4: TICKET INPUT */}
            <div className="xl:col-span-4">
              <TicketInputPanel
                onProcessed={(response, ticketText) => {
                  setResult(response)
                  setLastTicket(ticketText)
                }}
              />
            </div>

            {/* COL 5-7: AI PREDICTION */}
            <div className="xl:col-span-3">
              <PredictionResultCard result={result} />
            </div>

            {/* COL 8-12: WORKFLOW PIPELINE */}
            <div className="xl:col-span-5">
              <Card title="Workflow Pipeline" subtitle="">
                <div className="space-y-2">
                  {pipelineSteps.map((step, idx) => (
                    <div key={step.label} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{step.label}</p>
                        <p className="mt-0.5 text-sm font-medium text-slate-700">{step.value}</p>
                      </div>
                      <button type="button" className="text-slate-400 hover:text-slate-600">
                        ⊙
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* COL 1-5: RETRIEVED POLICIES */}
            <div className="xl:col-span-5">
              <RetrievedPoliciesSection
                policies={result?.retrieved_policy || []}
                onRefresh={refreshPolicies}
                refreshing={refreshing}
                hasTicket={Boolean(lastTicket)}
              />
            </div>

            {/* COL 6-12: AI-GENERATED RESPONSE */}
            <div className="xl:col-span-7">
              <ResponseViewerSection
                response={result?.response_message}
                onReprocess={lastTicket ? rerunLatestTicket : undefined}
                processing={reprocessing}
              />
            </div>

            {/* COL 1-8: ESCALATION QUEUE TABLE */}
            <div className="xl:col-span-8">
              <AnalyticsSection />
            </div>

            {/* COL 9-12: CHARTS & INFRA */}
            <div className="xl:col-span-4 space-y-6">
              <InferenceVolumeChart />
              
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs text-slate-500">APP ACCURACY</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">92.4%</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs text-slate-500">ESCALATION RATE</p>
                  <p className="mt-2 text-2xl font-bold text-red-600">4.1%</p>
                </div>
              </div>

              <LiveInfrastructure />
            </div>

            {/* COL 1-12: KNOWLEDGE BASE */}
            <div className="xl:col-span-12">
              <KnowledgeBaseAssets />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
