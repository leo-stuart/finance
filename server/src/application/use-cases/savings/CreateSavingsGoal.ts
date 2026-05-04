import type { ISavingsRepository } from '../../../domain/ports/ISavingsRepository.js'
import type { SavingsGoal } from '../../../domain/entities/SavingsGoal.js'
import { CreateSavingsGoalSchema, type CreateSavingsGoalDto } from '../../dtos/SavingsDto.js'

export class CreateSavingsGoal {
  constructor(private repo: ISavingsRepository) {}

  async execute(userId: string, dto: CreateSavingsGoalDto): Promise<SavingsGoal> {
    const data = CreateSavingsGoalSchema.parse(dto)
    return this.repo.create({ ...data, user_id: userId, deadline: data.deadline ?? null })
  }
}
