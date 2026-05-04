import { z } from 'zod'

export const CreateSavingsGoalSchema = z.object({
  name: z.string().min(1).max(100),
  target_amount: z.number().positive(),
  current_amount: z.number().min(0),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
})

export const UpdateSavingsGoalSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  target_amount: z.number().positive().optional(),
  current_amount: z.number().min(0).optional(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
}).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' })

export type CreateSavingsGoalDto = z.infer<typeof CreateSavingsGoalSchema>
export type UpdateSavingsGoalDto = z.infer<typeof UpdateSavingsGoalSchema>
