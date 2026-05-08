import type { ICreditCardRepository } from '../../../domain/ports/ICreditCardRepository.js'
import type { CreditCard } from '../../../domain/entities/CreditCard.js'
import { UpdateCreditCardSchema, type UpdateCreditCardDto } from '../../dtos/CreditCardDto.js'

export class UpdateCreditCard {
  constructor(private repo: ICreditCardRepository) {}

  async execute(id: string, userId: string, dto: UpdateCreditCardDto): Promise<CreditCard> {
    const data = UpdateCreditCardSchema.parse(dto)
    return this.repo.update(id, userId, data)
  }
}
