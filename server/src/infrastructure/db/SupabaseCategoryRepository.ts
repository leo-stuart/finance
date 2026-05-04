import type { SupabaseClient } from '@supabase/supabase-js'
import type { ICategoryRepository } from '../../domain/ports/ICategoryRepository.js'
import type { Category } from '../../domain/entities/Category.js'

export class SupabaseCategoryRepository implements ICategoryRepository {
  constructor(private client: SupabaseClient) {}

  async findAllByUser(userId: string): Promise<Category[]> {
    const { data, error } = await this.client
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name')
    if (error) throw error
    return data
  }

  async create(data: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const { data: row, error } = await this.client
      .from('categories')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return row
  }

  async update(id: string, userId: string, data: Partial<Pick<Category, 'name' | 'type' | 'color'>>): Promise<Category> {
    const { data: row, error } = await this.client
      .from('categories')
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
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw error
  }
}
