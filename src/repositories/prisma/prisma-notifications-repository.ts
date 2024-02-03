import { Notification, NotificationType } from '@prisma/client'

import { env } from '@/env'

import {
  NotificationRepository,
  NotificationWithPagination,
} from '../notifications-repository'

import { prisma } from '@/lib/prisma'

export class PrismaNotificationRepository implements NotificationRepository {
  async getNotificationById(
    notificationId: string,
  ): Promise<Notification | null> {
    return await prisma.notification.findUnique({
      where: { id: notificationId },
    })
  }

  async createManyByUsersId(
    usersId: string[],
    type: NotificationType,
    redirectId: string,
    title: string,
  ): Promise<void> {
    await prisma.notification.createMany({
      data: usersId.map((usersId) => {
        return { redirect_id: redirectId, type, user_id: usersId, title }
      }),
    })
  }

  async createByUserId(
    userId: string,
    type: NotificationType,
    redirectId: string,
    title: string,
  ): Promise<void> {
    await prisma.notification.create({
      data: {
        type,
        user_id: userId,
        redirect_id: redirectId,
        title,
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

  async getNotificationsByUserId(
    userId: string,
  ): Promise<NotificationWithPagination> {
    const numberOfItems = env.NUMBER_RESULTS

    const notifications = await prisma.notification.findMany({
      where: {
        user_id: userId,
      },
      orderBy: { created_at: 'desc' },
    })

    const totalNotifications = await prisma.notification.count({
      where: {
        user_id: userId,
      },
    })

    const totalPages = Math.ceil(totalNotifications / numberOfItems)

    return { totalPages, notifications }
  }

  async getNewNotificationsByUserId(
    userId: string,
  ): Promise<NotificationWithPagination> {
    const numberOfItems = env.NUMBER_RESULTS

    const notifications = await prisma.notification.findMany({
      where: {
        user_id: userId,
        read_at: null,
      },
      orderBy: { created_at: 'desc' },
    })

    const totalNotifications = await prisma.notification.count({
      where: {
        user_id: userId,
        read_at: null,
      },
    })

    const totalPages = Math.ceil(totalNotifications / numberOfItems)

    return { totalPages, notifications }
  }
}
