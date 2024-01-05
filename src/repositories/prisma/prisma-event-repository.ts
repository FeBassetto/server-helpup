import { Event, Prisma } from '@prisma/client'

import { EventRepository } from '../event-repository'

import { prisma } from '@/lib/prisma'

export class PrismaEventRepository implements EventRepository {
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
