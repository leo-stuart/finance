import type { ITransactionRepository } from '../../../domain/ports/ITransactionRepository.js'

export class DeleteTransaction {
  constructor(private repo: ITransactionRepository) {}

  execute(id: string, userId: string): Promise<void> {
    return this.repo.delete(id, userId)
  }
}
