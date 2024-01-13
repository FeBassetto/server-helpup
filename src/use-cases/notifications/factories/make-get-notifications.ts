import { GetNotificationsUseCase } from '../get-notifications'

import { PrismaNotificationRepository } from '@/repositories/prisma/prisma-notifications-repository'

export function makeGetNotificationsUseCase() {
  const notificationRepository = new PrismaNotificationRepository()

  const getNotificationsUseCase = new GetNotificationsUseCase(
    notificationRepository,
  )

  return getNotificationsUseCase
}
