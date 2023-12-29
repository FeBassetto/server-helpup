import { Friendship, Prisma } from '@prisma/client'

export interface FrendshipPayload {
  userId1: string
  userId2: string
}

export interface FriendshipsRepository {
  createFriendship(data: FrendshipPayload): Promise<Friendship>
  getFriendshipByUsersId(data: FrendshipPayload): Promise<Friendship | null>
  getFriendShipById(friendshipId: string): Promise<Friendship | null>
  getAllUserFriendships(userId: string): Promise<Friendship[]>
  getAllUserFriendshipsRequest(userId: string): Promise<Friendship[]>
  getFriendshipInvitates(userId: string): Promise<Friendship[]>
  getSendFriendshipInvitates(userId: string): Promise<Friendship[]>
  updateFriendshipById(
    data: Prisma.FriendshipUpdateInput,
    friendShipId: string,
  ): Promise<void>
  deleteFriendshipById(friendshipId: string): Promise<void>
}
