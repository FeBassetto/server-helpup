import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetFriendShipInvitations } from '@/use-cases/friendships/factories/make-get-friendship-invitations'

export async function friendInvitations(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const getFrienSuggestionsQuerySchema = z.object({
    isSentInvites: z.enum(['true', 'false']),
  })

  const { isSentInvites } = getFrienSuggestionsQuerySchema.parse(request.query)

  const getFriendshipInvitatesUseCase = makeGetFriendShipInvitations()

  const { totalPages, invitations } =
    await getFriendshipInvitatesUseCase.execute(sub, isSentInvites === 'true')

  reply.status(200).send({ totalPages, invitations })
}
