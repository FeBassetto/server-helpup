import { NotificationRepository } from '@/repositories/notifications-repository'

export class GetNotificationsUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(userId: string, onlyNew: boolean) {
    if (!onlyNew) {
      return await this.notificationRepository.getNotificationsByUserId(userId)
    }

    return await this.notificationRepository.getNewNotificationsByUserId(userId)
  }
}
