import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeUpdateFriendshipUseCase } from '@/use-cases/friendships/factories/make-update-friendship-use-case'

export async function updateFriendship(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const routeParamsSchema = z.object({
    friendshipId: z.string({
      required_error: 'O parâmetro "friendshipId" é obrigatório.',
    }),
  })

  const updateFriendshipBodySchema = z.object({
    accept: z.boolean({ required_error: 'O campo "accept" é obrigatório.' }),
  })

  const { friendshipId } = routeParamsSchema.parse(request.params)
  const { accept } = updateFriendshipBodySchema.parse(request.body)

  const updateFriendshipUseCase = makeUpdateFriendshipUseCase()

  await updateFriendshipUseCase.execute({ accept, friendshipId, userId: sub })

  return reply.status(200).send()
}
