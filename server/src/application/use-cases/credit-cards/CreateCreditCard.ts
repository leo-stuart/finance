import type { ICreditCardRepository } from '../../../domain/ports/ICreditCardRepository.js'
import type { CreditCard } from '../../../domain/entities/CreditCard.js'
import { CreateCreditCardSchema, type CreateCreditCardDto } from '../../dtos/CreditCardDto.js'

export class CreateCreditCard {
  constructor(private repo: ICreditCardRepository) {}

  async execute(userId: string, dto: CreateCreditCardDto): Promise<CreditCard> {
    const data = CreateCreditCardSchema.parse(dto)
    return this.repo.create({
      ...data,
      user_id: userId,
      limit_amount: data.limit_amount ?? null,
      color: data.color ?? '#9fe870',
    })
  }
}
