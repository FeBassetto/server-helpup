import { randomUUID } from 'crypto'

import { ConfirmationCode, Prisma, User } from '@prisma/client'

import {
  FindByEmailAndNickPayload,
  GetConfirmationCodeByMinutesPayload,
  UsersRepository,
  getFriendSuggestionsPayload,
  updateUserByIdPayload,
} from '../users-repository'

import { AppError } from '@/shared/errors/AppError'
import { DayjsDateProvider } from '@/shared/providers/DateProvider/implementations/dayjs-date-provider'
import { usersErrorsConstants } from '@/use-cases/users/errors/constants'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordenates'

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = []
  private confirmationCodes: ConfirmationCode[] = []

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
      latitude: new Prisma.Decimal(String(latitude)),
      longitude: new Prisma.Decimal(String(longitude)),
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

  async getFriendSuggestions({
    ignoreIdList,
    latitude,
    longitude,
    offset,
  }: getFriendSuggestionsPayload): Promise<User[]> {
    const limit = 10

    const filteredUsers = this.users.filter(
      (user) => !ignoreIdList.includes(user.id),
    )

    const sortedUsers = filteredUsers.sort((userA, userB) => {
      const fromCoordinate = { latitude, longitude }
      const toCoordinate = {
        latitude: userA.latitude.toNumber(),
        longitude: userA.longitude.toNumber(),
      }
      const distanceA = getDistanceBetweenCoordinates(
        fromCoordinate,
        toCoordinate,
      )

      const toCoordinateB = {
        latitude: userB.latitude.toNumber(),
        longitude: userB.longitude.toNumber(),
      }
      const distanceB = getDistanceBetweenCoordinates(
        fromCoordinate,
        toCoordinateB,
      )

      return distanceA - distanceB
    })

    const startIndex = offset
    const endIndex = startIndex + limit
    const paginatedUsers = sortedUsers.slice(startIndex, endIndex)

    return paginatedUsers
  }

  async updateUserById({ data, userId }: updateUserByIdPayload): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
      throw new AppError(usersErrorsConstants.ACCOUNT_NOT_FOUND)
    }

    const currentUser = this.users[userIndex]
    const updatedUser: User = {
      ...currentUser,
      id: currentUser.id as string,
    }

    if (data.name !== undefined) {
      updatedUser.name =
        typeof data.name === 'string' ? data.name : currentUser.name
    }

    if (data.nick !== undefined) {
      updatedUser.nick =
        typeof data.nick === 'string' ? data.nick : currentUser.nick
    }

    if (data.description !== undefined) {
      updatedUser.description =
        typeof data.description === 'string'
          ? data.description
          : currentUser.description
    }

    this.users[userIndex] = updatedUser

    return updatedUser
  }
}
