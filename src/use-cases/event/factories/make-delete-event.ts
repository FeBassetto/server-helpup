import { DeleteEventUseCase } from '../delete-event'

import { PrismaEventRepository } from '@/repositories/prisma/prisma-event-repository'

export function makeDeleteEventUseCase() {
  const eventRepository = new PrismaEventRepository()
  const deleteEventUseCase = new DeleteEventUseCase(eventRepository)
  return deleteEventUseCase
}
