import { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetUserEventsUseCase } from '@/use-cases/event/factories/make-get-user-events'
import { makeGetProfileFriendshipsUseCase } from '@/use-cases/friendships/factories/make-get-profile-friendships'
import { makeGetUserGroupsUseCase } from '@/use-cases/group/factories/make-get-user-groups'
import { makeGetUserProfileUseCase } from '@/use-cases/users/factories/make-get-user-profile-use-case'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user

  const getDataUseCase = makeGetUserProfileUseCase()
  const getProfileFriendships = makeGetProfileFriendshipsUseCase()
  const getUserGroups = makeGetUserGroupsUseCase()
  const getUserEvents = makeGetUserEventsUseCase()

  const [user, friendShips, groups, events] = await Promise.all([
    getDataUseCase.execute(sub),
    getProfileFriendships.execute(sub),
    getUserGroups.execute(sub),
    getUserEvents.execute(sub),
  ])

  return reply.status(200).send({
    user: {
      data: user,
      friendShips,
      groups,
      events,
    },
  })
}
