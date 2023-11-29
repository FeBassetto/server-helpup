import { UndoFriendshipUseCase } from '../../friendships/undo-friendship'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeUndoFriendshipUseCase() {
  const usersRepository = new PrismaUsersRepository()

  const undoFriendShipUseCase = new UndoFriendshipUseCase(usersRepository)

  return undoFriendShipUseCase
}
