import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MonthColumn } from '../organisms/MonthColumn'
import { TransactionModal } from '../organisms/TransactionModal'
import { Spinner } from '../atoms/Spinner'
import { useTransactions } from '../../hooks/useTransactions'
import { useCategories } from '../../hooks/useCategories'
import { useCreditCards } from '../../hooks/useCreditCards'
import { useAllCreditCardCharges } from '../../hooks/useCreditCardCharges'
import { computeStartingBalances, parseTransactionDate, MONTHS_SHORT_PT } from '../../utils/finance'
import { computeYearInvoices } from '../../utils/creditCards'

export function SpreadsheetView() {
  const currentDate = new Date()
  const [year, setYear] = useState(currentDate.getFullYear())
  const [month, setMonth] = useState(currentDate.getMonth())
  const { transactions, loading, add, update, remove } = useTransactions(year)
  const { categories } = useCategories()
  const { cards } = useCreditCards()
  const { charges } = useAllCreditCardCharges()
  const [modal, setModal] = useState<{ date: string; type: 'income' | 'expense' | 'savings' } | null>(null)

  const invoiceOverlays = useMemo(
    () => computeYearInvoices(charges, cards, year),
    [charges, cards, year],
  )

  const startingBalances = useMemo(
    () => computeStartingBalances(year, transactions, invoiceOverlays),
    [year, transactions, invoiceOverlays],
  )

  const monthTransactions = useMemo(
    () => transactions.filter(t => parseTransactionDate(t.date).month === month),
    [transactions, month],
  )

  const modalDayTransactions = useMemo(
    () => modal ? transactions.filter(t => t.date === modal.date) : [],
    [modal, transactions],
  )

  const monthHasData = useMemo(() => {
    const counts = new Array(12).fill(false)
    for (const t of transactions) {
      counts[parseTransactionDate(t.date).month] = true
    }
    for (const o of invoiceOverlays) {
      if (o.date.startsWith(String(year))) {
        const m = parseInt(o.date.slice(5, 7), 10) - 1
        if (m >= 0 && m < 12) counts[m] = true
      }
    }
    return counts
  }, [transactions, invoiceOverlays, year])

  return (
    <div className="flex flex-col h-full">
      {/* Sticky top bar */}
      <div className="sticky top-0 bg-white border-b border-wise-light-surface z-10 shadow-[0_1px_0_rgba(14,15,12,0.06)]">
        <div className="px-6 py-3 flex items-center justify-between">
          <h1 className="font-black text-wise-black" style={{ fontSize: '26px', lineHeight: '0.9' }}>
            Planilha
          </h1>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setYear(y => y - 1)}
              className="w-8 h-8 rounded-full hover:bg-wise-light-surface flex items-center justify-center text-wise-warm-dark transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="num font-semibold text-wise-black w-12 text-center text-sm">{year}</span>
            <button
              onClick={() => setYear(y => y + 1)}
              className="w-8 h-8 rounded-full hover:bg-wise-light-surface flex items-center justify-center text-wise-warm-dark transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Month tabs */}
        <div className="px-4 pb-3 flex gap-1.5 overflow-x-auto no-scrollbar">
          {MONTHS_SHORT_PT.map((name, i) => {
            const isSelected = month === i
            const isCurrent = currentDate.getMonth() === i && currentDate.getFullYear() === year
            const hasData = monthHasData[i]

            return (
              <button
                key={i}
                onClick={() => setMonth(i)}
                className={`
                  relative px-3.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap
                  transition-all duration-150 hover:scale-105 active:scale-95 select-none
                  ${isSelected
                    ? 'bg-wise-black text-white'
                    : isCurrent
                    ? 'bg-wise-green text-wise-dark-green'
                    : 'bg-wise-light-surface text-wise-warm-dark hover:bg-wise-mint'}
                `}
              >
                {name}
                {hasData && !isSelected && (
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-wise-positive rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <MonthColumn
            year={year}
            month={month}
            transactions={monthTransactions}
            startingBalance={startingBalances[month]}
            invoiceOverlays={invoiceOverlays}
            onCellClick={(date, type) => setModal({ date, type })}
          />
        </div>
      )}

      {modal && (
        <TransactionModal
          date={modal.date}
          defaultType={modal.type}
          dayTransactions={modalDayTransactions}
          categories={categories}
          onAdd={add}
          onUpdate={update}
          onDelete={remove}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
