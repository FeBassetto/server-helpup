import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeUnjoinEventUseCase } from '@/use-cases/event/factories/make-unjoin-event'

export async function unjoinEvent(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const unjoinEventParamsSchema = z.object({
    eventId: z.string(),
  })

  const { eventId } = unjoinEventParamsSchema.parse(request.params)

  const useCase = makeUnjoinEventUseCase()

  await useCase.execute(sub, eventId)

  reply.send()
}
