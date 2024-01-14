import { SendFriendshipUseCase } from '../send-friendship'

import { PrismaFriendshipRepository } from '@/repositories/prisma/prisma-friendships-repository'
import { PrismaNotificationRepository } from '@/repositories/prisma/prisma-notifications-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeSendFriendshipUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const friendshipRepository = new PrismaFriendshipRepository()
  const notificationsRepository = new PrismaNotificationRepository()

  const sendFriendShipUseCase = new SendFriendshipUseCase(
    usersRepository,
    friendshipRepository,
    notificationsRepository,
  )

  return sendFriendShipUseCase
}
