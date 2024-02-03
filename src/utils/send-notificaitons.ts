import { FastifyInstance } from 'fastify'

import { NotificationType } from '@prisma/client'

import { sendWsMessages } from './send-ws-message'

import { NotificationRepository } from '@/repositories/notifications-repository'

interface SendNotificationsUtils {
  app: FastifyInstance
  notificationRepository: NotificationRepository
  userIds: string[]
  title: string
  message: string
  type: NotificationType
  redirectId: string
}

export async function sendNotificationsUtils({
  app,
  notificationRepository,
  message,
  title,
  userIds,
  type,
  redirectId,
}: SendNotificationsUtils) {
  await notificationRepository.createManyByUsersId(
    userIds,
    type,
    redirectId,
    title,
  )

  sendWsMessages(app, userIds, message, title)
}
