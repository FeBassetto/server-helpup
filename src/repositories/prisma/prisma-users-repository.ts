import { Prisma, User } from '@prisma/client'
import { FindByEmailAndNickPayload, UsersRepository } from '../users-repository'
import { prisma } from '@/lib/prisma'

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
}
