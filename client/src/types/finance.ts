export type TransactionType = 'income' | 'expense' | 'savings'

export interface Category {
  id: string
  user_id: string
  name: string
  type: TransactionType
  color: string
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  date: string
  amount: number
  type: TransactionType
  category_id: string | null
  description: string
  created_at: string
}

export interface SavingsGoal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string | null
  created_at: string
}

export interface DayData {
  day: number
  income: number
  expense: number
  savings: number
  cumulativeNet: number
  transactions: Transaction[]
}
