import { Notification, NotificationType } from '@prisma/client'

export interface NotificationWithPagination {
  notifications: Notification[]
  totalPages: number
}

export interface NotificationRepository {
  createByUserId(
    userId: string,
    type: NotificationType,
    redirectId: string,
    title: string,
  ): Promise<void>

  createManyByUsersId(
    usersId: string[],
    type: NotificationType,
    redirectId: string,
    title: string,
  ): Promise<void>

  markAsReadById(notificationId: string): Promise<void>
  markAllAsReadyByUserId(userId: string): Promise<void>

  getNotificationById(notificationId: string): Promise<Notification | null>
  getNotificationsByUserId(userId: string): Promise<NotificationWithPagination>

  getNewNotificationsByUserId(
    userId: string,
  ): Promise<NotificationWithPagination>
}
