import { GetMeFriendshipsUseCase } from '../get-me-friendships'

import { PrismaFriendshipRepository } from '@/repositories/prisma/prisma-friendships-repository'

export function makeGetMeFriendshipsUseCase() {
  const friendshipsRepository = new PrismaFriendshipRepository()

  const useCase = new GetMeFriendshipsUseCase(friendshipsRepository)

  return useCase
}
