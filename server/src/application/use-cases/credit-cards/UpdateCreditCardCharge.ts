import type { ICreditCardChargeRepository } from '../../../domain/ports/ICreditCardChargeRepository.js'
import type { CreditCardCharge } from '../../../domain/entities/CreditCardCharge.js'
import { UpdateCreditCardChargeSchema, type UpdateCreditCardChargeDto } from '../../dtos/CreditCardDto.js'

export class UpdateCreditCardCharge {
  constructor(private repo: ICreditCardChargeRepository) {}

  async execute(id: string, userId: string, dto: UpdateCreditCardChargeDto): Promise<CreditCardCharge> {
    const data = UpdateCreditCardChargeSchema.parse(dto)
    return this.repo.update(id, userId, data)
  }
}
