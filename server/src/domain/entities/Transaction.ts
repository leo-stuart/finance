import type { TransactionType } from './Category.js'

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
