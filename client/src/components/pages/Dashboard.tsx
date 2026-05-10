import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SummaryCards } from '../organisms/SummaryCards'
import { MonthlyChart } from '../organisms/MonthlyChart'
import { CategoryChart } from '../organisms/CategoryChart'
import { SavingsGoals } from '../organisms/SavingsGoals'
import { Spinner } from '../atoms/Spinner'
import { useTransactions } from '../../hooks/useTransactions'
import { useCategories } from '../../hooks/useCategories'
import { useSavings } from '../../hooks/useSavings'
import { useCreditCards } from '../../hooks/useCreditCards'
import { useAllCreditCardCharges } from '../../hooks/useCreditCardCharges'
import { computeYearInvoices } from '../../utils/creditCards'

export function Dashboard() {
  const [year, setYear] = useState(new Date().getFullYear())
  const { transactions, loading } = useTransactions(year)
  const { categories } = useCategories()
  const { goals, add: addGoal, remove: removeGoal, update: updateGoal } = useSavings()
  const { cards } = useCreditCards()
  const { charges } = useAllCreditCardCharges()
  const invoiceOverlays = useMemo(
    () => computeYearInvoices(charges, cards, year),
    [charges, cards, year],
  )

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-6 py-4 flex items-center justify-between border-b border-wise-light-surface bg-white sticky top-0 z-10">
        <h1 className="font-black text-wise-black" style={{ fontSize: '28px', lineHeight: '0.85' }}>
          Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setYear(y => y - 1)}
            className="w-8 h-8 rounded-full hover:bg-wise-light-surface flex items-center justify-center transition-colors text-wise-warm-dark"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="num font-semibold text-wise-black w-12 text-center">{year}</span>
          <button
            onClick={() => setYear(y => y + 1)}
            className="w-8 h-8 rounded-full hover:bg-wise-light-surface flex items-center justify-center transition-colors text-wise-warm-dark"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1 py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="p-6 flex flex-col gap-8">
          <SummaryCards transactions={transactions} invoiceOverlays={invoiceOverlays} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MonthlyChart transactions={transactions} year={year} invoiceOverlays={invoiceOverlays} />
            </div>
            <div>
              <CategoryChart transactions={transactions} categories={categories} charges={charges} cards={cards} year={year} />
            </div>
          </div>

          <SavingsGoals
            goals={goals}
            onAdd={addGoal}
            onDelete={removeGoal}
            onUpdate={async (id, data) => updateGoal(id, data)}
          />
        </div>
      )}
    </div>
  )
}
