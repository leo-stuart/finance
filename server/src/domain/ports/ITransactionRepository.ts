import type { Transaction } from '../entities/Transaction.js'

export interface ITransactionRepository {
  findByUserAndYear(userId: string, year: number): Promise<Transaction[]>
  create(data: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction>
  update(id: string, userId: string, data: Partial<Pick<Transaction, 'amount' | 'type' | 'category_id' | 'description' | 'date'>>): Promise<Transaction>
  delete(id: string, userId: string): Promise<void>
}
