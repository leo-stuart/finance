import { CurrencyDisplay } from '../atoms/CurrencyDisplay'
import type { TransactionType } from '../../types/finance'

interface SummaryCardProps {
  label: string
  amount: number
  variant: TransactionType | 'neutral' | 'balance'
  icon: React.ReactNode
  subtitle?: string
}

export function SummaryCard({ label, amount, variant, icon, subtitle }: SummaryCardProps) {
  return (
    <div className="card p-5 flex flex-col gap-3 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-wise-warm-dark uppercase tracking-wide">{label}</span>
        <span className="w-8 h-8 rounded-full bg-wise-light-surface flex items-center justify-center text-wise-warm-dark">
          {icon}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <CurrencyDisplay amount={amount} variant={variant as any} size="xl" />
        {subtitle && <p className="text-xs text-wise-gray">{subtitle}</p>}
      </div>
    </div>
  )
}
