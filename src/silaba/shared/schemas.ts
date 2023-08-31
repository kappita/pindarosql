import { z } from 'zod'

export const silabaSchema = z.object({
  word: z.string(),
  difficulty: z.number().or(z.string().transform(Number)),
  answer_value: z.number().or(z.string().transform(Number))
})

export const uploadSilabasSchema = z.object({
  adminEmail: z.string(),
  adminPassword: z.string(),
  silabas: z.array(silabaSchema)
})