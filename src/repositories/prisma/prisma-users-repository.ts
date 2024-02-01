import { ConfirmationCode, Prisma, User } from '@prisma/client'

import { env } from '@/env'

import {
  FindByEmailAndNickPayload,
  GetConfirmationCodeByMinutesPayload,
  UsersRepository,
  getFriendSuggestionsPayload,
  updatePasswordPaylaod,
  updateUserByIdPayload,
} from '../users-repository'

import { prisma } from '@/lib/prisma'
import { DayjsDateProvider } from '@/shared/providers/DateProvider/implementations/dayjs-date-provider'

export class PrismaUsersRepository implements UsersRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } })

    return user
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } })

    return user
  }

  async findUserByEmailOrNick({
    email,
    nick,
  }: FindByEmailAndNickPayload): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { OR: [{ email }, { nick }] },
    })

    return user
  }

  async confirmUserEmail(id: string): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: { is_confirmed: true },
    })

    return user
  }

  async createConfirmationCode(userId: string): Promise<ConfirmationCode> {
    const newCode = await prisma.confirmationCode.create({
      data: {
        user_id: userId,
      },
    })

    return newCode
  }

  async getConfirmationCodeByMinutes({
    minutes,
    userId,
  }: GetConfirmationCodeByMinutesPayload): Promise<ConfirmationCode[]> {
    const dateProvider = new DayjsDateProvider()
    const thirtyMinutesAgo = dateProvider.addMinutes(-minutes)

    const confirmationCode = await prisma.confirmationCode.findMany({
      where: {
        user_id: userId,
        created_at: {
          gte: thirtyMinutesAgo,
        },
      },
    })

    return confirmationCode
  }

  async getUsersByDistance(
    latitude: number,
    longitude: number,
    kilometers: number,
  ): Promise<User[]> {
    const earthRadiusInMeters = 6371

    return await prisma.$queryRaw<User[]>`
      SELECT * from users
      WHERE (
        ${earthRadiusInMeters} * acos(
          cos(radians(${latitude})) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians(${longitude})) +
          sin(radians(${latitude})) *
          sin(radians(latitude))
        )
      ) <= ${kilometers}
      ORDER BY (
        ${earthRadiusInMeters} * acos(
          cos(radians(${latitude})) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians(${longitude})) +
          sin(radians(${latitude})) *
          sin(radians(latitude))
        )
      )
    `
  }

  async getFriendSuggestions({
    latitude,
    longitude,
    offset,
    ignoreIdList,
    query,
  }: getFriendSuggestionsPayload): Promise<{
    users: User[]
    totalPages: number
  }> {
    const limit = env.NUMBER_RESULTS

    let nameFilter = ''
    let nickFilter = ''
    if (query) {
      nameFilter = `AND "name" ILIKE '%${query}%'`
      nickFilter = `OR "nick" ILIKE '%${query}%'`
    }

    const suggestions = await prisma.$queryRaw<User[]>`
      SELECT * FROM "users"
      WHERE "id" NOT IN (${Prisma.join(ignoreIdList)})
      ${Prisma.raw(nameFilter)}
      ${Prisma.raw(nickFilter)}
      AND (
        6371 * acos(
          cos(radians(${latitude})) * cos(radians("latitude")) * cos(radians("longitude") - radians(${longitude})) +
          sin(radians(${latitude})) * sin(radians("latitude"))
        )
      ) <= 100 
      ORDER BY (
        6371 * acos(
          cos(radians(${latitude})) * cos(radians("latitude")) * cos(radians("longitude") - radians(${longitude})) +
          sin(radians(${latitude})) * sin(radians("latitude"))
        )
      ) ASC
      OFFSET ${offset}
      LIMIT ${limit}
    `

    const totalUsersResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count
      FROM "users"
      WHERE "id" NOT IN (${Prisma.join(ignoreIdList)})
      ${Prisma.raw(nameFilter)}
      ${Prisma.raw(nickFilter)}
      AND (
        6371 * acos(
          cos(radians(${latitude})) * cos(radians("latitude")) * cos(radians("longitude") - radians(${longitude})) +
          sin(radians(${latitude})) * sin(radians("latitude"))
        )
      ) <= 100
    `

    const totalUsers = totalUsersResult[0]
      ? Number(totalUsersResult[0].count)
      : 0
    const totalPages = Math.ceil(totalUsers / limit)

    return {
      users: suggestions,
      totalPages,
    }
  }

  async getUserDataById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    return user
  }

  async deleteUserDataById(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } })
  }

  async deleteUserStatusById(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { is_deleted: true },
    })
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async updateUserById({ data, userId }: updateUserByIdPayload): Promise<User> {
    return await prisma.user.update({ where: { id: userId }, data })
  }

  async findUserByNick(nick: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { nick } })
  }

  async updatePassword({
    password_hash,
    userId,
  }: updatePasswordPaylaod): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data: { password_hash },
    })
  }
}
