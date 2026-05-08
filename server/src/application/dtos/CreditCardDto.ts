import { z } from 'zod'

export const CreateCreditCardSchema = z.object({
  name: z.string().min(1).max(100),
  closing_day: z.number().int().min(1).max(31),
  due_day: z.number().int().min(1).max(31),
  limit_amount: z.number().positive().nullable().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().default('#9fe870'),
})

export const UpdateCreditCardSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  closing_day: z.number().int().min(1).max(31).optional(),
  due_day: z.number().int().min(1).max(31).optional(),
  limit_amount: z.number().positive().nullable().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
}).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' })

export const CreateCreditCardChargeSchema = z.object({
  purchase_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount: z.number().positive(),
  description: z.string().max(500).optional().default(''),
  category_id: z.string().uuid().nullable().optional(),
  installments: z.number().int().min(1).max(48).optional().default(1),
})

export const UpdateCreditCardChargeSchema = z.object({
  purchase_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  amount: z.number().positive().optional(),
  description: z.string().max(500).optional(),
  category_id: z.string().uuid().nullable().optional(),
  installments: z.number().int().min(1).max(48).optional(),
}).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' })

export type CreateCreditCardDto = z.infer<typeof CreateCreditCardSchema>
export type UpdateCreditCardDto = z.infer<typeof UpdateCreditCardSchema>
export type CreateCreditCardChargeDto = z.infer<typeof CreateCreditCardChargeSchema>
export type UpdateCreditCardChargeDto = z.infer<typeof UpdateCreditCardChargeSchema>
