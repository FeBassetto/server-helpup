import { ConfirmationCode, Prisma, User } from '@prisma/client'
import {
  FindByEmailAndNickPayload,
  GetConfirmationCodeByMinutesPayload,
  UsersRepository,
} from '../users-repository'
import { prisma } from '@/lib/prisma'
import { DayjsDateProvider } from '@/shared/providers/DateProvider/implementations/dayjs-date-provider'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

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
}
