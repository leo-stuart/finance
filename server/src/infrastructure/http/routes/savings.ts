import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware, type AuthVariables } from '../middleware/auth.js'
import { GetSavingsGoals } from '../../../application/use-cases/savings/GetSavingsGoals.js'
import { CreateSavingsGoal } from '../../../application/use-cases/savings/CreateSavingsGoal.js'
import { UpdateSavingsGoal } from '../../../application/use-cases/savings/UpdateSavingsGoal.js'
import { DeleteSavingsGoal } from '../../../application/use-cases/savings/DeleteSavingsGoal.js'
import { CreateSavingsGoalSchema, UpdateSavingsGoalSchema } from '../../../application/dtos/SavingsDto.js'
import type { ISavingsRepository } from '../../../domain/ports/ISavingsRepository.js'

export function savingsRouter(repo: ISavingsRepository) {
  const app = new Hono<{ Variables: AuthVariables }>()
  const getSavingsGoals = new GetSavingsGoals(repo)
  const createSavingsGoal = new CreateSavingsGoal(repo)
  const updateSavingsGoal = new UpdateSavingsGoal(repo)
  const deleteSavingsGoal = new DeleteSavingsGoal(repo)

  app.use('*', authMiddleware)

  app.get('/', async (c) => {
    const data = await getSavingsGoals.execute(c.get('userId'))
    return c.json(data)
  })

  app.post('/', zValidator('json', CreateSavingsGoalSchema), async (c) => {
    const dto = c.req.valid('json')
    const data = await createSavingsGoal.execute(c.get('userId'), dto)
    return c.json(data, 201)
  })

  app.patch('/:id', zValidator('json', UpdateSavingsGoalSchema), async (c) => {
    const dto = c.req.valid('json')
    const data = await updateSavingsGoal.execute(c.req.param('id'), c.get('userId'), dto)
    return c.json(data)
  })

  app.delete('/:id', async (c) => {
    await deleteSavingsGoal.execute(c.req.param('id'), c.get('userId'))
    return c.json({ success: true })
  })

  return app
}
