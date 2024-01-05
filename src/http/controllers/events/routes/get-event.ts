import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetEventUseCase } from '@/use-cases/event/factories/make-get-event'

export async function getEvent(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user

  const getEventParamsSchema = z.object({
    eventId: z.string(),
  })

  const getEventQuerySchema = z.object({
    offset: z.string().optional(),
    orderBy: z.enum(['asc', 'desc']).optional(),
    query: z.string().optional(),
  })

  const { eventId } = getEventParamsSchema.parse(request.params)
  const { offset, orderBy, query } = getEventQuerySchema.parse(request.query)

  const getEventUseCase = makeGetEventUseCase()

  const {
    event,
    participants: { pages, participants, totalParticipants },
  } = await getEventUseCase.execute({
    eventId,
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

  const isAdmin = sub === event.admin_id
  const isUser = participants.some((participant) => participant.user_id === sub)

  reply.send({
    event,
    participants_data: {
      pages,
      participants: modifiedParticipants,
      totalParticipants,
    },
    isAdmin,
    isUser,
  })
}
