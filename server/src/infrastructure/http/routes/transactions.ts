import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware, type AuthVariables } from '../middleware/auth.js'
import { GetTransactions } from '../../../application/use-cases/transactions/GetTransactions.js'
import { CreateTransaction } from '../../../application/use-cases/transactions/CreateTransaction.js'
import { UpdateTransaction } from '../../../application/use-cases/transactions/UpdateTransaction.js'
import { DeleteTransaction } from '../../../application/use-cases/transactions/DeleteTransaction.js'
import { GetTransactionsSchema, CreateTransactionSchema, UpdateTransactionSchema } from '../../../application/dtos/TransactionDto.js'
import type { ITransactionRepository } from '../../../domain/ports/ITransactionRepository.js'

export function transactionsRouter(repo: ITransactionRepository) {
  const app = new Hono<{ Variables: AuthVariables }>()
  const getTransactions = new GetTransactions(repo)
  const createTransaction = new CreateTransaction(repo)
  const updateTransaction = new UpdateTransaction(repo)
  const deleteTransaction = new DeleteTransaction(repo)

  app.use('*', authMiddleware)

  app.get('/', zValidator('query', GetTransactionsSchema), async (c) => {
    const { year } = c.req.valid('query')
    const data = await getTransactions.execute(c.get('userId'), year)
    return c.json(data)
  })

  app.post('/', zValidator('json', CreateTransactionSchema), async (c) => {
    const dto = c.req.valid('json')
    const data = await createTransaction.execute(c.get('userId'), dto)
    return c.json(data, 201)
  })

  app.patch('/:id', zValidator('json', UpdateTransactionSchema), async (c) => {
    const dto = c.req.valid('json')
    const data = await updateTransaction.execute(c.req.param('id'), c.get('userId'), dto)
    return c.json(data)
  })

  app.delete('/:id', async (c) => {
    await deleteTransaction.execute(c.req.param('id'), c.get('userId'))
    return c.json({ success: true })
  })

  return app
}
