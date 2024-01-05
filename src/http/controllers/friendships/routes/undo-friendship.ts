import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeUndoFriendshipUseCase } from '@/use-cases/friendships/factories/make-undo-friendship-use-case'

export async function undoFriendship(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const routeParamsSchema = z.object({
    friendshipId: z.string({
      required_error: 'O parâmetro "friendshipId" é obrigatório.',
    }),
  })

  const { friendshipId } = routeParamsSchema.parse(request.params)

  const undoFriendShipUseCase = makeUndoFriendshipUseCase()

  await undoFriendShipUseCase.execute({ friendshipId, userId: sub })

  return reply.status(204).send()
}
