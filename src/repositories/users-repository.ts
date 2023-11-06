import { ConfirmationCode, Prisma, User } from '@prisma/client'

export interface FindByEmailAndNickPayload {
  email: string
  nick: string
}

export interface GetConfirmationCodeByMinutesPayload {
  userId: string
  minutes: number
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
}
