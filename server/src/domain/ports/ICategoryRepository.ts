import type { Category } from '../entities/Category.js'

export interface ICategoryRepository {
  findAllByUser(userId: string): Promise<Category[]>
  create(data: Omit<Category, 'id' | 'created_at'>): Promise<Category>
  update(id: string, userId: string, data: Partial<Pick<Category, 'name' | 'type' | 'color'>>): Promise<Category>
  delete(id: string, userId: string): Promise<void>
}
