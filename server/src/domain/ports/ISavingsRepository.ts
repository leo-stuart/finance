import type { SavingsGoal } from '../entities/SavingsGoal.js'

export interface ISavingsRepository {
  findAllByUser(userId: string): Promise<SavingsGoal[]>
  create(data: Omit<SavingsGoal, 'id' | 'created_at'>): Promise<SavingsGoal>
  update(id: string, userId: string, data: Partial<Pick<SavingsGoal, 'name' | 'target_amount' | 'current_amount' | 'deadline'>>): Promise<SavingsGoal>
  delete(id: string, userId: string): Promise<void>
}
