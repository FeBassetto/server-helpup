import { Prisma, User } from '@prisma/client'

export interface FindByEmailAndNickPayload {
  email: string
  nick: string
}

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findUserByEmail(email: string): Promise<User | null>
  findUserByEmailAndNick(data: FindByEmailAndNickPayload): Promise<User | null>
}
