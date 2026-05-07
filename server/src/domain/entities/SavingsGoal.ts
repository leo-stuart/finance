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
