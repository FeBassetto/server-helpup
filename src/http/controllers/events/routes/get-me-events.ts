import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetUserEventsUseCase } from '@/use-cases/event/factories/make-get-user-events'

export async function getMeEvents(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const getEventsQuerySchema = z.object({
    offset: z.string().optional(),
    query: z.string().optional(),
  })

  const { offset = '0', query = '' } = getEventsQuerySchema.parse(request.query)

  const numberOffset = Number(offset)

  const getUserEventsUseCase = makeGetUserEventsUseCase()

  const { events, totalPages } = await getUserEventsUseCase.execute(
    sub,
    numberOffset,
    query,
  )

  reply.send({ events, totalPages })
}
