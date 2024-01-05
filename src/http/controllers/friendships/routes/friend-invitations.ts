import { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetFriendShipInvitations } from '@/use-cases/friendships/factories/make-get-friendship-invitations'

export async function friendInvitations(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const getFriendshipInvitatesUseCase = makeGetFriendShipInvitations()

  const { invitations, sentInvitations } =
    await getFriendshipInvitatesUseCase.execute(sub)

  reply.status(200).send({ invitations, sentInvitations })
}
