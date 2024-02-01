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

    const typeCondition = type
      ? Prisma.sql`AND "type" = ${Prisma.raw(`'${type}'::"EventType"`)}`
      : Prisma.empty

    const events = await prisma.$queryRaw<Event[]>`
      SELECT "events".*, (
        6371 * acos(
          cos(radians(${lat})) * cos(radians("events"."latitude")) * cos(radians("events"."longitude") - radians(${long})) +
          sin(radians(${lat})) * sin(radians("events"."latitude"))
        )
      ) AS "distance"
      FROM "events"
      WHERE "events"."title" ILIKE ${'%' + title + '%'}
      AND (
        6371 * acos(
          cos(radians(${lat})) * cos(radians("events"."latitude")) * cos(radians("events"."longitude") - radians(${long})) +
          sin(radians(${lat})) * sin(radians("events"."latitude"))
        )
      ) <= 100
      ${typeCondition}
      ORDER BY distance ${Prisma.raw(orderByDirection)}
      LIMIT ${numberOfItems} OFFSET ${offset * numberOfItems}
    `

    const totalEventsResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count
      FROM "events"
      WHERE "events"."title" ILIKE ${'%' + title + '%'}
      AND (
        6371 * acos(
          cos(radians(${lat})) * cos(radians("events"."latitude")) * cos(radians("events"."longitude") - radians(${long})) +
          sin(radians(${lat})) * sin(radians("events"."latitude"))
        )
      ) <= 100
      ${typeCondition}
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

  async getEventsByUserId(
    userId: string,
    offset: number,
    query: string,
  ): Promise<{ events: Event[]; totalPages: number }> {
    const take = env.NUMBER_RESULTS
    const skip = offset * take

    const events = await prisma.event.findMany({
      where: {
        admin_id: userId,
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take,
      skip,
    })

    const totalCount = await prisma.event.count({
      where: {
        admin_id: userId,
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
    })

    const totalPages = Math.ceil(totalCount / take)

    return { events, totalPages }
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
