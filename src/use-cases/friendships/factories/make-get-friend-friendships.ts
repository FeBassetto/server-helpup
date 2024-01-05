import { GetFriendFriendshipsUseCase } from '../get-friend-friendships'

import { PrismaFriendshipRepository } from '@/repositories/prisma/prisma-friendships-repository'

export function makeGetFriendFriendshipsUseCase() {
  const friendshipRepository = new PrismaFriendshipRepository()

  const getFriendFriendshipsUseCase = new GetFriendFriendshipsUseCase(
    friendshipRepository,
  )

  return getFriendFriendshipsUseCase
}
