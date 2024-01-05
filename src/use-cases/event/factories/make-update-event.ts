import { UpdateEventUseCase } from '../update-event'

import { PrismaEventRepository } from '@/repositories/prisma/prisma-event-repository'

export function makeUpdateEventUseCase() {
  const eventRepository = new PrismaEventRepository()
  const updateEventUseCase = new UpdateEventUseCase(eventRepository)
  return updateEventUseCase
}
