/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetUserProfileUseCase } from '@/use-cases/users/factories/make-get-user-profile-use-case'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user

  const getDataUseCase = makeGetUserProfileUseCase()

  const user = await getDataUseCase.execute(sub)

  const {
    is_deleted,
    is_admin,
    is_confirmed,
    password_hash,
    ...userWithoutSensitiveData
  } = user?.data!

  const friendShipsWithoutSensitiveData = user?.friendShips!.map(
    (friendship) => {
      const { isAccepted, ...friendshipWithoutAccepted } = friendship
      return friendshipWithoutAccepted
    },
  )

  return reply.status(200).send({
    user: {
      data: userWithoutSensitiveData,
      friendShips: friendShipsWithoutSensitiveData,
    },
  })
}
