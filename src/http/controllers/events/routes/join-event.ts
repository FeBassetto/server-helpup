import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeJoinEventUseCase } from '@/use-cases/event/factories/make-join-event'

export async function joinEvent(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user

  const joinEVentParamsSchema = z.object({
    eventId: z.string(),
  })

  const { eventId } = joinEVentParamsSchema.parse(request.params)

  const joinEventUseCase = makeJoinEventUseCase()

  await joinEventUseCase.execute(sub, eventId)

  reply.send()
}
