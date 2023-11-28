import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeSendDeleteMailUseCase } from '@/use-cases/users/factories/make-send-delete-mail-use-case'

export async function sendDeleteMail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { user } = request

  const registerBodySchema = z.object({
    deleteData: z.boolean({
      required_error: 'O campo deleteData deve ser um valor booleano.',
    }),
  })

  const { deleteData } = registerBodySchema.parse(request.body)

  const sendDeleteMailUseCase = makeSendDeleteMailUseCase()

  const token = await reply.jwtSign(
    {
      isAdmin: user.isAdmin,
      isConfirmed: user.isConfirmed,
      isDeleteMail: true,
    },
    {
      sign: {
        sub: user.sub,
      },
    },
  )

  await sendDeleteMailUseCase.execute({ id: user.sub, token, deleteData })
}
