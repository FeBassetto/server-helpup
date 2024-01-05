import { GetGroupEventsUseCase } from '../get-group-events'

import { PrismaEventRepository } from '@/repositories/prisma/prisma-event-repository'

export function makeGetGroupEventsUseCase() {
  const eventRepository = new PrismaEventRepository()

  const getGroupEventsUseCase = new GetGroupEventsUseCase(eventRepository)
  return getGroupEventsUseCase
}
