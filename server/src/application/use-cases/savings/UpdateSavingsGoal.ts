import type { ISavingsRepository } from '../../../domain/ports/ISavingsRepository.js'
import type { SavingsGoal } from '../../../domain/entities/SavingsGoal.js'
import { UpdateSavingsGoalSchema, type UpdateSavingsGoalDto } from '../../dtos/SavingsDto.js'

export class UpdateSavingsGoal {
  constructor(private repo: ISavingsRepository) {}

  async execute(id: string, userId: string, dto: UpdateSavingsGoalDto): Promise<SavingsGoal> {
    const data = UpdateSavingsGoalSchema.parse(dto)
    return this.repo.update(id, userId, data)
  }
}
