import type { ICategoryRepository } from '../../../domain/ports/ICategoryRepository.js'
import type { Category } from '../../../domain/entities/Category.js'
import { UpdateCategorySchema, type UpdateCategoryDto } from '../../dtos/CategoryDto.js'

export class UpdateCategory {
  constructor(private repo: ICategoryRepository) {}

  async execute(id: string, userId: string, dto: UpdateCategoryDto): Promise<Category> {
    const data = UpdateCategorySchema.parse(dto)
    return this.repo.update(id, userId, data)
  }
}
