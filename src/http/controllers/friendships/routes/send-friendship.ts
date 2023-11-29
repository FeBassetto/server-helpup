import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeSendFriendshipUseCase } from '@/use-cases/users/factories/make-send-friendship-use-case'

export async function SendFriendShip(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const sendFriendshipBodySchema = z.object({
    sentUserId: z.string({
      required_error: 'O campo "sentUserId" é obrigatório.',
    }),
  })

  const { sentUserId } = sendFriendshipBodySchema.parse(request.body)

  const sendFriendshipUseCase = makeSendFriendshipUseCase()

  await sendFriendshipUseCase.execute({ userId1: sub, userId2: sentUserId })

  reply.status(201).send()
}
