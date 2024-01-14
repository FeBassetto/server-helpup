import { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetUserEventsUseCase } from '@/use-cases/event/factories/make-get-user-events'

export async function getMeEvents(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const getUserEventsUseCase = makeGetUserEventsUseCase()

  const events = await getUserEventsUseCase.execute(sub)

  reply.send({ events })
}
