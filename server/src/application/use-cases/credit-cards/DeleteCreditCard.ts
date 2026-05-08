import type { ICreditCardRepository } from '../../../domain/ports/ICreditCardRepository.js'

export class DeleteCreditCard {
  constructor(private repo: ICreditCardRepository) {}

  execute(id: string, userId: string): Promise<void> {
    return this.repo.delete(id, userId)
  }
}
