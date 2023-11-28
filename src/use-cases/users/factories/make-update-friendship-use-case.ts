import { UpdateFriendshipUseCase } from '../update-friendship'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeUpdateFriendshipUseCase() {
  const usersRepository = new PrismaUsersRepository()

  const updateFriendShipUseCase = new UpdateFriendshipUseCase(usersRepository)

  return updateFriendShipUseCase
}
