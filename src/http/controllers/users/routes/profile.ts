import { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetProfileFriendshipsUseCase } from '@/use-cases/friendships/factories/make-get-profile-friendships'
import { makeGetUserProfileUseCase } from '@/use-cases/users/factories/make-get-user-profile-use-case'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user

  const getDataUseCase = makeGetUserProfileUseCase()
  const getProfileFriendships = makeGetProfileFriendshipsUseCase()

  const [user, friendShips] = await Promise.all([
    getDataUseCase.execute(sub),
    getProfileFriendships.execute(sub),
  ])

  return reply.status(200).send({
    user: {
      data: user,
      friendShips,
    },
  })
}
