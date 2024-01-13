import { UpdateFriendshipUseCase } from '../update-friendship'

import { PrismaFriendshipRepository } from '@/repositories/prisma/prisma-friendships-repository'
import { PrismaNotificationRepository } from '@/repositories/prisma/prisma-notifications-repository'

export function makeUpdateFriendshipUseCase() {
  const friendshipRepository = new PrismaFriendshipRepository()
  const notificationsRepository = new PrismaNotificationRepository()

  const updateFriendShipUseCase = new UpdateFriendshipUseCase(
    friendshipRepository,
    notificationsRepository,
  )

  return updateFriendShipUseCase
}
