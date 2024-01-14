import { ReadNotificationUseCase } from '../read-notification'

import { PrismaNotificationRepository } from '@/repositories/prisma/prisma-notifications-repository'

export function makeReadNotificationsUseCase() {
  const notificationRepository = new PrismaNotificationRepository()

  const readNotificationUseCase = new ReadNotificationUseCase(
    notificationRepository,
  )

  return readNotificationUseCase
}
