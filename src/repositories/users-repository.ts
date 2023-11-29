import { ConfirmationCode, Prisma, User } from '@prisma/client'

export interface FindByEmailAndNickPayload {
  email: string
  nick: string
}

export interface GetConfirmationCodeByMinutesPayload {
  userId: string
  minutes: number
}

export interface getFriendSuggestionsPayload {
  latitude: number
  longitude: number
  offset: number
  ignoreIdList: Array<string>
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
  getFriendSuggestions(data: getFriendSuggestionsPayload): Promise<User[]>
  getUserDataById(id: string): Promise<User | null>
  deleteUserDataById(id: string): Promise<void>
  deleteUserStatusById(id: string): Promise<void>
}
