import { formatBRL } from '../../utils/finance'
import type { SavingsGoal } from '../../types/finance'
import { Trash2 } from 'lucide-react'

interface GoalCardProps {
  goal: SavingsGoal
  onDelete: (id: string) => void
  onUpdateAmount: (id: string, amount: number) => void
}

export function GoalCard({ goal, onDelete, onUpdateAmount }: GoalCardProps) {
  const percent = goal.target_amount > 0
    ? Math.min(100, (goal.current_amount / goal.target_amount) * 100)
    : 0

  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000)
    : null

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
        <button
          onClick={() => onDelete(goal.id)}
          className="text-wise-gray hover:text-wise-danger transition-colors shrink-0"
        >
          <Trash2 size={14} />
        </button>
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
        <div className="flex justify-between items-center">
          <span className="text-xs text-wise-gray">{percent.toFixed(0)}% concluído</span>
          <button
            onClick={() => {
              const v = prompt('Atualizar valor poupado (R$):')
              if (v) {
                const n = parseFloat(v.replace(',', '.'))
                if (!isNaN(n)) onUpdateAmount(goal.id, n)
              }
            }}
            className="text-xs text-wise-positive font-semibold hover:underline"
          >
            Atualizar
          </button>
        </div>
      </div>
    </div>
  )
}
