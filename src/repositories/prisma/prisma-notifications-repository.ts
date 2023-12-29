import { Notification, NotificationType } from '@prisma/client'

import { NotificationRepository } from '../notifications-repository'

import { prisma } from '@/lib/prisma'

export class PrismaNotificationRepository implements NotificationRepository {
  async createByUserId(userId: string, type: NotificationType): Promise<void> {
    await prisma.notification.create({
      data: {
        type,
        user_id: userId,
      },
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
