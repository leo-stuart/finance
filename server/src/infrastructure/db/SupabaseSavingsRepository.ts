import type { SupabaseClient } from '@supabase/supabase-js'
import type { ISavingsRepository } from '../../domain/ports/ISavingsRepository.js'
import type { SavingsGoal } from '../../domain/entities/SavingsGoal.js'

export class SupabaseSavingsRepository implements ISavingsRepository {
  constructor(private client: SupabaseClient) {}

  async findAllByUser(userId: string): Promise<SavingsGoal[]> {
    const { data, error } = await this.client
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at')
    if (error) throw error
    return data
  }

  async create(data: Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at'>): Promise<SavingsGoal> {
    const { data: row, error } = await this.client
      .from('savings_goals')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return row
  }

  async update(id: string, userId: string, data: Partial<Pick<SavingsGoal, 'name' | 'target_amount' | 'current_amount' | 'previous_amount' | 'deadline' | 'next_update_date'>>): Promise<SavingsGoal> {
    const { data: row, error } = await this.client
      .from('savings_goals')
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
      .from('savings_goals')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw error
  }
}
