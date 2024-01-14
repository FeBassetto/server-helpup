import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeSendResetPasswordUseCase } from '@/use-cases/users/factories/make-send-reset-password-use-case'

export async function resetPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const resetPasswordSchema = z.object({
    email: z.string().email(),
  })

  const { email } = resetPasswordSchema.parse(request.body)

  const resetPasswordUseCase = makeSendResetPasswordUseCase()

  const user = await resetPasswordUseCase.execute({ email })

  const token = await reply.jwtSign(
    {
      isAdmin: user.is_admin,
      isConfirmed: user.is_confirmed,
      isDeleteMail: true,
    },
    {
      sign: {
        sub: user.id,
      },
    },
  )

  await resetPasswordUseCase.execute({ email, token })

  reply.send().status(200)
}
