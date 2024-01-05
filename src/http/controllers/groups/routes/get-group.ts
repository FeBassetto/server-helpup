/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetGroupUseCase } from '@/use-cases/group/factories/make-get-group'

export async function getGroup(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user

  const getGroupParamsSchema = z.object({
    groupId: z.string(),
  })

  const getGroupQuerySchema = z.object({
    offset: z.string().optional(),
    orderBy: z.enum(['asc', 'desc']).optional(),
    query: z.string().optional(),
  })

  const { groupId } = getGroupParamsSchema.parse(request.params)
  const { offset, orderBy, query } = getGroupQuerySchema.parse(request.query)

  const getGroupUseCase = makeGetGroupUseCase()

  const {
    group,
    participants: { pages, participants, totalParticipants },
  } = await getGroupUseCase.execute({
    groupId,
    offset: offset ? Number(offset) : 0,
    orderBy,
    query,
  })

  const modifiedParticipants = participants.map((participant) => {
    const user = participant.user
    return {
      id: participant.id,
      name: user.name,
      city: user.city,
      profile_url: user.profile_url,
    }
  })

  const isAdmin = sub === group.admin_id
  const isUser = participants.some((participant) => participant.user_id === sub)

  reply.send({
    group,
    participants_data: {
      pages,
      participants: modifiedParticipants,
      totalParticipants,
    },
    isAdmin,
    isUser,
  })
}
