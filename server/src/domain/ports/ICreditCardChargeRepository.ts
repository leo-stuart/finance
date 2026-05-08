import type { CreditCardCharge } from '../entities/CreditCardCharge.js'

export interface ICreditCardChargeRepository {
  findByCardAndUser(cardId: string, userId: string): Promise<CreditCardCharge[]>
  findAllByUser(userId: string): Promise<CreditCardCharge[]>
  create(data: Omit<CreditCardCharge, 'id' | 'created_at'>): Promise<CreditCardCharge>
  update(id: string, userId: string, data: Partial<Pick<CreditCardCharge, 'purchase_date' | 'amount' | 'description' | 'category_id' | 'installments'>>): Promise<CreditCardCharge>
  delete(id: string, userId: string): Promise<void>
}
