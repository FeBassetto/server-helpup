import { NotificationRepository } from '@/repositories/notifications-repository'

export class GetNotificationsUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(userId: string, offset: number, onlyNew: boolean) {
    if (!onlyNew) {
      return await this.notificationRepository.getNotificationsByUserId(
        userId,
        offset,
      )
    }

    return await this.notificationRepository.getNewNotificationsByUserId(
      userId,
      offset,
    )
  }
}
