import { NotificationRepository } from '@/repositories/notifications-repository'

export class GetNotificationsUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(userId: string) {
    return await this.notificationRepository.getNotificationsByUserId(userId)
  }
}
