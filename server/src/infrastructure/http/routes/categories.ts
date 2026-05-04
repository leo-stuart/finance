import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware, type AuthVariables } from '../middleware/auth.js'
import { GetCategories } from '../../../application/use-cases/categories/GetCategories.js'
import { CreateCategory } from '../../../application/use-cases/categories/CreateCategory.js'
import { UpdateCategory } from '../../../application/use-cases/categories/UpdateCategory.js'
import { DeleteCategory } from '../../../application/use-cases/categories/DeleteCategory.js'
import { CreateCategorySchema, UpdateCategorySchema } from '../../../application/dtos/CategoryDto.js'
import type { ICategoryRepository } from '../../../domain/ports/ICategoryRepository.js'

export function categoriesRouter(repo: ICategoryRepository) {
  const app = new Hono<{ Variables: AuthVariables }>()
  const getCategories = new GetCategories(repo)
  const createCategory = new CreateCategory(repo)
  const updateCategory = new UpdateCategory(repo)
  const deleteCategory = new DeleteCategory(repo)

  app.use('*', authMiddleware)

  app.get('/', async (c) => {
    const data = await getCategories.execute(c.get('userId'))
    return c.json(data)
  })

  app.post('/', zValidator('json', CreateCategorySchema), async (c) => {
    const dto = c.req.valid('json')
    const data = await createCategory.execute(c.get('userId'), dto)
    return c.json(data, 201)
  })

  app.patch('/:id', zValidator('json', UpdateCategorySchema), async (c) => {
    const dto = c.req.valid('json')
    const data = await updateCategory.execute(c.req.param('id'), c.get('userId'), dto)
    return c.json(data)
  })

  app.delete('/:id', async (c) => {
    await deleteCategory.execute(c.req.param('id'), c.get('userId'))
    return c.json({ success: true })
  })

  return app
}
