import { Friendship, Prisma, User } from '@prisma/client'

export interface FriendshipPayload {
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
}

export interface GetFriendshipPayload {
  userId: string
  friendId: string
}

export interface FriendshipWithUserData extends Friendship {
  sender: User
  receiver: User
}

export interface FriendshipWithPagination {
  friendships: Friendship[]
  totalPages: number
}

export interface FriendshipWithUserDataAndPagination {
  friendships: FriendshipWithUserData[]
  totalPages: number
}

export interface FriendshipsRepository {
  createFriendship(data: FriendshipPayload): Promise<Friendship>
  getFriendshipByUsersId(data: GetFriendshipPayload): Promise<Friendship | null>
  getFriendShipById(friendshipId: string): Promise<Friendship | null>
  getUserFriendShips(
    userId: string,
    offset: number,
    query: string,
  ): Promise<FriendshipWithUserDataAndPagination>
  getAllUserFriendships(userId: string): Promise<Friendship[]>
  getAllUserFriendshipsRequest(userId: string): Promise<Friendship[]>
  getFriendshipInvitates(
    userId: string,
    offset: number,
  ): Promise<FriendshipWithPagination>
  getSendFriendshipInvitates(
    userId: string,
    offset: number,
  ): Promise<FriendshipWithPagination>
  updateFriendshipById(
    data: Prisma.FriendshipUpdateInput,
    friendShipId: string,
  ): Promise<void>
  deleteFriendshipById(friendshipId: string): Promise<void>
}
