import { ConfirmationCode, Friendship, Prisma, User } from '@prisma/client'

import {
  FindByEmailAndNickPayload,
  FrendshipPayload,
  GetConfirmationCodeByMinutesPayload,
  UsersRepository,
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

  async createFriendship({
    userId1,
    userId2,
  }: FrendshipPayload): Promise<void> {
    await prisma.friendship.create({
      data: {
        userId1,
        userId2,
      },
    })
  }

  async getFriendshipByUsersId({
    userId1,
    userId2,
  }: FrendshipPayload): Promise<Friendship | null> {
    return await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId1, userId2 },
          { userId1: userId2, userId2: userId1 },
        ],
      },
    })
  }

  async getFriendShipById(friendshipId: string): Promise<Friendship | null> {
    return await prisma.friendship.findUnique({
      where: { id: friendshipId },
    })
  }

  async getAllUserFriendships(userId: string): Promise<Friendship[]> {
    return await prisma.friendship.findMany({
      where: {
        OR: [{ userId1: userId }, { userId2: userId }],
        isAccepted: true,
      },
    })
  }

  async getFriendshipInvitates(userId: string): Promise<Friendship[]> {
    return await prisma.friendship.findMany({
      where: { userId2: userId, isAccepted: null },
    })
  }

  async getSendFriendshipInvitates(userId: string): Promise<Friendship[]> {
    return await prisma.friendship.findMany({
      where: { userId1: userId, isAccepted: null },
    })
  }

  async updateFriendshipById(
    data: Prisma.FriendshipUpdateInput,
    friendShipId: string,
  ): Promise<void> {
    await prisma.friendship.update({ where: { id: friendShipId }, data })
  }

  async deleteFriendshipById(friendshipId: string): Promise<void> {
    await prisma.friendship.delete({ where: { id: friendshipId } })
  }
}
