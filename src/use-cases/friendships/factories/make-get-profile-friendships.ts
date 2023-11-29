import { GetProfileFriendshipsUseCase } from '../get-profile-friendships'

import { PrismaFriendshipRepository } from '@/repositories/prisma/prisma-friendships-repository'

export function makeGetProfileFriendshipsUseCase() {
  const friendshipRepository = new PrismaFriendshipRepository()

  const getProfileFriendshipsUseCase = new GetProfileFriendshipsUseCase(
    friendshipRepository,
  )

  return getProfileFriendshipsUseCase
}
