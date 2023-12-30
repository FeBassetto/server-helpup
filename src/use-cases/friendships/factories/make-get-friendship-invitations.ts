import { GetFriendshipInvitationsUseCase } from '../get-friendship-invitations'

import { PrismaFriendshipRepository } from '@/repositories/prisma/prisma-friendships-repository'

export function makeGetFriendShipInvitations() {
  const friendshipRepository = new PrismaFriendshipRepository()

  const getFriendShipInvitationsUseCase = new GetFriendshipInvitationsUseCase(
    friendshipRepository,
  )

  return getFriendShipInvitationsUseCase
}
