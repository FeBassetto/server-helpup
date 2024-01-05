import { UpdateFriendshipUseCase } from '../update-friendship'

import { PrismaFriendshipRepository } from '@/repositories/prisma/prisma-friendships-repository'

export function makeUpdateFriendshipUseCase() {
  const friendshipRepository = new PrismaFriendshipRepository()

  const updateFriendShipUseCase = new UpdateFriendshipUseCase(
    friendshipRepository,
  )

  return updateFriendShipUseCase
}
