import { GetUserEventsUseCase } from '../get-user-events'

import { PrismaEventRepository } from '@/repositories/prisma/prisma-event-repository'

export function makeGetUserEventsUseCase() {
  const eventRepository = new PrismaEventRepository()

  const getUserEventsUseCase = new GetUserEventsUseCase(eventRepository)
  return getUserEventsUseCase
}
