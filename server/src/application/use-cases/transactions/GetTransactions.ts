import type { ITransactionRepository } from '../../../domain/ports/ITransactionRepository.js'
import type { Transaction } from '../../../domain/entities/Transaction.js'

export class GetTransactions {
  constructor(private repo: ITransactionRepository) {}

  execute(userId: string, year: number): Promise<Transaction[]> {
    return this.repo.findByUserAndYear(userId, year)
  }
}
