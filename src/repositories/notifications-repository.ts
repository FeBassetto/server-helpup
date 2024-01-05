import { Notification, NotificationType } from '@prisma/client'

export interface NotificationRepository {
  createByUserId(
    userId: string,
    type: NotificationType,
    id?: string,
  ): Promise<void>

  markAsReadById(notificationId: string): Promise<void>
  markAllAsReadyByUserId(userId: string): Promise<void>

  getNotificationById(notificationId: string): Promise<Notification | null>
  getNotificationsByUserId(userId: string): Promise<Notification[]>
}
