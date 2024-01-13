import { Group, Prisma } from '@prisma/client'

import { env } from '@/env'

import {
  GetGroupsByDistanceAndQueryResponse,
  GroupRepository,
  GroupsQuery,
} from '../groups-repository'

import { prisma } from '@/lib/prisma'

export class PrismaGroupRepository implements GroupRepository {
  async getGroupsByDistanceAndQuery({
    lat,
    long,
    query: { offset = 0, title = '', orderBy },
  }: GroupsQuery): Promise<GetGroupsByDistanceAndQueryResponse> {
    const numberOfItems = env.NUMBER_RESULTS
    const orderByDirection = orderBy === 'desc' ? 'DESC' : 'ASC'

    const groups = await prisma.$queryRaw<Group[]>`
      SELECT "groups".*, (
        6371 * acos(
          cos(radians(${lat})) * cos(radians("users"."latitude")) * cos(radians("users"."longitude") - radians(${long})) +
          sin(radians(${lat})) * sin(radians("users"."latitude"))
        )
      ) AS distance
      FROM "groups"
      INNER JOIN "users" ON "groups"."admin_id" = "users"."id"
      WHERE "groups"."title" ILIKE ${'%' + title + '%'}
      AND (
        6371 * acos(
          cos(radians(${lat})) * cos(radians("users"."latitude")) * cos(radians("users"."longitude") - radians(${long})) +
          sin(radians(${lat})) * sin(radians("users"."latitude"))
        )
      ) <= 100
      ORDER BY distance ${Prisma.raw(orderByDirection)}
      LIMIT ${numberOfItems}
      OFFSET ${offset}
    `

    const totalGroupsResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count
      FROM "groups"
      INNER JOIN "users" ON "groups"."admin_id" = "users"."id"
      WHERE "groups"."title" ILIKE ${'%' + title + '%'}
      AND (
        6371 * acos(
          cos(radians(${lat})) * cos(radians("users"."latitude")) * cos(radians("users"."longitude") - radians(${long})) +
          sin(radians(${lat})) * sin(radians("users"."latitude"))
        )
      ) <= 100
    `

    const totalGroups = totalGroupsResult[0]
      ? Number(totalGroupsResult[0].count)
      : 0
    const totalPages = Math.ceil(totalGroups / numberOfItems)

    return {
      groups,
      totalPages,
      totalGroups,
    }
  }

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
