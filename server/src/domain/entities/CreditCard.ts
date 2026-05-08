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
