import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div
        className="flex items-center justify-center w-14 h-14 rounded-2xl"
        style={{ backgroundColor: 'var(--accent-amber-bg)' }}
      >
        <AlertTriangle className="w-6 h-6" style={{ color: 'var(--accent-amber)' }} />
      </div>
      <p
        className="text-sm text-center max-w-sm leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        {message}
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
        style={{
          backgroundColor: 'var(--bg-input)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-default)',
        }}
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Try again
      </button>
    </div>
  )
}
