import type { ICreditCardChargeRepository } from '../../../domain/ports/ICreditCardChargeRepository.js'
import type { CreditCardCharge } from '../../../domain/entities/CreditCardCharge.js'
import { CreateCreditCardChargeSchema, type CreateCreditCardChargeDto } from '../../dtos/CreditCardDto.js'

export class CreateCreditCardCharge {
  constructor(private repo: ICreditCardChargeRepository) {}

  async execute(userId: string, cardId: string, dto: CreateCreditCardChargeDto): Promise<CreditCardCharge> {
    const data = CreateCreditCardChargeSchema.parse(dto)
    return this.repo.create({
      ...data,
      user_id: userId,
      credit_card_id: cardId,
      description: data.description ?? '',
      category_id: data.category_id ?? null,
      installments: data.installments ?? 1,
    })
  }
}
