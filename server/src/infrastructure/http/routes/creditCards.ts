import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware, type AuthVariables } from '../middleware/auth.js'
import { GetCreditCards } from '../../../application/use-cases/credit-cards/GetCreditCards.js'
import { CreateCreditCard } from '../../../application/use-cases/credit-cards/CreateCreditCard.js'
import { UpdateCreditCard } from '../../../application/use-cases/credit-cards/UpdateCreditCard.js'
import { DeleteCreditCard } from '../../../application/use-cases/credit-cards/DeleteCreditCard.js'
import { GetCreditCardCharges } from '../../../application/use-cases/credit-cards/GetCreditCardCharges.js'
import { CreateCreditCardCharge } from '../../../application/use-cases/credit-cards/CreateCreditCardCharge.js'
import { UpdateCreditCardCharge } from '../../../application/use-cases/credit-cards/UpdateCreditCardCharge.js'
import { DeleteCreditCardCharge } from '../../../application/use-cases/credit-cards/DeleteCreditCardCharge.js'
import {
  CreateCreditCardSchema,
  UpdateCreditCardSchema,
  CreateCreditCardChargeSchema,
  UpdateCreditCardChargeSchema,
} from '../../../application/dtos/CreditCardDto.js'
import type { ICreditCardRepository } from '../../../domain/ports/ICreditCardRepository.js'
import type { ICreditCardChargeRepository } from '../../../domain/ports/ICreditCardChargeRepository.js'

export function creditCardsRouter(cardRepo: ICreditCardRepository, chargeRepo: ICreditCardChargeRepository) {
  const app = new Hono<{ Variables: AuthVariables }>()

  const getCards = new GetCreditCards(cardRepo)
  const createCard = new CreateCreditCard(cardRepo)
  const updateCard = new UpdateCreditCard(cardRepo)
  const deleteCard = new DeleteCreditCard(cardRepo)
  const getCharges = new GetCreditCardCharges(chargeRepo)
  const createCharge = new CreateCreditCardCharge(chargeRepo)
  const updateCharge = new UpdateCreditCardCharge(chargeRepo)
  const deleteCharge = new DeleteCreditCardCharge(chargeRepo)

  app.use('*', authMiddleware)

  // Card CRUD
  app.get('/', async (c) => {
    console.log('[credit-cards] GET / userId:', c.get('userId'))
    try {
      const data = await getCards.execute(c.get('userId'))
      console.log('[credit-cards] GET / ok, count:', data.length)
      return c.json(data)
    } catch (err) {
      console.error('[credit-cards] GET / error:', err)
      throw err
    }
  })

  app.post('/', zValidator('json', CreateCreditCardSchema), async (c) => {
    const dto = c.req.valid('json')
    console.log('[credit-cards] POST / userId:', c.get('userId'), 'dto:', dto)
    try {
      const data = await createCard.execute(c.get('userId'), dto)
      console.log('[credit-cards] POST / ok:', data.id)
      return c.json(data, 201)
    } catch (err) {
      console.error('[credit-cards] POST / error:', err)
      throw err
    }
  })

  app.patch('/:id', zValidator('json', UpdateCreditCardSchema), async (c) => {
    const dto = c.req.valid('json')
    const data = await updateCard.execute(c.req.param('id'), c.get('userId'), dto)
    return c.json(data)
  })

  app.delete('/:id', async (c) => {
    await deleteCard.execute(c.req.param('id'), c.get('userId'))
    return c.json({ success: true })
  })

  // Charges per card
  app.get('/:cardId/charges', async (c) => {
    const data = await getCharges.executeByCard(c.req.param('cardId'), c.get('userId'))
    return c.json(data)
  })

  app.post('/:cardId/charges', zValidator('json', CreateCreditCardChargeSchema), async (c) => {
    const dto = c.req.valid('json')
    const data = await createCharge.execute(c.get('userId'), c.req.param('cardId'), dto)
    return c.json(data, 201)
  })

  return app
}

export function creditCardChargesRouter(chargeRepo: ICreditCardChargeRepository) {
  const app = new Hono<{ Variables: AuthVariables }>()

  const getCharges = new GetCreditCardCharges(chargeRepo)
  const updateCharge = new UpdateCreditCardCharge(chargeRepo)
  const deleteCharge = new DeleteCreditCardCharge(chargeRepo)

  app.use('*', authMiddleware)

  // All user charges (for spreadsheet overlay)
  app.get('/', async (c) => {
    const data = await getCharges.executeAll(c.get('userId'))
    return c.json(data)
  })

  app.patch('/:id', zValidator('json', UpdateCreditCardChargeSchema), async (c) => {
    const dto = c.req.valid('json')
    const data = await updateCharge.execute(c.req.param('id'), c.get('userId'), dto)
    return c.json(data)
  })

  app.delete('/:id', async (c) => {
    await deleteCharge.execute(c.req.param('id'), c.get('userId'))
    return c.json({ success: true })
  })

  return app
}
