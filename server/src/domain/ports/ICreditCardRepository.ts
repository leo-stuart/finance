import type { CreditCard } from '../entities/CreditCard.js'

export interface ICreditCardRepository {
  findAllByUser(userId: string): Promise<CreditCard[]>
  create(data: Omit<CreditCard, 'id' | 'created_at'>): Promise<CreditCard>
  update(id: string, userId: string, data: Partial<Pick<CreditCard, 'name' | 'closing_day' | 'due_day' | 'limit_amount' | 'color'>>): Promise<CreditCard>
  delete(id: string, userId: string): Promise<void>
}
