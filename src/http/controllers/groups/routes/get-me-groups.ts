import { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetUserGroupsUseCase } from '@/use-cases/group/factories/make-get-user-groups'

export async function getMeGroups(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const getUserGroupsUseCase = makeGetUserGroupsUseCase()

  const groups = await getUserGroupsUseCase.execute(sub)

  reply.send({ groups })
}
