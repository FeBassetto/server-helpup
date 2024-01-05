import { Group, Prisma } from '@prisma/client'

import { GroupRepository } from '../groups-repository'

import { prisma } from '@/lib/prisma'

export class PrismaGroupRepository implements GroupRepository {
  async create(data: Prisma.GroupCreateInput): Promise<Group> {
    return await prisma.group.create({ data })
  }

  async getById(groupId: string): Promise<Group | null> {
    return await prisma.group.findUnique({ where: { id: groupId } })
  }

  async getGroupsByUserId(userId: string): Promise<Group[]> {
    return await prisma.group.findMany({ where: { admin_id: userId } })
  }

  async getByTitle(title: string): Promise<Group | null> {
    return await prisma.group.findUnique({ where: { title } })
  }

  async update(groupId: string, data: Prisma.GroupUpdateInput): Promise<Group> {
    return await prisma.group.update({ where: { id: groupId }, data })
  }

  async delete(groupId: string): Promise<void> {
    await prisma.group.delete({ where: { id: groupId } })
  }
}
