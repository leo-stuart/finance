import type { ICategoryRepository } from '../../../domain/ports/ICategoryRepository.js'
import type { Category } from '../../../domain/entities/Category.js'
import { CreateCategorySchema, type CreateCategoryDto } from '../../dtos/CategoryDto.js'

export class CreateCategory {
  constructor(private repo: ICategoryRepository) {}

  async execute(userId: string, dto: CreateCategoryDto): Promise<Category> {
    const data = CreateCategorySchema.parse(dto)
    return this.repo.create({ ...data, user_id: userId })
  }
}
