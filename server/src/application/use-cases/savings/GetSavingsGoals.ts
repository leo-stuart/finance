import type { ISavingsRepository } from '../../../domain/ports/ISavingsRepository.js'
import type { SavingsGoal } from '../../../domain/entities/SavingsGoal.js'

export class GetSavingsGoals {
  constructor(private repo: ISavingsRepository) {}

  execute(userId: string): Promise<SavingsGoal[]> {
    return this.repo.findAllByUser(userId)
  }
}
