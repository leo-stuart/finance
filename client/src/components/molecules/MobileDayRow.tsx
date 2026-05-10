import { Plus } from 'lucide-react'
import { formatBRL } from '../../utils/finance'
import type { DayData, InvoiceOverlay } from '../../types/finance'

const DOW_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

interface MobileDayRowProps {
  data: DayData
  year: number
  month: number
  monthStartBalance: number
  isToday: boolean
  invoices?: InvoiceOverlay[]
  onCellClick: (day: number, type: 'income' | 'expense' | 'savings') => void
}

export function MobileDayRow({
  data, year, month, monthStartBalance, isToday, invoices = [], onCellClick,
}: MobileDayRowProps) {
  const { day, income, expense, savings, creditCardInvoice, cumulativeNet } = data
  const absoluteBalance = monthStartBalance + cumulativeNet
  const totalExpense = expense + creditCardInvoice
  const hasActivity = income > 0 || totalExpense > 0 || savings > 0
  const dow = DOW_PT[new Date(year, month, day).getDay()]

  return (
    <div className={`md:hidden relative flex items-center px-3 border-b border-wise-light-surface/50
      ${isToday ? 'bg-[rgba(159,232,112,0.05)]' : ''}
      transition-colors active:bg-wise-bg/60`}
    >
      {isToday && (
        <div className="absolute left-0 inset-y-2 w-[3px] bg-wise-green rounded-r-full" />
      )}

      {/* Day + day-of-week */}
      <button
        className="w-10 shrink-0 flex flex-col items-center py-3 gap-0.5"
        onClick={() => onCellClick(day, 'expense')}
      >
        <span className={`font-black text-[17px] leading-none ${
          isToday       ? 'text-wise-dark-green'
          : hasActivity ? 'text-wise-black'
          :               'text-wise-gray/30'
        }`}>
          {day}
        </span>
        <span className={`text-[9px] font-bold uppercase tracking-wider ${
          isToday ? 'text-wise-dark-green' : 'text-wise-gray/40'
        }`}>
          {dow}
        </span>
      </button>

      {/* Transaction chips */}
      <div className="flex-1 flex flex-wrap items-center gap-1.5 py-2.5 px-2 min-w-0">
        {income > 0 && (
          <button
            onClick={() => onCellClick(day, 'income')}
            className="num text-[11px] font-semibold text-wise-positive bg-wise-mint px-2 py-0.5 rounded-[8px] whitespace-nowrap active:scale-95 transition-transform"
          >
            +{formatBRL(income)}
          </button>
        )}
        {totalExpense > 0 && (
          <button
            onClick={() => onCellClick(day, 'expense')}
            className="num text-[11px] font-semibold text-wise-danger bg-[rgba(208,50,56,0.1)] px-2 py-0.5 rounded-[8px] whitespace-nowrap active:scale-95 transition-transform flex items-center gap-1"
          >
            {invoices.length === 1 && (
              <span
                className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: invoices[0].color === '#9fe870' ? '#163300' : invoices[0].color }}
              />
            )}
            -{formatBRL(totalExpense)}
          </button>
        )}
        {savings > 0 && (
          <button
            onClick={() => onCellClick(day, 'savings')}
            className="num text-[11px] font-semibold text-[#0369a1] bg-[rgba(3,105,161,0.1)] px-2 py-0.5 rounded-[8px] whitespace-nowrap active:scale-95 transition-transform"
          >
            ↗{formatBRL(savings)}
          </button>
        )}
        {!hasActivity && (
          <Plus size={11} className="text-wise-light-surface/60 ml-0.5" />
        )}
      </div>

      {/* Running balance */}
      <div className={`shrink-0 rounded-[10px] px-2.5 py-1.5 min-w-[78px] text-right
        ${absoluteBalance < 0    ? 'bg-[rgba(208,50,56,0.12)]'
        : absoluteBalance < 500  ? 'bg-[rgba(134,134,133,0.09)]'
        : absoluteBalance < 1000 ? 'bg-[#e2f6d5]'
        :                          'bg-[rgba(159,232,112,0.36)]'}
        ${absoluteBalance === 0 && !hasActivity ? 'invisible' : ''}`}
      >
        <span className={`num text-[11px] font-semibold whitespace-nowrap ${
          absoluteBalance < 0    ? 'text-wise-danger'
          : absoluteBalance < 500  ? 'text-wise-gray'
          : absoluteBalance < 1000 ? 'text-wise-positive'
          :                          'text-wise-dark-green'
        }`}>
          {formatBRL(absoluteBalance)}
        </span>
      </div>
    </div>
  )
}
