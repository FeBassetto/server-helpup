import { randomUUID } from 'crypto'

import { ConfirmationCode, Prisma, User } from '@prisma/client'

import {
  FindByEmailAndNickPayload,
  GetConfirmationCodeByMinutesPayload,
  UsersRepository,
} from '../users-repository'

import { AppError } from '@/shared/errors/AppError'
import { DayjsDateProvider } from '@/shared/providers/DateProvider/implementations/dayjs-date-provider'
import { usersErrorsConstants } from '@/use-cases/users/errors/constants'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []
  public confirmationCodes: ConfirmationCode[] = []

  async create({
    cep,
    city,
    created_at,
    description,
    email,
    is_admin,
    is_confirmed,
    is_deleted,
    latitude,
    longitude,
    name,
    nick,
    password_hash,
    profile_url,
  }: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      cep,
      city,
      created_at: created_at ? new Date(created_at) : new Date(),
      description,
      email,
      is_admin: !!is_admin,
      is_confirmed: !!is_confirmed,
      is_deleted: !!is_deleted,
      latitude,
      longitude,
      name,
      nick,
      password_hash,
      profile_url: profile_url || 'no_image.png',
    }

    this.users.push(user)

    return user
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null
  }

  async findUserByEmailOrNick({
    email,
    nick,
  }: FindByEmailAndNickPayload): Promise<User | null> {
    return (
      this.users.find((user) => user.email === email || user.nick === nick) ||
      null
    )
  }

  async confirmUserEmail(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id)

    if (!user) throw new AppError(usersErrorsConstants.ACCOUNT_NOT_FOUND)

    user.is_confirmed = true
    return user
  }

  async createConfirmationCode(
    userId: string,
  ): Promise<{ id: number; created_at: Date; user_id: string }> {
    const newCode: ConfirmationCode = {
      id: this.confirmationCodes.length + 1,
      user_id: userId,
      created_at: new Date(),
    }
    this.confirmationCodes.push(newCode)

    return newCode
  }

  async getConfirmationCodeByMinutes({
    minutes,
    userId,
  }: GetConfirmationCodeByMinutesPayload): Promise<ConfirmationCode[]> {
    const dateProvider = new DayjsDateProvider()
    const dateLimit = dateProvider.addMinutes(-minutes)

    return this.confirmationCodes.filter(
      (code) => code.user_id === userId && code.created_at >= dateLimit,
    )
  }

  async getUserDataById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null
  }

  async deleteUserStatusById(id: string): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === id)
    if (userIndex >= 0) {
      this.users[userIndex].is_deleted = true
    }
  }

  async deleteUserDataById(id: string): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === id)
    if (userIndex >= 0) {
      this.users.splice(userIndex, 1)
    }
  }
}
