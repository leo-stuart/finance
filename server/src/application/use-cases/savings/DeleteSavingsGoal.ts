import type { ISavingsRepository } from '../../../domain/ports/ISavingsRepository.js'

export class DeleteSavingsGoal {
  constructor(private repo: ISavingsRepository) {}

  execute(id: string, userId: string): Promise<void> {
    return this.repo.delete(id, userId)
  }
}
