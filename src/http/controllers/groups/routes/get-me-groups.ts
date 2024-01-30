import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetUserGroupsUseCase } from '@/use-cases/group/factories/make-get-user-groups'

export async function getMeGroups(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const getEventsQuerySchema = z.object({
    offset: z.string().optional(),
    query: z.string().optional(),
  })

  const { offset, query = '' } = getEventsQuerySchema.parse(request.query)

  const numberOffset = offset ? Number(offset) : 0

  const getUserGroupsUseCase = makeGetUserGroupsUseCase()

  const { groups, totalPages } = await getUserGroupsUseCase.execute(
    sub,
    numberOffset,
    query,
  )

  reply.send({ groups, totalPages })
}
