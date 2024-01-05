import { SendFriendshipUseCase } from '../send-friendship'

import { PrismaFriendshipRepository } from '@/repositories/prisma/prisma-friendships-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeSendFriendshipUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const friendshipRepository = new PrismaFriendshipRepository()

  const sendFriendShipUseCase = new SendFriendshipUseCase(
    usersRepository,
    friendshipRepository,
  )

  return sendFriendShipUseCase
}
