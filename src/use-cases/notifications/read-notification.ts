import { notificationErrorsConstants } from './errors/constants'

import { NotificationRepository } from '@/repositories/notifications-repository'
import { AppError } from '@/shared/errors/AppError'

interface ReadNotificationUseCaseRequest {
  readAll?: boolean
  notificationId?: string
  userId: string
}

export class ReadNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    notificationId,
    readAll,
    userId,
  }: ReadNotificationUseCaseRequest) {
    if (notificationId === undefined && readAll === undefined) {
      throw new AppError(notificationErrorsConstants.ACTION_NOT_ALLOWED)
    }

    if (readAll) {
      return await this.notificationRepository.markAllAsReadyByUserId(userId)
    }

    if (notificationId) {
      const notification =
        await this.notificationRepository.getNotificationById(notificationId)

      if (notification && notification.user_id === userId) {
        return await this.notificationRepository.markAsReadById(notificationId)
      }

      throw new AppError(notificationErrorsConstants.ACTION_NOT_ALLOWED)
    }
  }
}
