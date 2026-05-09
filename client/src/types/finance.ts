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
  next_update_date: string | null
  previous_amount: number | null
  created_at: string
  updated_at: string
}

export interface DayData {
  day: number
  income: number
  expense: number
  savings: number
  creditCardInvoice: number
  dailyNet: number
  cumulativeNet: number
  transactions: Transaction[]
}

export interface CreditCard {
  id: string
  user_id: string
  name: string
  closing_day: number
  due_day: number
  limit_amount: number | null
  color: string
  created_at: string
}

export interface CreditCardCharge {
  id: string
  user_id: string
  credit_card_id: string
  purchase_date: string
  amount: number
  description: string
  category_id: string | null
  installments: number
  created_at: string
}

export interface InvoiceOverlay {
  date: string
  cardId: string
  cardName: string
  color: string
  amount: number
}
