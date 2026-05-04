import { Plus } from 'lucide-react'
import { formatBRL } from '../../utils/finance'
import { COL_WIDTHS } from '../organisms/MonthColumn'
import type { DayData } from '../../types/finance'

interface TransactionRowProps {
  data: DayData
  monthStartBalance: number
  isToday: boolean
  onCellClick: (day: number, type: 'income' | 'expense' | 'savings') => void
}

export function TransactionRow({ data, monthStartBalance, isToday, onCellClick }: TransactionRowProps) {
  const { day, income, expense, savings, cumulativeNet } = data
  const hasActivity = income > 0 || expense > 0 || savings > 0
  const absoluteBalance = monthStartBalance + cumulativeNet

  const py = hasActivity ? 'py-3' : 'py-1.5'

  return (
    <div
      className={`
        grid border-b border-wise-light-surface/50 group
        ${isToday ? 'bg-[rgba(159,232,112,0.05)]' : 'hover:bg-wise-bg/80'}
        transition-colors duration-100
      `}
      style={{ gridTemplateColumns: COL_WIDTHS }}
    >
      {/* Day */}
      <div className={`flex items-center justify-center ${py}`}>
        <span
          className={`
            text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full
            ${isToday
              ? 'bg-wise-green text-wise-dark-green'
              : hasActivity
              ? 'text-wise-black'
              : 'text-wise-gray/60'}
          `}
        >
          {day}
        </span>
      </div>

      {/* Income */}
      <div
        className={`px-5 ${py} flex items-center justify-end cursor-pointer hover:bg-wise-mint/40 transition-colors`}
        onClick={() => onCellClick(day, 'income')}
        title="Adicionar entrada"
      >
        {income > 0 ? (
          <span className="num font-semibold text-wise-positive text-sm">{formatBRL(income)}</span>
        ) : (
          <Plus
            size={13}
            className="text-wise-light-surface opacity-0 group-hover:opacity-60 transition-opacity"
          />
        )}
      </div>

      {/* Expense */}
      <div
        className={`px-5 ${py} flex items-center justify-end cursor-pointer hover:bg-[rgba(208,50,56,0.06)] transition-colors`}
        onClick={() => onCellClick(day, 'expense')}
        title="Adicionar saída"
      >
        {expense > 0 ? (
          <span className="num font-semibold text-sm">
            <span className="bg-[rgba(208,50,56,0.1)] text-wise-danger px-2 py-0.5 rounded-md">
              {formatBRL(expense)}
            </span>
          </span>
        ) : (
          <Plus
            size={13}
            className="text-wise-light-surface opacity-0 group-hover:opacity-60 transition-opacity"
          />
        )}
      </div>

      {/* Savings */}
      <div
        className={`px-5 ${py} flex items-center justify-end cursor-pointer hover:bg-[rgba(3,105,161,0.06)] transition-colors`}
        onClick={() => onCellClick(day, 'savings')}
        title="Adicionar poupança"
      >
        {savings > 0 ? (
          <span className="num font-semibold text-[#0369a1] text-sm bg-[rgba(3,105,161,0.1)] px-2 py-0.5 rounded-md">
            {formatBRL(savings)}
          </span>
        ) : (
          <Plus
            size={13}
            className="text-wise-light-surface opacity-0 group-hover:opacity-60 transition-opacity"
          />
        )}
      </div>

      {/* Cumulative net (Diário) — only show on rows with activity */}
      <div className={`px-5 ${py} flex items-center justify-end`}>
        {hasActivity && (
          <span
            className={`num text-sm ${
              cumulativeNet > 0 ? 'text-wise-positive' :
              cumulativeNet < 0 ? 'text-wise-danger' :
              'text-wise-gray'
            }`}
          >
            {formatBRL(cumulativeNet)}
          </span>
        )}
      </div>

      {/* Absolute balance (Saldo) */}
      <div className={`px-5 ${py} flex items-center justify-end`}>
        {(hasActivity || absoluteBalance !== monthStartBalance) && (
          <span
            className={`num font-semibold text-sm ${
              absoluteBalance > 0 ? 'text-wise-black' :
              absoluteBalance < 0 ? 'text-wise-danger' :
              'text-wise-gray'
            }`}
          >
            {formatBRL(absoluteBalance)}
          </span>
        )}
      </div>
    </div>
  )
}
