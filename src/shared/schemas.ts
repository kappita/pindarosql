import { z } from 'zod'

export const silabaSchema = z.object({
  word: z.string(),
  difficulty: z.number().or(z.string().transform(Number)),
  answer_value: z.number().or(z.string().transform(Number))
})

export const uploadSilabasSchema = z.object({
  admin_email: z.string().email(),
  admin_password: z.string(),
  silabas: z.array(silabaSchema)
})

export const addUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  course: z.string(),
  name: z.string(),
})

export const addAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  name: z.string(),
  secret_key: z.string()
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

const questionAnswer = z.object({
  question_id: z.number(),
  answer: z.number()
})

export const sessionAnswers = z.object({
  session_id: z.string(),
  email: z.string().email().nullable(),
  password: z.string().nullable(),
  answers: z.array(questionAnswer)
})

export const acentualSchema = z.object({
  phrase: z.string(),
})

export const uploadAcentualSchema = z.object({
  admin_email: z.string().email(),
  admin_password: z.string(),
  acentuales: z.array(acentualSchema)
})


export const rimaSchema = z.object({
  word: z.string(),
  category: z.string(),
  rhyme: z.string()
})
export const uploadRimaSchema = z.object({
  admin_email: z.string().email(),
  admin_password: z.string(),
  rimas: z.array(rimaSchema)
})

export const adminCredentialsSchema = z.object({
  admin_email: z.string().email(),
  admin_password: z.string()
})

export const deleteByIdSchema = z.object({
  admin_email: z.string().email(),
  admin_password: z.string(),
  ids: z.array(z.number())
})