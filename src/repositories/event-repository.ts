import { Event, Prisma } from '@prisma/client'

export interface EventRepository {
  create(data: Prisma.EventCreateInput): Promise<Event>

  getEvent(eventId: string): Promise<Event | null>
  getEventByTitle(title: string): Promise<Event | null>
  getEventsByUserId(userId: string): Promise<Event[]>
  getEventsByGroupId(groupId: string): Promise<Event[]>

  update(eventId: string, data: Prisma.EventUpdateInput): Promise<Event | null>

  delete(eventId: string): Promise<void>
}
