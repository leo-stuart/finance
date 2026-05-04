import { useMemo } from 'react'
import { TransactionRow } from '../molecules/TransactionRow'
import { MonthSummary } from './MonthSummary'
import { computeMonthDays, MONTHS_PT, formatBRL } from '../../utils/finance'
import type { Transaction } from '../../types/finance'

export const COL_WIDTHS = '52px 1fr 1fr 1fr 120px 140px'

interface MonthColumnProps {
  year: number
  month: number
  transactions: Transaction[]
  startingBalance: number
  onCellClick: (date: string, type: 'income' | 'expense' | 'savings') => void
}

export function MonthColumn({ year, month, transactions, startingBalance, onCellClick }: MonthColumnProps) {
  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

  const days = useMemo(() => computeMonthDays(year, month, transactions), [year, month, transactions])

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const totalSavings = transactions.filter(t => t.type === 'savings').reduce((s, t) => s + t.amount, 0)
  const endingBalance = startingBalance + totalIncome - totalExpense - totalSavings

  const handleCellClick = (day: number, type: 'income' | 'expense' | 'savings') => {
    const m = String(month + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    onCellClick(`${year}-${m}-${d}`, type)
  }

  return (
    <div className="w-full min-w-0">
      {/* Month info bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-wise-bg/60 border-b border-wise-light-surface">
        <span className="font-black text-wise-black" style={{ fontSize: '20px', lineHeight: '0.9' }}>
          {MONTHS_PT[month]}
          {isCurrentMonth && (
            <span className="ml-2 text-xs font-semibold text-wise-dark-green bg-wise-green px-2 py-0.5 rounded-full">
              Mês atual
            </span>
          )}
        </span>
        <div className="flex gap-6 text-sm">
          <span className="text-wise-gray">
            Saldo inicial:{' '}
            <span className="num font-semibold text-wise-black">{formatBRL(startingBalance)}</span>
          </span>
          <span className="text-wise-gray">
            Saldo final:{' '}
            <span className={`num font-semibold ${endingBalance >= 0 ? 'text-wise-positive' : 'text-wise-danger'}`}>
              {formatBRL(endingBalance)}
            </span>
          </span>
        </div>
      </div>

      {/* Column headers */}
      <div
        className="grid border-b border-wise-light-surface bg-wise-bg/60"
        style={{ gridTemplateColumns: COL_WIDTHS }}
      >
        <div className="px-2 py-2.5 text-center text-[10px] font-bold text-wise-gray uppercase tracking-wide">Dia</div>
        <div className="px-5 py-2.5 text-right text-[10px] font-bold text-wise-positive uppercase tracking-wide">Entrada</div>
        <div className="px-5 py-2.5 text-right text-[10px] font-bold text-wise-danger uppercase tracking-wide">Saída</div>
        <div className="px-5 py-2.5 text-right text-[10px] font-bold text-[#0369a1] uppercase tracking-wide">Poupança</div>
        <div className="px-5 py-2.5 text-right text-[10px] font-bold text-wise-gray uppercase tracking-wide">Diário</div>
        <div className="px-5 py-2.5 text-right text-[10px] font-bold text-wise-gray uppercase tracking-wide">Saldo</div>
      </div>

      {/* Day rows */}
      {days.map(dayData => (
        <TransactionRow
          key={dayData.day}
          data={dayData}
          monthStartBalance={startingBalance}
          isToday={isCurrentMonth && today.getDate() === dayData.day}
          onCellClick={handleCellClick}
        />
      ))}

      {/* Summary */}
      <MonthSummary
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        totalSavings={totalSavings}
        startingBalance={startingBalance}
        endingBalance={endingBalance}
      />
    </div>
  )
}
