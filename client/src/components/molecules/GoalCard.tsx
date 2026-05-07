import { formatBRL } from '../../utils/finance'
import type { SavingsGoal } from '../../types/finance'
import { Trash2, Pencil } from 'lucide-react'

interface GoalCardProps {
  goal: SavingsGoal
  onDelete: (id: string) => void
  onEdit: (goal: SavingsGoal) => void
}

function fmtDate(d: string): string {
  return new Date(d + (d.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('pt-BR')
}

export function GoalCard({ goal, onDelete, onEdit }: GoalCardProps) {
  const percent = goal.target_amount > 0
    ? Math.min(100, (goal.current_amount / goal.target_amount) * 100)
    : 0

  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000)
    : null

  const performance = (() => {
    if (goal.previous_amount === null || goal.previous_amount === undefined) return null
    if (goal.previous_amount === 0) return null
    return Math.round(((goal.current_amount - goal.previous_amount) / goal.previous_amount) * 100)
  })()

  const perfColor = performance === null
    ? ''
    : performance > 0
      ? 'text-wise-positive bg-[#e2f6d5]'
      : performance === 0
        ? 'text-wise-warm-dark bg-wise-light-surface'
        : 'text-wise-danger bg-[#fdecea]'

  const nextUpdateOverdue = goal.next_update_date
    ? new Date(goal.next_update_date + 'T00:00:00').getTime() < Date.now()
    : false

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-semibold text-wise-black truncate">{goal.name}</span>
          {daysLeft !== null && (
            <span className={`text-xs ${daysLeft < 30 ? 'text-wise-danger' : 'text-wise-gray'}`}>
              {daysLeft > 0 ? `${daysLeft} dias restantes` : daysLeft === 0 ? 'Vence hoje' : 'Vencido'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(goal)}
            className="text-wise-gray hover:text-wise-black transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="text-wise-gray hover:text-wise-danger transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs">
          <span className="num text-wise-positive font-medium">{formatBRL(goal.current_amount)}</span>
          <span className="num text-wise-gray">{formatBRL(goal.target_amount)}</span>
        </div>
        <div className="h-2 bg-wise-light-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-wise-green rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-wise-gray">{percent.toFixed(0)}% concluído</span>
          {performance !== null && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${perfColor}`}>
              {performance > 0 ? `+${performance}%` : `${performance}%`}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 pt-1 border-t border-wise-light-surface">
        {goal.updated_at && (
          <span className="text-xs text-wise-gray">
            Atualizado em: <span className="font-medium">{fmtDate(goal.updated_at)}</span>
          </span>
        )}
        {goal.next_update_date && (
          <span className={`text-xs ${nextUpdateOverdue ? 'text-wise-danger' : 'text-wise-gray'}`}>
            Atualizar em: <span className="font-medium">{fmtDate(goal.next_update_date)}</span>
            {nextUpdateOverdue && ' · atrasado'}
          </span>
        )}
      </div>
    </div>
  )
}
