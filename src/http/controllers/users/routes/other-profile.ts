import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetUserEventsUseCase } from '@/use-cases/event/factories/make-get-user-events'
import { makeGetFriendFriendshipsUseCase } from '@/use-cases/friendships/factories/make-get-friend-friendships'
import { makeGetUserGroupsUseCase } from '@/use-cases/group/factories/make-get-user-groups'
import { makeGetOtherUserProfileUseCase } from '@/use-cases/users/factories/make-get-other-user-profile-use-case'

export async function otherProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const otherProfileParamsSchema = z.object({
    userId: z.string({
      required_error: 'O campo "userId" é obrigatório.',
    }),
  })

  const { userId } = otherProfileParamsSchema.parse(request.params)

  const getFrienSuggestionsQuerySchema = z.object({
    offset: z.coerce.number({
      required_error: 'O campo "offset" é obrigatório.',
    }),
    query: z.string().optional(),
  })

  const { offset, query } = getFrienSuggestionsQuerySchema.parse(request.query)

  const otherProfileUseCase = makeGetOtherUserProfileUseCase()
  const getFriendFriendshipUseCase = makeGetFriendFriendshipsUseCase()
  const getUserGroups = makeGetUserGroupsUseCase()
  const getUserEvents = makeGetUserEventsUseCase()

  const [
    user,
    { friendShips, isFriends, totalPages, friendShipId },
    groups,
    events,
  ] = await Promise.all([
    otherProfileUseCase.execute({ id: sub, userId }),
    getFriendFriendshipUseCase.execute({
      userId: sub,
      friendId: userId,
      offset,
      query,
    }),
    getUserGroups.execute(userId, 0, ''),
    getUserEvents.execute(userId, 0, ''),
  ])

  reply.status(200).send({
    user: {
      data: user,
      friendShips,
      isFriends,
      friendShipId,
      totalFriendsPage: totalPages,
      groups,
      events,
    },
  })
}
