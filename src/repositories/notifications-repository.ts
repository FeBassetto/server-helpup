import { Notification, NotificationType } from '@prisma/client'

export interface NotificationRepository {
  createByUserId(userId: string, type: NotificationType): Promise<void>

  markAsReadById(notificationId: string): Promise<void>
  markAllAsReadyByUserId(userId: string): Promise<void>

  getNotificationsByUserId(userId: string): Promise<Notification[]>
}
