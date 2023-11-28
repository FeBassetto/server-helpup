import { ConfirmationCode, Friendship, Prisma, User } from '@prisma/client'

export interface FindByEmailAndNickPayload {
  email: string
  nick: string
}

export interface GetConfirmationCodeByMinutesPayload {
  userId: string
  minutes: number
}

export interface FrendshipPayload {
  userId1: string
  userId2: string
}

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findUserByEmail(email: string): Promise<User | null>
  findUserById(id: string): Promise<User | null>
  findUserByEmailOrNick(data: FindByEmailAndNickPayload): Promise<User | null>
  confirmUserEmail(id: string): Promise<User>
  createConfirmationCode(userId: string): Promise<ConfirmationCode>
  getConfirmationCodeByMinutes(
    data: GetConfirmationCodeByMinutesPayload,
  ): Promise<ConfirmationCode[]>
  getUserDataById(id: string): Promise<User | null>
  deleteUserDataById(id: string): Promise<void>
  deleteUserStatusById(id: string): Promise<void>

  createFriendship(data: FrendshipPayload): Promise<void>
  getFriendshipByUsersId(data: FrendshipPayload): Promise<Friendship | null>
  getFriendShipById(friendshipId: string): Promise<Friendship | null>
  getAllUserFriendships(userId: string): Promise<Friendship[]>
  getFriendshipInvitates(userId: string): Promise<Friendship[]>
  getSendFriendshipInvitates(userId: string): Promise<Friendship[]>
  updateFriendshipById(
    data: Prisma.FriendshipUpdateInput,
    friendShipId: string,
  ): Promise<void>
  deleteFriendshipById(friendshipId: string): Promise<void>
}
