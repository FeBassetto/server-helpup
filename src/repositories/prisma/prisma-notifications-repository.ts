import { Notification, NotificationType } from '@prisma/client'

import { NotificationRepository } from '../notifications-repository'

import { prisma } from '@/lib/prisma'

export class PrismaNotificationRepository implements NotificationRepository {
  async getNotificationById(
    notificationId: string,
  ): Promise<Notification | null> {
    return await prisma.notification.findUnique({
      where: { id: notificationId },
    })
  }

  async createByUserId(
    userId: string,
    type: NotificationType,
    id?: string,
  ): Promise<void> {
    const notificationData: {
      type: NotificationType
      user_id: string
      id?: string
    } = {
      type,
      user_id: userId,
    }

    if (id) {
      notificationData.id = id
    }

    await prisma.notification.create({
      data: notificationData,
    })
  }

  async markAsReadById(notificationId: string): Promise<void> {
    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read_at: new Date(),
      },
    })
  }

  async markAllAsReadyByUserId(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { user_id: userId, read_at: null },
      data: {
        read_at: new Date(),
      },
    })
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return await prisma.notification.findMany({
      where: {
        user_id: userId,
      },
    })
  }
}
