import type { ITransactionRepository } from '../../../domain/ports/ITransactionRepository.js'
import type { Transaction } from '../../../domain/entities/Transaction.js'
import { CreateTransactionSchema, type CreateTransactionDto } from '../../dtos/TransactionDto.js'

export class CreateTransaction {
  constructor(private repo: ITransactionRepository) {}

  async execute(userId: string, dto: CreateTransactionDto): Promise<Transaction> {
    const data = CreateTransactionSchema.parse(dto)
    return this.repo.create({
      ...data,
      user_id: userId,
      description: data.description ?? '',
      category_id: data.category_id ?? null,
    })
  }
}
