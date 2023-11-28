import { SendFriendshipUseCase } from '../send-friendship'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeSendFriendshipUseCase() {
  const usersRepository = new PrismaUsersRepository()

  const sendFriendShipUseCase = new SendFriendshipUseCase(usersRepository)

  return sendFriendShipUseCase
}
