import type { ICategoryRepository } from '../../../domain/ports/ICategoryRepository.js'

export class DeleteCategory {
  constructor(private repo: ICategoryRepository) {}

  execute(id: string, userId: string): Promise<void> {
    return this.repo.delete(id, userId)
  }
}
