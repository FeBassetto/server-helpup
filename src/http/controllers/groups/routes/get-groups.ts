import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetGroupsUseCase } from '@/use-cases/group/factories/make-get-groups'

export async function getGroups(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user

  const getEventsQuerySchema = z.object({
    offset: z.string().optional(),
    orderBy: z.enum(['asc', 'desc']).optional(),
    query: z.string().optional(),
  })

  const { offset, orderBy, query } = getEventsQuerySchema.parse(request.query)

  const getGroupsUseCase = makeGetGroupsUseCase()

  const { groups, totalGroups, totalPages } = await getGroupsUseCase.execute(
    sub,
    {
      offset: Number(offset) || 0,
      title: query || '',
      orderBy,
    },
  )

  reply.send({ groups, totalGroups, totalPages })
}
