import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeReadNotificationsUseCase } from '@/use-cases/notifications/factories/make-read-notifications'

export async function markNotificationRead(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const markNotificationsReadBodySchema = z.object({
    notificationId: z.string().optional(),
    readAll: z.boolean().optional(),
  })

  const { notificationId, readAll } = markNotificationsReadBodySchema.parse(
    request.body,
  )

  const readNotificationUseCase = makeReadNotificationsUseCase()

  await readNotificationUseCase.execute({
    notificationId,
    readAll,
    userId: sub,
  })

  reply.send()
}
