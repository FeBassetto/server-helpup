import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { EventType } from '@prisma/client'

import { makeGetEventsUseCase } from '@/use-cases/event/factories/make-get-events'

export async function getEvents(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user

  const eventTypeValues = Object.values(EventType).filter(
    (value) => typeof value === 'string',
  ) as [string, ...string[]]

  const getEventsQuerySchema = z.object({
    offset: z.string().optional(),
    orderBy: z.enum(['asc', 'desc']).optional(),
    query: z.string().optional(),
    type: z.enum(eventTypeValues).optional(),
  })

  const { offset, orderBy, query, type } = getEventsQuerySchema.parse(
    request.query,
  )

  const getEventsUseCase = makeGetEventsUseCase()

  const { events, totalEvents, totalPages } = await getEventsUseCase.execute(
    sub,
    {
      offset: Number(offset) || 0,
      title: query,
      type: type as EventType,
      orderBy,
    },
  )

  reply.send({ events, totalEvents, totalPages })
}
