import { makeResendConfirmationUseCase } from '@/use-cases/users/factories/make-resend-confirmation-use-case'
import { makeSendConfirmationUseCase } from '@/use-cases/users/factories/make-send-confirmation-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function resendConfirmation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const resendConfirmationEmailBodySchema = z.object({
    email: z.string().email(),
  })

  const { email } = resendConfirmationEmailBodySchema.parse(request.body)

  const resendConfirmationUseCase = makeResendConfirmationUseCase()

  const user = await resendConfirmationUseCase.execute(email)

  const token = await reply.jwtSign(
    {
      isAdmin: user.is_admin,
      isConfirmed: user.is_confirmed,
    },
    {
      sign: {
        sub: user.id,
      },
    },
  )

  const sendConfitmationUseCase = makeSendConfirmationUseCase()

  await sendConfitmationUseCase.execute({ email, token })

  return reply.status(201).send()
}
