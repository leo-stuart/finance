import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react'
import { SummaryCard } from '../molecules/SummaryCard'
import type { Transaction, InvoiceOverlay } from '../../types/finance'

interface SummaryCardsProps {
  transactions: Transaction[]
  invoiceOverlays?: InvoiceOverlay[]
}

export function SummaryCards({ transactions, invoiceOverlays = [] }: SummaryCardsProps) {
  const now = new Date()
  now.setHours(23, 59, 59, 999)
  const nowStr = now.toISOString().slice(0, 10)

  const toDate = transactions.filter(t => {
    const [y, m, d] = t.date.split('-').map(Number)
    return new Date(y, m - 1, d) <= now
  })

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const totalSavings = transactions.filter(t => t.type === 'savings').reduce((s, t) => s + t.amount, 0)
  const totalCreditCard = invoiceOverlays.reduce((s, o) => s + o.amount, 0)
  const creditCardToDate = invoiceOverlays.filter(o => o.date <= nowStr).reduce((s, o) => s + o.amount, 0)

  const balance = toDate.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    - toDate.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    - toDate.filter(t => t.type === 'savings').reduce((s, t) => s + t.amount, 0)
    - creditCardToDate
  const savingsRate = totalIncome > 0 ? ((totalSavings / totalIncome) * 100) : 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard
        label="Total Entradas"
        amount={totalIncome}
        variant="income"
        icon={<TrendingUp size={16} />}
      />
      <SummaryCard
        label="Total Saídas"
        amount={totalExpense + totalCreditCard}
        variant="expense"
        icon={<TrendingDown size={16} />}
      />
      <SummaryCard
        label="Saldo Líquido"
        amount={balance}
        variant="balance"
        icon={<Wallet size={16} />}
      />
      <SummaryCard
        label="Taxa de Poupança"
        amount={totalSavings}
        variant="savings"
        icon={<PiggyBank size={16} />}
        subtitle={`${savingsRate.toFixed(1)}% da renda`}
      />
    </div>
  )
}
