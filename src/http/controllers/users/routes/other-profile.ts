/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

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

  const otherProfileUseCase = makeGetOtherUserProfileUseCase()

  const user = await otherProfileUseCase.execute({ id: sub, userId })

  const {
    is_deleted,
    is_admin,
    is_confirmed,
    password_hash,
    email,
    longitude,
    latitude,
    cep,
    ...userWithoutSensitiveData
  } = user?.data!

  reply.status(200).send({
    user: {
      data: userWithoutSensitiveData,
    },
  })
}
