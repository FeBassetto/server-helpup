import { FastifyRequest } from 'fastify'
import { z } from 'zod'

import { AppError } from '@/shared/errors/AppError'
import { usersErrorsConstants } from '@/use-cases/users/errors/constants'
import { makeUpdatePasswordUseCase } from '@/use-cases/users/factories/make-update-password-use-case'

export async function updatePassword(request: FastifyRequest) {
  const { sub } = request.user

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)/

  const updatePasswordBodySchema = z.object({
    password: z
      .string()
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
      .refine((password) => passwordRegex.test(password), {
        message:
          'A senha deve conter pelo menos uma letra maiúscula e um número.',
      }),
    confirm_password: z
      .string()
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
      .refine((password) => passwordRegex.test(password), {
        message:
          'A senha deve conter pelo menos uma letra maiúscula e um número.',
      }),
  })

  const { confirm_password, password } = updatePasswordBodySchema.parse(
    request.body,
  )

  if (confirm_password !== password) {
    throw new AppError(usersErrorsConstants.PASSWORD_NOT_SAME)
  }

  const updatePassword = makeUpdatePasswordUseCase()

  await updatePassword.execute({ password, userId: sub })
}
