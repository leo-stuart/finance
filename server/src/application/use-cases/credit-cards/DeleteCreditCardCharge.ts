import type { ICreditCardChargeRepository } from '../../../domain/ports/ICreditCardChargeRepository.js'

export class DeleteCreditCardCharge {
  constructor(private repo: ICreditCardChargeRepository) {}

  execute(id: string, userId: string): Promise<void> {
    return this.repo.delete(id, userId)
  }
}
