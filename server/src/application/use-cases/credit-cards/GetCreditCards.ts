import type { ICreditCardRepository } from '../../../domain/ports/ICreditCardRepository.js'
import type { CreditCard } from '../../../domain/entities/CreditCard.js'

export class GetCreditCards {
  constructor(private repo: ICreditCardRepository) {}

  execute(userId: string): Promise<CreditCard[]> {
    return this.repo.findAllByUser(userId)
  }
}
