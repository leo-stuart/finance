import { useMemo } from 'react'
import { TransactionRow } from '../molecules/TransactionRow'
import { MobileDayRow } from '../molecules/MobileDayRow'
import { MonthSummary } from './MonthSummary'
import { computeMonthDays, MONTHS_PT, formatBRL } from '../../utils/finance'
import type { Transaction, InvoiceOverlay } from '../../types/finance'

interface MonthColumnProps {
  year: number
  month: number
  transactions: Transaction[]
  startingBalance: number
  invoiceOverlays?: InvoiceOverlay[]
  onCellClick: (date: string, type: 'income' | 'expense' | 'savings') => void
}

export function MonthColumn({ year, month, transactions, startingBalance, invoiceOverlays = [], onCellClick }: MonthColumnProps) {
  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

  const days = useMemo(
    () => computeMonthDays(year, month, transactions, invoiceOverlays),
    [year, month, transactions, invoiceOverlays],
  )

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const totalSavings = transactions.filter(t => t.type === 'savings').reduce((s, t) => s + t.amount, 0)
  const totalCreditCard = days.reduce((s, d) => s + d.creditCardInvoice, 0)
  const endingBalance = startingBalance + totalIncome - totalExpense - totalSavings - totalCreditCard

  const handleCellClick = (day: number, type: 'income' | 'expense' | 'savings') => {
    const m = String(month + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    onCellClick(`${year}-${m}-${d}`, type)
  }

  return (
    <div>
      {/* Month info bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-wise-bg/60 border-b border-wise-light-surface">
        <div className="flex items-center gap-2">
          <span className="font-black text-wise-black" style={{ fontSize: '20px', lineHeight: '0.9' }}>
            {MONTHS_PT[month]}
          </span>
          {isCurrentMonth && (
            <span className="text-xs font-semibold text-wise-dark-green bg-wise-green px-2 py-0.5 rounded-full">
              Mês atual
            </span>
          )}
        </div>
        <div className="flex gap-3 md:gap-6 text-xs md:text-sm">
          <span className="text-wise-gray">
            <span className="hidden sm:inline">Inicial: </span>
            <span className="num font-semibold text-wise-black">{formatBRL(startingBalance)}</span>
          </span>
          <span className="text-wise-gray">
            <span className="hidden sm:inline">Final: </span>
            <span className={`num font-semibold ${endingBalance >= 0 ? 'text-wise-positive' : 'text-wise-danger'}`}>
              {formatBRL(endingBalance)}
            </span>
          </span>
        </div>
      </div>

      {/* Column headers — desktop only */}
      <div className="hidden md:grid spreadsheet-grid border-b border-wise-light-surface bg-wise-bg/60">
        <div className="px-2 py-2.5 text-center text-[10px] font-bold text-wise-gray uppercase tracking-wide">Dia</div>
        <div className="px-5 py-2.5 text-right text-[10px] font-bold text-wise-positive uppercase tracking-wide">Entrada</div>
        <div className="px-5 py-2.5 text-right text-[10px] font-bold text-wise-danger uppercase tracking-wide">Saída</div>
        <div className="px-5 py-2.5 text-right text-[10px] font-bold text-[#0369a1] uppercase tracking-wide">Poupança</div>
        <div className="px-5 py-2.5 text-right text-[10px] font-bold text-wise-gray uppercase tracking-wide">Diário</div>
        <div className="px-5 py-2.5 text-right text-[10px] font-bold text-wise-gray uppercase tracking-wide">Saldo</div>
      </div>

      {/* Day rows */}
      {days.map(dayData => {
        const m = String(month + 1).padStart(2, '0')
        const d = String(dayData.day).padStart(2, '0')
        const dateStr = `${year}-${m}-${d}`
        const dayInvoices = invoiceOverlays.filter(o => o.date === dateStr)
        const isToday = isCurrentMonth && today.getDate() === dayData.day
        return (
          <div key={dayData.day}>
            {/* Desktop row */}
            <TransactionRow
              data={dayData}
              monthStartBalance={startingBalance}
              isToday={isToday}
              invoices={dayInvoices}
              onCellClick={handleCellClick}
            />
            {/* Mobile row */}
            <MobileDayRow
              data={dayData}
              year={year}
              month={month}
              monthStartBalance={startingBalance}
              isToday={isToday}
              invoices={dayInvoices}
              onCellClick={handleCellClick}
            />
          </div>
        )
      })}

      {/* Desktop summary */}
      <MonthSummary
        totalIncome={totalIncome}
        totalExpense={totalExpense + totalCreditCard}
        totalSavings={totalSavings}
        startingBalance={startingBalance}
        endingBalance={endingBalance}
      />

      {/* Mobile summary */}
      <div className="md:hidden px-4 py-4 bg-wise-light-surface/40 border-t-2 border-wise-black/10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-wise-gray mb-0.5">Entradas</div>
            <div className="num font-semibold text-wise-positive text-sm">{formatBRL(totalIncome)}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-wise-gray mb-0.5">Saídas</div>
            <div className="num font-semibold text-wise-danger text-sm">{formatBRL(totalExpense + totalCreditCard)}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-wise-gray mb-0.5">Poupança</div>
            <div className="num font-semibold text-[#0369a1] text-sm">{formatBRL(totalSavings)}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-wise-gray mb-0.5">Saldo Final</div>
            <div className={`num font-semibold text-sm ${endingBalance >= 0 ? 'text-wise-black' : 'text-wise-danger'}`}>
              {formatBRL(endingBalance)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
