import type { ICategoryRepository } from '../../../domain/ports/ICategoryRepository.js'
import type { Category } from '../../../domain/entities/Category.js'

export class GetCategories {
  constructor(private repo: ICategoryRepository) {}

  execute(userId: string): Promise<Category[]> {
    return this.repo.findAllByUser(userId)
  }
}
