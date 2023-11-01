import { makeRegisterUseCase } from '@/use-cases/users/factories/make-register-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)/

  const registerBodySchema = z.object({
    name: z
      .string()
      .min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' })
      .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' }),
    nick: z
      .string()
      .min(3, { message: 'O apelido deve ter pelo menos 3 caracteres.' })
      .max(30, { message: 'O apelido deve ter no máximo 30 caracteres.' }),
    description: z
      .string()
      .max(200, { message: 'A descrição deve ter no máximo 200 caracteres.' }),
    email: z.string().email({ message: 'E-mail inválido.' }),
    password: z
      .string()
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
      .refine((password) => passwordRegex.test(password), {
        message:
          'A senha deve conter pelo menos uma letra maiúscula e um número.',
      }),
    cep: z.string().regex(/^\d{8}$/, {
      message: 'CEP inválido. Deve conter 8 dígitos.',
    }),
    neighborhood: z.string(),
    street: z.string(),
    city: z.string(),
    number: z.number().int(),
  })

  const data = registerBodySchema.parse(request.body)

  const registerUseCase = makeRegisterUseCase()

  const response = await registerUseCase.execute(data)

  return reply.status(201).send(response)
}
