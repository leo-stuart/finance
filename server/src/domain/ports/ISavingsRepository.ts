import type { SavingsGoal } from '../entities/SavingsGoal.js'

export interface ISavingsRepository {
  findAllByUser(userId: string): Promise<SavingsGoal[]>
  create(data: Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at'>): Promise<SavingsGoal>
  update(id: string, userId: string, data: Partial<Pick<SavingsGoal, 'name' | 'target_amount' | 'current_amount' | 'previous_amount' | 'deadline' | 'next_update_date'>>): Promise<SavingsGoal>
  delete(id: string, userId: string): Promise<void>
}
