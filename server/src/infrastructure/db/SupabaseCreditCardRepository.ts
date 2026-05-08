import type { SupabaseClient } from '@supabase/supabase-js'
import type { ICreditCardRepository } from '../../domain/ports/ICreditCardRepository.js'
import type { CreditCard } from '../../domain/entities/CreditCard.js'

export class SupabaseCreditCardRepository implements ICreditCardRepository {
  constructor(private client: SupabaseClient) {}

  async findAllByUser(userId: string): Promise<CreditCard[]> {
    const { data, error } = await this.client
      .from('credit_cards')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true })
    if (error) throw error
    return data
  }

  async create(data: Omit<CreditCard, 'id' | 'created_at'>): Promise<CreditCard> {
    const { data: row, error } = await this.client
      .from('credit_cards')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return row
  }

  async update(id: string, userId: string, data: Partial<Pick<CreditCard, 'name' | 'closing_day' | 'due_day' | 'limit_amount' | 'color'>>): Promise<CreditCard> {
    const { data: row, error } = await this.client
      .from('credit_cards')
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
      .from('credit_cards')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw error
  }
}
