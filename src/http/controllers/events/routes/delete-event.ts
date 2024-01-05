import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeDeleteEventUseCase } from '@/use-cases/event/factories/make-delete-event'

export async function deleteEvent(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const deleteEventParamsSchema = z.object({
    eventId: z.string(),
  })

  const { eventId } = deleteEventParamsSchema.parse(request.params)

  const deleteEventUseCase = makeDeleteEventUseCase()

  await deleteEventUseCase.execute(sub, eventId)

  reply.send()
}
