import { formatBRL } from '../../utils/finance'
import type { SavingsGoal } from '../../types/finance'

interface SavingsTotalCardProps {
  goals: SavingsGoal[]
}

export function SavingsTotalCard({ goals }: SavingsTotalCardProps) {
  const totalCurrent = goals.reduce((s, g) => s + g.current_amount, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0)
  const percent = totalTarget > 0 ? Math.min(100, (totalCurrent / totalTarget) * 100) : 0

  const prevGoals = goals.filter(g => g.previous_amount != null && g.previous_amount !== 0)
  const totalCurrentPerf = prevGoals.reduce((s, g) => s + g.current_amount, 0)
  const totalPrevPerf = prevGoals.reduce((s, g) => s + g.previous_amount!, 0)
  const performance = prevGoals.length > 0
    ? Math.round(((totalCurrentPerf - totalPrevPerf) / totalPrevPerf) * 100)
    : null

  const perfColor = performance === null
    ? ''
    : performance > 0
      ? 'text-wise-positive bg-[#e2f6d5]'
      : performance === 0
        ? 'text-wise-warm-dark bg-wise-light-surface'
        : 'text-wise-danger bg-[#fdecea]'

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-wise-black">Total de Poupança</span>
          <span className="text-xs text-wise-gray">{goals.length} {goals.length === 1 ? 'meta' : 'metas'}</span>
        </div>
        {performance !== null && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${perfColor}`}>
            {performance > 0 ? `+${performance}%` : `${performance}%`}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs">
          <span className="num text-wise-positive font-medium">{formatBRL(totalCurrent)}</span>
          <span className="num text-wise-gray">{formatBRL(totalTarget)}</span>
        </div>
        <div className="h-2 bg-wise-light-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-wise-green rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs text-wise-gray">{percent.toFixed(0)}% concluído</span>
      </div>
    </div>
  )
}
