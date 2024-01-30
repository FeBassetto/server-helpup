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

    // Consulta SQL para buscar os grupos com base na paginação e filtro
    const groups = await prisma.$queryRaw<Group[]>`
      SELECT "groups".*
      FROM "groups"
      INNER JOIN "users" ON "groups"."admin_id" = "users"."id"
      WHERE "groups"."title" ILIKE ${'%' + title + '%'}
      AND (
        6371 * acos(
          cos(radians(${lat})) * cos(radians("users"."latitude")) * cos(radians("users"."longitude") - radians(${long})) +
          sin(radians(${lat})) * sin(radians("users"."latitude"))
        )
      ) <= 100
      ORDER BY (
        6371 * acos(
          cos(radians(${lat})) * cos(radians("users"."latitude")) * cos(radians("users"."longitude") - radians(${long})) +
          sin(radians(${lat})) * sin(radians("users"."latitude"))
        )
      ) ${Prisma.raw(orderByDirection)}
      LIMIT ${numberOfItems} OFFSET ${offset * numberOfItems}
    `

    // Consulta SQL para contar o número total de grupos com base no filtro
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

  async getGroupsByUserId(
    userId: string,
    page: number = 1,
    searchQuery?: string,
  ): Promise<{ groups: Group[]; totalPages: number }> {
    const pageSize = 6
    const skip = page * pageSize
    let where: Prisma.GroupWhereInput = { admin_id: userId }

    if (searchQuery) {
      where = {
        ...where,
        title: {
          contains: searchQuery,
        },
      }
    }

    const [groups, totalCount] = await Promise.all([
      prisma.group.findMany({
        where,
        skip,
        take: pageSize,
      }),
      prisma.group.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / pageSize)

    return { groups, totalPages }
  }

  async getByTitle(title: string): Promise<Group | null> {
    return await prisma.group.findUnique({ where: { title } })
  }

  async update(groupId: string, data: Prisma.GroupUpdateInput): Promise<Group> {
    return await prisma.group.update({ where: { id: groupId }, data })
  }

  async delete(groupId: string): Promise<void> {
    await prisma.participant.deleteMany({
      where: { group_id: groupId },
    })

    await prisma.group.delete({ where: { id: groupId } })
  }
}
