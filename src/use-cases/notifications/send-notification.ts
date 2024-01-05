import { NotificationType } from '@prisma/client'

import { NotificationRepository } from '@/repositories/notifications-repository'

interface SendNotificationUseCaseRequest {
  id?: string
  userId: string
  type: NotificationType
}

export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({ userId, type, id }: SendNotificationUseCaseRequest) {
    await this.notificationRepository.createByUserId(userId, type, id)
  }
}
