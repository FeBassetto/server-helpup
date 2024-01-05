import { GetFriendSuggestionsUseCase } from '../get-friend-suggestions'

import { PrismaFriendshipRepository } from '@/repositories/prisma/prisma-friendships-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeGetFriendSuggestionsUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const friendshipRepository = new PrismaFriendshipRepository()

  const sendFriendShipUseCase = new GetFriendSuggestionsUseCase(
    usersRepository,
    friendshipRepository,
  )

  return sendFriendShipUseCase
}
