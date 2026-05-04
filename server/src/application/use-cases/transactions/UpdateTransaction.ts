import type { ITransactionRepository } from '../../../domain/ports/ITransactionRepository.js'
import type { Transaction } from '../../../domain/entities/Transaction.js'
import { UpdateTransactionSchema, type UpdateTransactionDto } from '../../dtos/TransactionDto.js'

export class UpdateTransaction {
  constructor(private repo: ITransactionRepository) {}

  async execute(id: string, userId: string, dto: UpdateTransactionDto): Promise<Transaction> {
    const data = UpdateTransactionSchema.parse(dto)
    return this.repo.update(id, userId, data)
  }
}
