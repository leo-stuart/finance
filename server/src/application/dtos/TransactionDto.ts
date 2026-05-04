import { z } from 'zod'

export const GetTransactionsSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
})

export const CreateTransactionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount: z.number().positive(),
  type: z.enum(['income', 'expense', 'savings']),
  category_id: z.string().uuid().nullable().optional(),
  description: z.string().max(500).optional().default(''),
})

export const UpdateTransactionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  amount: z.number().positive().optional(),
  type: z.enum(['income', 'expense', 'savings']).optional(),
  category_id: z.string().uuid().nullable().optional(),
  description: z.string().max(500).optional(),
}).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' })

export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>
export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>
