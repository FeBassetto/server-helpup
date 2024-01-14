import { Event, Prisma } from '@prisma/client'

import { env } from '@/env'

import {
  EventRepository,
  EventsQuery,
  GetEventsByDistanceAndQueryResponse,
} from '../event-repository'

import { prisma } from '@/lib/prisma'

export class PrismaEventRepository implements EventRepository {
  async getEventsByDistanceAndQuery({
    lat,
    long,
    query: { offset = 0, orderBy, title = '', type },
  }: EventsQuery): Promise<GetEventsByDistanceAndQueryResponse> {
    const numberOfItems = env.NUMBER_RESULTS
    const orderByDirection = orderBy === 'desc' ? 'DESC' : 'ASC'

    const typeCondition = type ? `AND "type" = ${type}` : ''

    const events = await prisma.$queryRaw<Event[]>`
      SELECT *, (
        6371 * acos(
          cos(radians(${lat})) * cos(radians("latitude")) * cos(radians("longitude") - radians(${long})) +
          sin(radians(${lat})) * sin(radians("latitude"))
        )
      ) AS distance
      FROM "events"
      WHERE "title" ILIKE ${'%' + title + '%'}
      AND (
        6371 * acos(
          cos(radians(${lat})) * cos(radians("latitude")) * cos(radians("longitude") - radians(${long})) +
          sin(radians(${lat})) * sin(radians("latitude"))
        )
      ) <= 100
      ${Prisma.raw(typeCondition)}
      ORDER BY distance ${Prisma.raw(orderByDirection)}
      LIMIT ${numberOfItems}
      OFFSET ${offset}
    `

    const totalEventsResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count
      FROM "events"
      WHERE "title" ILIKE ${'%' + title + '%'}
      AND (
        6371 * acos(
          cos(radians(${lat})) * cos(radians("latitude")) * cos(radians("longitude") - radians(${long})) +
          sin(radians(${lat})) * sin(radians("latitude"))
        )
      ) <= 100
      ${typeCondition ? Prisma.raw(typeCondition) : Prisma.raw('')}
    `

    const totalEvents = totalEventsResult[0]
      ? Number(totalEventsResult[0].count)
      : 0
    const totalPages = Math.ceil(totalEvents / numberOfItems)

    return {
      events,
      totalPages,
      totalEvents,
    }
  }

  async getEventByTitle(title: string): Promise<Event | null> {
    return await prisma.event.findUnique({ where: { title } })
  }

  async create(data: Prisma.EventCreateInput): Promise<Event> {
    return await prisma.event.create({ data })
  }

  async getEvent(eventId: string): Promise<Event | null> {
    return await prisma.event.findUnique({ where: { id: eventId } })
  }

  async getEventsByUserId(userId: string): Promise<Event[]> {
    return await prisma.event.findMany({ where: { admin_id: userId } })
  }

  async getEventsByGroupId(groupId: string): Promise<Event[]> {
    return await prisma.event.findMany({ where: { group_id: groupId } })
  }

  async update(
    eventId: string,
    data: Prisma.EventUpdateInput,
  ): Promise<Event | null> {
    return await prisma.event.update({ where: { id: eventId }, data })
  }

  async delete(eventId: string): Promise<void> {
    await prisma.event.delete({ where: { id: eventId } })
  }
}
