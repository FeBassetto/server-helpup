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
  query?: string
}

export interface updateUserByIdPayload {
  data: Prisma.UserUpdateInput
  userId: string
}

export interface updatePasswordPaylaod {
  userId: string
  password_hash: string
}

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  createConfirmationCode(userId: string): Promise<ConfirmationCode>

  confirmUserEmail(id: string): Promise<User>

  findUserByEmail(email: string): Promise<User | null>
  findUserById(id: string): Promise<User | null>
  findUserByNick(nick: string): Promise<User | null>
  findUserByEmailOrNick(data: FindByEmailAndNickPayload): Promise<User | null>

  getConfirmationCodeByMinutes(
    data: GetConfirmationCodeByMinutesPayload,
  ): Promise<ConfirmationCode[]>
  getFriendSuggestions(data: getFriendSuggestionsPayload): Promise<User[]>
  getUserDataById(id: string): Promise<User | null>
  getUsersByDistance(
    latitude: number,
    longitude: number,
    kilometers: number,
  ): Promise<User[]>

  updateUserById(data: updateUserByIdPayload): Promise<User>
  updatePassword(data: updatePasswordPaylaod): Promise<User>

  deleteUserDataById(id: string): Promise<void>
  deleteUserStatusById(id: string): Promise<void>
}
