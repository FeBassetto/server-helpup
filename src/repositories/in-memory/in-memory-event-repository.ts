import { Event, Prisma } from '@prisma/client'

import { EventRepository } from '../event-repository'

export class InMemoryEventRepository implements EventRepository {
  private events: Event[] = []

  async create(data: Prisma.EventCreateInput): Promise<void> {
    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      created_at: new Date(),
    } as unknown as Event

    this.events.push(newEvent)
  }

  async getEvent(eventId: string): Promise<Event | null> {
    return this.events.find((event) => event.id === eventId) || null
  }

  async getEventsByUserId(userId: string): Promise<Event[]> {
    return this.events.filter((event) => event.admin_id === userId)
  }

  async getEventsByGroupId(groupId: string): Promise<Event[]> {
    return this.events.filter((event) => event.group_id === groupId)
  }

  async update(
    eventId: string,
    data: Prisma.EventUpdateInput,
  ): Promise<Event | null> {
    const index = this.events.findIndex((event) => event.id === eventId)
    if (index === -1) return null

    const eventToUpdate = this.events[index]

    if (typeof data.title === 'string') {
      eventToUpdate.title = data.title
    }
    if (typeof data.description === 'string') {
      eventToUpdate.description = data.description
    }

    this.events[index] = eventToUpdate
    return eventToUpdate
  }

  async delete(eventId: string): Promise<void> {
    const index = this.events.findIndex((event) => event.id === eventId)
    if (index !== -1) {
      this.events.splice(index, 1)
    }
  }
}
