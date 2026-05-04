import type { SupabaseClient } from '@supabase/supabase-js'
import type { ITransactionRepository } from '../../domain/ports/ITransactionRepository.js'
import type { Transaction } from '../../domain/entities/Transaction.js'

export class SupabaseTransactionRepository implements ITransactionRepository {
  constructor(private client: SupabaseClient) {}

  async findByUserAndYear(userId: string, year: number): Promise<Transaction[]> {
    const { data, error } = await this.client
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', `${year}-01-01`)
      .lte('date', `${year}-12-31`)
      .order('date', { ascending: true })
    if (error) throw error
    return data
  }

  async create(data: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> {
    const { data: row, error } = await this.client
      .from('transactions')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return row
  }

  async update(id: string, userId: string, data: Partial<Pick<Transaction, 'amount' | 'type' | 'category_id' | 'description' | 'date'>>): Promise<Transaction> {
    const { data: row, error } = await this.client
      .from('transactions')
      .update(data)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()
    if (error) throw error
    if (!row) throw new Error('Not found')
    return row
  }

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await this.client
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw error
  }
}
