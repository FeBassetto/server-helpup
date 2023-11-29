import { UndoFriendshipUseCase } from '../undo-friendship'

import { PrismaFriendshipRepository } from '@/repositories/prisma/prisma-friendships-repository'

export function makeUndoFriendshipUseCase() {
  const friendshipRepository = new PrismaFriendshipRepository()

  const undoFriendShipUseCase = new UndoFriendshipUseCase(friendshipRepository)

  return undoFriendShipUseCase
}
