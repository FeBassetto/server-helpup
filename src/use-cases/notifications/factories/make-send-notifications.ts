import { SendNotificationUseCase } from '../send-notification'

import { PrismaNotificationRepository } from '@/repositories/prisma/prisma-notifications-repository'

export function makeSendNotificationsUseCase() {
  const notificationRepository = new PrismaNotificationRepository()

  const sendNotificationsUseCase = new SendNotificationUseCase(
    notificationRepository,
  )

  return sendNotificationsUseCase
}
