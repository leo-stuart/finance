import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react'
import { SummaryCard } from '../molecules/SummaryCard'
import type { Transaction } from '../../types/finance'

interface SummaryCardsProps {
  transactions: Transaction[]
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const totalSavings = transactions.filter(t => t.type === 'savings').reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpense - totalSavings
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
        amount={totalExpense}
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
