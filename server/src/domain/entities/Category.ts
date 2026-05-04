export type TransactionType = 'income' | 'expense' | 'savings'

export interface Category {
  id: string
  user_id: string
  name: string
  type: TransactionType
  color: string
  created_at: string
}
