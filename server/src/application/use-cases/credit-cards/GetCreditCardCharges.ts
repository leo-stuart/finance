import type { ICreditCardChargeRepository } from '../../../domain/ports/ICreditCardChargeRepository.js'
import type { CreditCardCharge } from '../../../domain/entities/CreditCardCharge.js'

export class GetCreditCardCharges {
  constructor(private repo: ICreditCardChargeRepository) {}

  executeByCard(cardId: string, userId: string): Promise<CreditCardCharge[]> {
    return this.repo.findByCardAndUser(cardId, userId)
  }

  executeAll(userId: string): Promise<CreditCardCharge[]> {
    return this.repo.findAllByUser(userId)
  }
}
