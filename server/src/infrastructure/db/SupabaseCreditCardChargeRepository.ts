import type { SupabaseClient } from '@supabase/supabase-js'
import type { ICreditCardChargeRepository } from '../../domain/ports/ICreditCardChargeRepository.js'
import type { CreditCardCharge } from '../../domain/entities/CreditCardCharge.js'

export class SupabaseCreditCardChargeRepository implements ICreditCardChargeRepository {
  constructor(private client: SupabaseClient) {}

  async findByCardAndUser(cardId: string, userId: string): Promise<CreditCardCharge[]> {
    const { data, error } = await this.client
      .from('credit_card_charges')
      .select('*')
      .eq('credit_card_id', cardId)
      .eq('user_id', userId)
      .order('purchase_date', { ascending: false })
    if (error) throw error
    return data
  }

  async findAllByUser(userId: string): Promise<CreditCardCharge[]> {
    const { data, error } = await this.client
      .from('credit_card_charges')
      .select('*')
      .eq('user_id', userId)
      .order('purchase_date', { ascending: false })
    if (error) throw error
    return data
  }

  async create(data: Omit<CreditCardCharge, 'id' | 'created_at'>): Promise<CreditCardCharge> {
    const { data: row, error } = await this.client
      .from('credit_card_charges')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return row
  }

  async update(id: string, userId: string, data: Partial<Pick<CreditCardCharge, 'purchase_date' | 'amount' | 'description' | 'category_id' | 'installments'>>): Promise<CreditCardCharge> {
    const { data: row, error } = await this.client
      .from('credit_card_charges')
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
      .from('credit_card_charges')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw error
  }
}
