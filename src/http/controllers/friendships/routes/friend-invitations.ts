import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetFriendShipInvitations } from '@/use-cases/friendships/factories/make-get-friendship-invitations'

export async function friendInvitations(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const getFrienSuggestionsQuerySchema = z.object({
    offset: z.coerce.number({
      required_error: 'O campo "offset" é obrigatório.',
    }),
    isSentInvites: z.enum(['true', 'false']),
  })

  const { offset, isSentInvites } = getFrienSuggestionsQuerySchema.parse(
    request.query,
  )

  const getFriendshipInvitatesUseCase = makeGetFriendShipInvitations()

  const { totalPages, invitations } =
    await getFriendshipInvitatesUseCase.execute(
      sub,
      offset,
      isSentInvites === 'true',
    )

  reply.status(200).send({ totalPages, invitations })
}
