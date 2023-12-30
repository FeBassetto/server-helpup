import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeSendFriendshipUseCase } from '@/use-cases/friendships/factories/make-send-friendship-use-case'

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

  await sendFriendshipUseCase.execute({ senderId: sub, receiverId: sentUserId })

  reply.status(201).send()
}
