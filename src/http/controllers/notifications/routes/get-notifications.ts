import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetNotificationsUseCase } from '@/use-cases/notifications/factories/make-get-notifications'

export async function getNotifications(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const getNotificationsQuerySchema = z.object({
    offset: z.coerce.number(),
    onlyNew: z.enum(['false', 'true']),
  })

  const { offset, onlyNew } = getNotificationsQuerySchema.parse(request.query)

  const isOnlyNew = onlyNew === 'true'

  const getNotificationsUseCase = makeGetNotificationsUseCase()

  const { notifications, totalPages } = await getNotificationsUseCase.execute(
    sub,
    offset,
    isOnlyNew,
  )

  reply.send({ notifications, totalPages })
}
