import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeRegisterUseCase } from '@/use-cases/users/factories/make-register-use-case'
import { makeSendConfirmationUseCase } from '@/use-cases/users/factories/make-send-confirmation-use-case'

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
    lat: z
      .number()
      .min(-90, { message: 'Latitude inválida. Deve estar entre -90 e 90.' })
      .max(90, { message: 'Latitude inválida. Deve estar entre -90 e 90.' })
      .optional(),
    lon: z
      .number()
      .min(-180, {
        message: 'Longitude inválida. Deve estar entre -180 e 180.',
      })
      .max(180, { message: 'Longitude inválida. Deve estar entre -180 e 180.' })
      .optional(),
  })

  const data = registerBodySchema.parse(request.body)

  const registerUseCase = makeRegisterUseCase()

  const user = await registerUseCase.execute(data)

  const token = await reply.jwtSign(
    {
      isAdmin: user.is_admin,
      isConfirmed: user.is_confirmed,
      isConfirmMail: true,
    },
    {
      sign: {
        sub: user.id,
      },
    },
  )

  const sendConfitmationUseCase = makeSendConfirmationUseCase()

  await sendConfitmationUseCase.execute({ email: user.email, token })

  return reply.status(201).send()
}
