import { Friendship, Prisma } from '@prisma/client'

export interface FriendshipPayload {
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
}

export interface GetFriendshipPayload {
  senderId: string
  receiverId: string
}

export interface FriendshipsRepository {
  createFriendship(data: FriendshipPayload): Promise<Friendship>
  getFriendshipByUsersId(data: GetFriendshipPayload): Promise<Friendship | null>
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
