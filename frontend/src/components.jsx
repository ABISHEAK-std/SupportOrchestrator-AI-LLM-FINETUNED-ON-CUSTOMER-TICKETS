import { AlertCircle, CheckCircle2 } from 'lucide-react'

export function Card({ children, className = '', title, subtitle, actions }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {(title || subtitle || actions) && (
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-800">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  onClick,
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60'
  const styles = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-300',
    danger: 'border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 focus:ring-rose-300',
  }

  return (
    <button type={type} className={`${base} ${styles[variant]} ${className}`} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

export function Badge({ children, tone = 'default' }) {
  const tones = {
    default: 'border-slate-200 bg-slate-100 text-slate-700',
    info: 'border-sky-200 bg-sky-100 text-sky-700',
    success: 'border-emerald-200 bg-emerald-100 text-emerald-700',
    warning: 'border-amber-200 bg-amber-100 text-amber-700',
    danger: 'border-rose-200 bg-rose-100 text-rose-700',
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Metric({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  )
}

export function ProgressBar({ value }) {
  const normalized = Math.max(0, Math.min(100, value))
  return (
    <div className="h-2 rounded-full bg-slate-100">
      <div className="h-2 rounded-full bg-sky-500 transition-all" style={{ width: `${normalized}%` }} />
    </div>
  )
}

export function ErrorBox({ message }) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  )
}

export function SuccessBox({ message }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
      <div className="flex items-start gap-2">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  )
}

export function HealthIndicator({ isHealthy, loading }) {
  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-500">
        <span className="h-2 w-2 animate-pulse rounded-full bg-slate-300" />
        Checking
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm">
      <span className={`h-2 w-2 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      <span className={isHealthy ? 'text-emerald-700' : 'text-rose-700'}>{isHealthy ? 'Healthy' : 'Offline'}</span>
    </div>
  )
}

export function LoadingSpinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
}
