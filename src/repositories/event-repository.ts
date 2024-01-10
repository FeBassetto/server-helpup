import { Event, EventType, Prisma } from '@prisma/client'

export interface EventQuery {
  title?: string
  orderBy?: 'asc' | 'desc'
  offset: number
  type?: EventType
}

export interface EventsQuery {
  lat: number
  long: number
  query: EventQuery
}

export interface GetEventsByDistanceAndQueryResponse {
  events: Event[]
  totalPages: number
  totalEvents: number
}

export interface EventRepository {
  create(data: Prisma.EventCreateInput): Promise<Event>

  getEvent(eventId: string): Promise<Event | null>
  getEventByTitle(title: string): Promise<Event | null>
  getEventsByUserId(userId: string): Promise<Event[]>
  getEventsByGroupId(groupId: string): Promise<Event[]>

  getEventsByDistanceAndQuery(
    data: EventsQuery,
  ): Promise<GetEventsByDistanceAndQueryResponse>

  update(eventId: string, data: Prisma.EventUpdateInput): Promise<Event | null>

  delete(eventId: string): Promise<void>
}
