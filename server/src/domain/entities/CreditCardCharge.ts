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
