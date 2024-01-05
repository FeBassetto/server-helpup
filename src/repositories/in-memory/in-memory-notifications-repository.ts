import { randomUUID } from 'node:crypto'

import { Notification, NotificationType } from '@prisma/client'

import { NotificationRepository } from '../notifications-repository'

export class InMemoryNotificationRepository implements NotificationRepository {
  private notifications: Notification[] = []

  async getNotificationById(
    notificationId: string,
  ): Promise<Notification | null> {
    const notification = this.notifications.find(
      (notification) => notification.id === notificationId,
    )

    return notification || null
  }

  async createByUserId(
    userId: string,
    type: NotificationType,
    id?: string,
  ): Promise<void> {
    const newNotification: Notification = {
      id: id || randomUUID(),
      user_id: userId,
      type,
      read_at: null,
      created_at: new Date(),
    }

    this.notifications.push(newNotification)
  }

  async markAsReadById(notificationId: string): Promise<void> {
    const notificationIndex = this.notifications.findIndex(
      (n) => n.id === notificationId,
    )
    if (notificationIndex !== -1) {
      this.notifications[notificationIndex] = {
        ...this.notifications[notificationIndex],
        read_at: new Date(),
      }
    }
  }

  async markAllAsReadyByUserId(userId: string): Promise<void> {
    this.notifications.forEach((notification, index) => {
      if (notification.user_id === userId && notification.read_at === null) {
        this.notifications[index] = {
          ...notification,
          read_at: new Date(),
        }
      }
    })
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return this.notifications.filter(
      (notification) => notification.user_id === userId,
    )
  }
}
