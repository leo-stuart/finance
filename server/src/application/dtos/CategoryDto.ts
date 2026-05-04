import { z } from 'zod'

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['income', 'expense', 'savings']),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
})

export const UpdateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.enum(['income', 'expense', 'savings']).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
}).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' })

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>
